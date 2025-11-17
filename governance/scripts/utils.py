EMAIL_SUFFIX = "@andrew.cmu.edu"


def get_members_emails(team) -> set[str]:
    members_andrew_ids = get_members_andrew_ids(team)
    return {andrew_id + EMAIL_SUFFIX for andrew_id in members_andrew_ids}


def get_leads_emails(team) -> set[str]:
    leads_andrew_ids = get_leads_andrew_ids(team)
    return {andrew_id + EMAIL_SUFFIX for andrew_id in leads_andrew_ids}


def get_leads_andrew_ids(team) -> set[str]:
    return {lead["andrew-id"] for lead in team["leads"] if lead["andrew-id"]}


def get_members_andrew_ids(team) -> set[str]:
    return {member["andrew-id"] for member in team["members"] if member["andrew-id"]}
