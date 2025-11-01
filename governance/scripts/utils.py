EMAIL_SUFFIX = "@andrew.cmu.edu"


def get_members_emails(team) -> set[str]:
    return {
        member["andrew-id"] + EMAIL_SUFFIX
        for member in team["members"]
        if member["andrew-id"]
    }


def get_leads_emails(team) -> set[str]:
    return {lead["andrew-id"] + EMAIL_SUFFIX for lead in team["leads"]}
