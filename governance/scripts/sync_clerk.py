from clerk_backend_api import Clerk
from typing import Literal, Set

from scripts.utils import get_members_emails, get_leads_emails


class ClerkManager:
    SCOTTYLABS_DEVELOPER_EMAIL = "scottylabsdeveloper@gmail.com"
    ADMIN_ROLE = "org:admin"
    MEMBER_ROLE = "org:member"

    def __init__(self, team, secret_key, org_id, env: Literal["Dev", "Prod"]):
        self.team = team
        self.env = env
        self.clerk = Clerk(bearer_auth=secret_key)
        self.org_id = org_id

    # Get all admins and members in the Clerk CMU Maps organization
    def load_memberships(self):
        memberships = self.clerk.organization_memberships.list(
            organization_id=self.org_id
        )
        self.clerk_memberships = set()
        self.clerk_admins = set()
        self.clerk_members = set()
        for member in memberships.data:
            user_id = member.public_user_data.user_id
            if member.role == self.ADMIN_ROLE:
                self.clerk_admins.add(user_id)
            elif member.role == self.MEMBER_ROLE:
                self.clerk_members.add(user_id)
            self.clerk_memberships.add(user_id)

        return memberships

    def sync(self):
        print(f"Syncing {self.env} Clerk")

        self.load_memberships()
        leads_emails = get_leads_emails(self.team)
        leads_emails.add(self.SCOTTYLABS_DEVELOPER_EMAIL)
        self.sync_clerk_role(
            leads_emails,
            self.clerk_admins,
            role=self.ADMIN_ROLE,
        )

        # reload memberships because a member might be updated to be an admin
        self.load_memberships()
        members_emails = get_members_emails(self.team)
        self.sync_clerk_role(
            members_emails,
            self.clerk_members,
            role=self.MEMBER_ROLE,
        )

        print(f"Clerk {self.env} sync complete")

    def sync_clerk_role(self, user_emails: list[str], clerk_users: set[str], role: str):
        desired_user_ids = self.get_users_by_emails(user_emails)

        # --- Add or update users to the desired role ---
        for uid in desired_user_ids - clerk_users:
            full_name = self.get_user_full_name(uid)
            if uid in self.clerk_memberships:
                print(f"Updating {full_name} as {role} in Clerk {self.env}")
                self.clerk.organization_memberships.update(
                    organization_id=self.org_id, user_id=uid, role=role
                )
            else:
                print(f"Adding {full_name} as {role} in Clerk {self.env}")
                try:
                    self.clerk.organization_memberships.create(
                        organization_id=self.org_id, user_id=uid, role=role
                    )
                except Exception as e:
                    print(
                        f"Error adding {full_name} as {role} in Clerk {self.env}: {e}"
                    )

        # --- Remove extra users ---
        for uid in clerk_users - desired_user_ids:
            full_name = self.get_user_full_name(uid)
            print(f"Removing {full_name} as {role} from Clerk {self.env}")
            self.clerk.organization_memberships.delete(
                organization_id=self.org_id, user_id=uid
            )

    def get_users_by_emails(self, emails: list[str]) -> Set[str]:
        users = self.clerk.users.list(request={"email_address": emails})
        user_emails = [user.email_addresses[0].email_address for user in users]
        for email in emails:
            if email not in user_emails:
                print(f"User {email} not found in Clerk {self.env}")

        return {user.id for user in users}

    def get_user_full_name(self, user_id):
        user = self.clerk.users.get(user_id=user_id)
        return user.first_name + " " + user.last_name
