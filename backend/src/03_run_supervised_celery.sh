# get django environment variables
celeryenv=`cat /opt/python/current/env | tr '\n' ',' | sed 's/export //g' | sed 's/$PATH/%(ENV_PATH)s/g' | sed 's/$PYTHONPATH//g' | sed 's/$LD_LIBRARY_PATH//g' | sed 's/%/%%/g'`
celeryenv=${celeryenv%?}

# create celery beat config script
celerybeatconf="[program:celeryd-beat]
; Set full path to celery program if using virtualenv
command=/opt/python/run/venv/bin/celery beat -A lexvoco --loglevel=INFO --workdir=/tmp -S django --pidfile /tmp/celerybeat.pid

directory=/opt/python/current/app
user=nobody
numprocs=1
stdout_logfile=/var/log/celery-beat.log
stderr_logfile=/var/log/celery-beat.log
autostart=false
autorestart=true
startsecs=10

; Need to wait for currently executing tasks to finish at shutdown.
; Increase this if you have very long running tasks.
stopwaitsecs = 10

; When resorting to send SIGKILL to the program to terminate it
; send SIGKILL to its whole process group instead,
; taking care of its children as well.
killasgroup=true

; if rabbitmq is supervised, set its priority higher
; so it starts first
priority=998

environment=$celeryenv"

# create celery worker config script
celeryworkerconf="[program:celeryd-worker]
; Set full path to celery program if using virtualenv
command=/opt/python/run/venv/bin/celery worker -A lexvoco --loglevel=INFO

directory=/opt/python/current/app
user=nobody
numprocs=1
stdout_logfile=/var/log/celery-worker.log
stderr_logfile=/var/log/celery-worker.log
autostart=true
autorestart=true
startsecs=10

; Need to wait for currently executing tasks to finish at shutdown.
; Increase this if you have very long running tasks.
stopwaitsecs = 600

; When resorting to send SIGKILL to the program to terminate it
; send SIGKILL to its whole process group instead,
; taking care of its children as well.
killasgroup=true

; if rabbitmq is supervised, set its priority higher
; so it starts first
priority=999

environment=$celeryenv"

# create files for the scripts
echo "$celerybeatconf" | tee /opt/python/etc/celerybeat.conf
echo "$celeryworkerconf" | tee /opt/python/etc/celeryworker.conf

# add configuration script to supervisord conf (if not there already)
if ! grep -Fxq "[include]" /opt/python/etc/supervisord.conf
  then
  echo "[include]" | tee -a /opt/python/etc/supervisord.conf
  echo "files: celerybeat.conf celeryworker.conf" | tee -a /opt/python/etc/supervisord.conf
fi

# reread the supervisord config
/usr/local/bin/supervisorctl -c /opt/python/etc/supervisord.conf reread
  # update supervisord in cache without restarting all services
/usr/local/bin/supervisorctl -c /opt/python/etc/supervisord.conf update


if [[ "$EB_IS_COMMAND_LEADER" == "true" ]]; then
  supervisorctl -c /usr/local/etc/supervisord.conf restart celeryd-beat
  supervisorctl -c /usr/local/etc/supervisord.conf restart celeryd-worker
fi