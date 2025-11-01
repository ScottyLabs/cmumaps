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
        self.existing_members = set(member.login for member in self.org.get_members())
        print(
            f"GithubManager initialized with {len(self.existing_members)} existing members"
        )

    def sync(self):
        print("Syncing Github")
        self.sync_contributors()
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
            self.sync_github_team(github_admin_team, leads)

            # Also need to include leads so they are not removed from the parent team since
            # when retrieving the members of a parent team in GitHub, the members of its child teams are also included
            github_team = self.org.get_team_by_slug(team["github-team"])
            members = set([member["github-username"] for member in team["members"]])
            self.sync_github_team(github_team, leads.union(members))

            self.sync_repos(github_team, github_admin_team, team)
        except Exception as e:
            print(f"Error syncing team {team['name']}: {e}")
            traceback.print_exc()

    def sync_github_team(self, github_team, desired_members: set[str]):
        current_members = {member.login for member in github_team.get_members()}

        # --- Add new members ---
        for username in desired_members - current_members:
            print(f"Adding {username} to the {github_team.name} GitHub team")
            user = self.g.get_user(username)
            github_team.add_membership(user, role="member")

        # --- Remove extra members ---
        for username in current_members - desired_members:
            print(f"Removing {username} from {github_team.name} GitHub team")
            user = self.g.get_user(username)
            github_team.remove_membership(user)

    # Sync the repositories to the Github team
    # Give CMU Maps team members write access and CMU Maps Admins admin access to the repository
    def sync_repos(self, github_team, github_admin_team, team):
        repos = set(team["repos"])
        github_repos = github_team.get_repos()
        github_repos = set([repo.full_name for repo in github_repos])

        # Remove any repositories from the Github team that are not in the team list
        for repo in github_repos:
            if repo not in repos:
                print(f"Removing {repo} from {github_team.name} Github team")
                github_team.remove_from_repos(repo)

        # Give CMU Maps team members write access and CMU Maps Admins admin access to the repository
        for repo in repos:
            github_team.add_to_repos(repo)
            github_team.update_team_repository(repo, "push")
            github_admin_team.update_team_repository(repo, "admin")
