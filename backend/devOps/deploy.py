import subprocess
import boto3
import os
import datetime
import mimetypes

ROOT = '/Users/damienbenveniste/Projects/motivee'
BUCKET_NAME = 'motivee-insight-frontend-files'
APPLICATION_NAME = 'Motivee-backend'
UPDATE_TYPE_DICT = {
    'PATCH': 3,
    'MINOR': 2,
    'MAJOR': 1
}
DISTRIBUTIONS_DICT = {
    'staging': '...',
    'production': '...'
}


class DevOps:

    def __init__(self):
        self.s3_resource = boto3.resource('s3')
        self.cloudfront_client = boto3.client('cloudfront')
        self.eb_client = boto3.client('elasticbeanstalk')
    
    def build_frontend(self):
        working_directory = os.path.join(ROOT, 'frontend')
        p = subprocess.Popen(['npm', 'run', 'build'], cwd=working_directory)
        p.wait()

    def deploy_backend(self, env, version=None):
        working_directory = os.path.join(ROOT, 'backend/src')
        command = ['eb', 'deploy', 'backend-{env}'.format(env=env)]
        if version:
            command.extend(['-l', version])

        p = subprocess.Popen(command, cwd=working_directory)
        p.wait()

    def deploy_frontend(self, env, version):
        bucket = self.s3_resource.Bucket(BUCKET_NAME)
        working_directory = os.path.join(ROOT, 'frontend/build')

        for path, _, files in os.walk(working_directory):
            directory_name = path.replace(working_directory, '')
            if directory_name.startswith('/'):
                directory_name = directory_name[1:]

            for file in files:
                file_path = os.path.join(
                    env,
                    version,
                    directory_name, 
                    file
                )
                content_type = mimetypes.guess_type(file)[0]
                if content_type:
                    bucket.upload_file(
                        os.path.join(path, file), 
                        file_path,
                        ExtraArgs={'ContentType': content_type}
                    )
                else:
                    bucket.upload_file(
                        os.path.join(path, file), 
                        file_path,
                    )

    def get_cloudfront_config(self, env):
        response = self.cloudfront_client.get_distribution_config(
            Id=DISTRIBUTIONS_DICT[env]
        )
        config = response['DistributionConfig']
        etag = response['ETag']
        return config, etag

    def get_cloudfront_version(self, config):
        origin = config['Origins']['Items'][0]
        origin_path = origin['OriginPath']
        return origin_path.split('/')[-1]

    def get_max_version(self, version_array):
        version_tuples = [
            [version.split('.'), version]
            for version in version_array
        ]
        
        max_version_arr = ['0', '0', '0', '0']
        max_version = '0.0.0.0'
        for version_tuple in version_tuples:
            version_arr = version_tuple[0]
            version = version_tuple[1]
            
            for i, level in enumerate(version_arr):
                if int(level) > int(max_version_arr[i]):
                    max_version_arr = version_arr
                    max_version = version
                    break
                elif int(level) < int(max_version_arr[i]):
                    break
                    
        return max_version

    def increment_version(self, version, update_type):
        vers_array = version.split('.')
        idx = UPDATE_TYPE_DICT.get(update_type)
        val = int(vers_array[idx])
        vers_array[idx] = str(val + 1)
        for i in range(idx + 1, 4):
            vers_array[i] = '0'
        return '.'.join(vers_array)

    def get_new_version(self, env, current_version, eb_versions_dict, update_type):
        versions = list(eb_versions_dict.values()) + [current_version]
        max_version = self.get_max_version(versions)
        if env == 'staging':
            return self.increment_version(max_version, update_type)
        else:
            return max_version

    def update_version(self, env, config, update_type):
        current_version = self.get_cloudfront_version(config)
        eb_versions_dict = self.get_eb_versions(env)
        new_version = self.get_new_version(
            env, 
            current_version, 
            eb_versions_dict, 
            update_type
        )
        return new_version

    def update_origin_path(self, config, new_version):
        origin_path = config['Origins']['Items'][0]['OriginPath']
        origin_path_array = origin_path.split('/')
        origin_path_array[-1] = new_version
        config['Origins']['Items'][0]['OriginPath'] = '/'.join(origin_path_array)
        return config

    def update_distribution(self, env, config, etag):
        self.cloudfront_client.update_distribution(
            Id=DISTRIBUTIONS_DICT[env],
            DistributionConfig=config,
            IfMatch=etag
        )

    def update_cache(self, env):
        response = self.cloudfront_client.create_invalidation(
            DistributionId=DISTRIBUTIONS_DICT[env],
            InvalidationBatch={
                'Paths': {
                    'Quantity': 1,
                    'Items': [
                        '/*',
                    ]
                },
                'CallerReference': str(datetime.datetime.now().timestamp())
            }
        )
        return response

    def get_eb_versions(self, env):
        response = self.eb_client.describe_environments(
            ApplicationName=APPLICATION_NAME,
        )

        environments = response['Environments']
        env_dict = {
            env['EnvironmentName']: env['VersionLabel']
            for env in environments
        }
        print(env_dict)
        max_version = self.get_max_version(list(env_dict.values()))
        if env == 'production' and env_dict['backend-production'] == max_version:
            raise Exception('should deploy staging first')

        return env_dict
                
    def deploy(self, env, update_type, new_version=None):
        config, etag = self.get_cloudfront_config(env)
        if not new_version:
            new_version = self.update_version(env, config, update_type)
        config = self.update_origin_path(config, new_version)
        self.build_frontend()
        self.deploy_frontend(env, new_version)
        self.update_distribution(env, config, etag)
        self.deploy_backend(env, new_version)
        self.update_cache(env)


def run(env, update_type, new_version):
    devops = DevOps()
    devops.deploy(env, update_type, new_version)


if __name__ == '__main__':

    import argparse

    parser = argparse.ArgumentParser()

    parser.add_argument(
        '-e',
        '--env',
        default='staging',
        choices=list(DISTRIBUTIONS_DICT.keys())
    )
    parser.add_argument(
        '-t',
        '--update_type',
        default='PATCH',
        choices=list(UPDATE_TYPE_DICT.keys())
    )

    parser.add_argument(
        '-v',
        '--new_version',
    )

    run(**vars(parser.parse_args()))
    
