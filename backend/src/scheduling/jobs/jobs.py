from scheduling.jobs.claims_summary_job import ClaimSummaryJob
from scheduling.jobs.answers_summary_job import AnswersSummaryJob


def get_jobs():
    jobs = [
        ClaimSummaryJob(),
        AnswersSummaryJob()
    ]
    return jobs
            







    

    

        

