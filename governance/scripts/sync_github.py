import traceback
from github import Github
from github import Auth
import os
import dotenv

dotenv.load_dotenv()


class GithubManager:
    # Initialize the GithubManager with GitHub org and existing members
    def __init__(self, team):
        print("Initializing GithubManager")
        self.team = team
        auth = Auth.Token(os.getenv("SYNC_GITHUB_TOKEN"))
        self.g = Github(auth=auth)
        self.org = self.g.get_organization("ScottyLabs")
        # self.existing_members = set(member.login for member in self.org.get_members())
        # print(
        #     f"GithubManager initialized with {len(self.existing_members)} existing members"
        # )

    def sync(self):
        print("Syncing Github")
        # self.sync_contributors()
        self.sync_team()
        print("Github sync complete")

    # Invite new contributors to the GitHub organization, both members and leads
    def sync_contributors(self):
        contributors = self.team["leads"] + self.team["members"]
        for contributor in contributors:
            github_username = contributor["github-username"]
            if github_username not in self.existing_members:
                print(f"Adding {github_username} to GitHub organization")
                user = self.g.get_user(github_username)
                self.org.invite_user(user=user, role="direct_member")

    # Sync the team leads and members to the Github team
    def sync_team(self):
        try:
            team = self.team
            github_admin_team = self.org.get_team_by_slug(team["github-admin-team"])
            leads = set([lead["github-username"] for lead in team["leads"]])
            self.sync_leads(github_admin_team, leads)

            github_team = self.org.get_team_by_slug(team["github-team"])
            members = set([member["github-username"] for member in team["members"]])
            # Also need to include leads so they are not removed from the parent team since
            # when retrieving the members of a parent team in GitHub, the members of its child teams are also included
            self.sync_members(github_team, leads.union(members))

            # self.sync_repos(github_team, github_admin_team, team)
        except Exception as e:
            print(f"Error syncing team {team['name']}: {e}")
            traceback.print_exc()

    # Sync the team leads to the admin Github team
    def sync_leads(self, github_team, leads):
        github_leads = github_team.get_members()
        github_leads = set([member.login for member in github_leads])

        # Add any new team leads to the Github team
        for lead in leads:
            if lead not in github_leads:
                print(f"Adding {lead} to the {github_team.name} Github team")
                user = self.g.get_user(lead)
                github_team.add_membership(user, role="member")

        # Remove any team leads from the Github team that are not in the team list
        for lead in github_leads:
            if lead not in leads:
                print(f"Removing {lead} from {github_team.name} Github team")
                user = self.g.get_user(lead)
                github_team.remove_membership(user)

    # Sync both team members and leads to the Github team
    def sync_members(self, github_team, members):
        github_members = github_team.get_members()
        github_members = set([member.login for member in github_members])

        for member in members:
            if member not in github_members:
                print(f"Adding {member} to the {github_team.name} Github team")
                user = self.g.get_user(member)
                github_team.add_membership(user, role="member")

        for member in github_members:
            if member not in members:
                print(f"Removing {member} from {github_team.name} Github team")
                user = self.g.get_user(member)
                github_team.remove_membership(user)

    def sync_repos(self, github_team, github_admin_team, team):
        repos = set(team["repos"])
        github_repos = github_team.get_repos()
        github_repos = set([repo.full_name for repo in github_repos])

        for repo in repos:
            if repo not in github_repos:
                print(f"Adding {repo} as a repo to {github_team.name} Github team")
                github_team.add_to_repos(repo)

        for repo in github_repos:
            if repo not in repos:
                print(f"Removing {repo} from {github_team.name} Github team")
                github_team.remove_from_repos(repo)
