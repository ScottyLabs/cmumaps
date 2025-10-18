from clerk_backend_api import Clerk


class ClerkManager:
    def __init__(self, team, secret_key, org_id, env):
        self.team = team
        self.env = env
        self.clerk = Clerk(bearer_auth=secret_key)
        self.org_id = org_id

    def load_memberships(self):
        memberships = self.clerk.organization_memberships.list(
            organization_id=self.org_id
        )
        self.clerk_memberships = set()
        self.clerk_admins = set()
        self.clerk_members = set()
        for member in memberships.data:
            user_id = member.public_user_data.user_id
            if member.role == "org:admin":
                self.clerk_admins.add(user_id)
            elif member.role == "org:member":
                self.clerk_members.add(user_id)
            self.clerk_memberships.add(user_id)

        return memberships

    def sync(self):
        print(f"Syncing {self.env} Clerk")

        self.load_memberships()
        self.sync_leads()

        # reload memberships because a member might be updated to be an admin
        self.load_memberships()
        self.sync_members()

        print(f"Clerk {self.env} sync complete")

    def sync_leads(self):
        leads_emails = [
            lead["andrew-id"] + "@andrew.cmu.edu" for lead in self.team["leads"]
        ]
        leads_emails.append("scottylabsdeveloper@gmail.com")
        leads_ids = self.get_users(leads_emails)

        # Add team leads as admins to Clerk
        for lead_id in leads_ids:
            if lead_id not in self.clerk_admins:
                if lead_id in self.clerk_memberships:
                    full_name = self.get_user_full_name(lead_id)
                    print(f"Updating {full_name} as an admin to Clerk {self.env}")
                    self.clerk.organization_memberships.update(
                        organization_id=self.org_id, user_id=lead_id, role="org:admin"
                    )
                else:
                    full_name = self.get_user_full_name(lead_id)
                    print(f"Adding {full_name} as an admin to Clerk {self.env}")
                    self.clerk.organization_memberships.create(
                        organization_id=self.org_id, user_id=lead_id, role="org:admin"
                    )

        # Remove Clerk admins who are not team leads
        for user_id in self.clerk_admins:
            if user_id not in leads_ids:
                full_name = self.get_user_full_name(user_id)
                print(f"Removing {full_name} as an admin from Clerk {self.env}")
                self.clerk.organization_memberships.delete(
                    organization_id=self.org_id, user_id=user_id
                )

    def sync_members(self):
        members_ids = self.get_users(
            member["andrew-id"] + "@andrew.cmu.edu" for member in self.team["members"]
        )

        # Add team members as members to Clerk
        for member_id in members_ids:
            if member_id not in self.clerk_members:
                if member_id in self.clerk_memberships:
                    full_name = self.get_user_full_name(member_id)
                    print(f"Updating {full_name} as a member to Clerk {self.env}")
                    self.clerk.organization_memberships.update(
                        organization_id=self.org_id,
                        user_id=member_id,
                        role="org:member",
                    )
                else:
                    full_name = self.get_user_full_name(member_id)
                    print(f"Adding {full_name} as a member to Clerk {self.env}")
                    self.clerk.organization_memberships.create(
                        organization_id=self.org_id,
                        user_id=member_id,
                        role="org:member",
                    )

        # Remove Clerk members who are not team members
        for member_id in self.clerk_members:
            if member_id not in members_ids:
                full_name = self.get_user_full_name(member_id)
                print(f"Removing {full_name} as a member from Clerk {self.env}")
                self.clerk.organization_memberships.delete(
                    organization_id=self.org_id, user_id=member_id
                )

    def get_users(self, emails):
        users = self.clerk.users.list(request={"email_address": emails})
        return [user.id for user in users]

    def get_user_full_name(self, user_id):
        user = self.clerk.users.get(user_id=user_id)
        return user.first_name + " " + user.last_name
