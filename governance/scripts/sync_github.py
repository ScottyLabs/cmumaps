import traceback
from github import Github
from github import Auth
import os
import dotenv

dotenv.load_dotenv()


class GithubManager:
    def __init__(self, team):
        print("Initializing GithubManager")
        self.team = team

        auth = Auth.Token(os.getenv("GITHUB_TOKEN"))
        self.g = Github(auth=auth)
        self.org = self.g.get_organization("ScottyLabs")
        self.existing_members = set(member.login for member in self.org.get_members())
        print(
            f"GithubManager initialized with {len(self.existing_members)} existing members"
        )

    def sync(self):
        self.sync_contributors(self.team["leads"] + self.team["members"])
        self.sync_team(self.team)

    def sync_contributors(self, contributors):
        for github_username in contributors:
            if github_username not in self.existing_members:
                print(f"Adding {github_username} to GitHub organization")
                user = self.g.get_user(github_username)
                self.org.invite_user(user=user, role="direct_member")

    def sync_team(self, team):
        try:
            github_team = self.org.get_team_by_slug(team["github-team"])
            self.sync_leads(github_team, team)
            self.sync_members(github_team, team)
            self.sync_repos(github_team, team)
        except Exception as e:
            print(f"Error syncing team {team['name']}: {e}")
            traceback.print_exc()

    def sync_leads(self, github_team, team):
        leads = set(team["leads"])
        github_leads = github_team.get_members(role="maintainer")
        github_leads = set([member.login for member in github_leads])

        for lead in leads:
            if lead not in github_leads:
                print(f"Adding {lead} as a lead to {github_team.name}")
                user = self.g.get_user(lead)
                github_team.add_membership(user, role="maintainer")

        for lead in github_leads:
            if lead not in team["leads"]:
                print(f"Removing {lead} from {github_team.name}")
                user = self.g.get_user(lead)
                github_team.remove_membership(user)

    def sync_members(self, github_team, team):
        members = set(team["members"])
        github_members = github_team.get_members(role="member")
        github_members = set([member.login for member in github_members])

        for member in members:
            if member not in github_members:
                print(f"Adding {member} as a member to {github_team.name}")
                user = self.g.get_user(member)
                github_team.add_membership(user, role="member")

        for member in github_members:
            if member not in members:
                print(f"Removing {member} from {github_team.name}")
                user = self.g.get_user(member)
                github_team.remove_membership(user)

    def sync_repos(self, github_team, team):
        repos = set(team["repos"])
        github_repos = github_team.get_repos()
        github_repos = set([repo.full_name for repo in github_repos])

        for repo in repos:
            if repo not in github_repos:
                print(f"Adding {repo} as a repo to {github_team.name}")
                github_team.add_to_repos(repo)

        for repo in github_repos:
            if repo not in repos:
                print(f"Removing {repo} from {github_team.name}")
                github_team.remove_from_repos(repo)
