from keycloak import KeycloakAdmin
from dotenv import load_dotenv
import os

from scripts.utils import get_leads_emails, get_members_emails

load_dotenv()


class KeycloakManager:
    ADMIN_GROUP = "cmumaps-admins"
    MEMBER_GROUP = "cmumaps-devs"

    def __init__(self, team):
        self.team = team
        self.keycloak_admin = KeycloakAdmin(
            server_url=os.getenv("KEYCLOAK_SERVER_URL"),
            username=os.getenv("KEYCLOAK_USERNAME"),
            password=os.getenv("KEYCLOAK_PASSWORD"),
            realm_name=os.getenv("KEYCLOAK_REALM"),
            client_id=os.getenv("KEYCLOAK_CLIENT_ID"),
            user_realm_name=os.getenv("KEYCLOAK_USER_REALM"),
            verify=True,
        )

    def sync(self):
        # Sync the team leads to the Keycloak cmumaps-admins group
        admins_emails = get_leads_emails(self.team)
        self.sync_group(self.ADMIN_GROUP, admins_emails)

        # Sync team members to Keycloak cmumaps-devs group
        members_emails = get_members_emails(self.team)
        self.sync_group(self.MEMBER_GROUP, members_emails)

    def sync_group(self, group_path: str, target_emails: set[str]):
        group = self.keycloak_admin.get_group_by_path(group_path)
        group_id = group["id"]
        group_name = group["name"]

        members = self.keycloak_admin.get_group_members(group_id)
        current_emails = {m["email"].lower() for m in members}

        # --- Add missing users ---
        for email in target_emails:
            if email not in current_emails:
                user_id = self.get_user_id_by_email(email)
                if user_id:
                    print(f"Adding {email} to Keycloak {group_name}")
                    self.keycloak_admin.group_user_add(user_id, group_id)

        # --- Remove extra users ---
        for member in members:
            email = member["email"]
            if email not in target_emails:
                print(f"Removing {email} from Keycloak {group_name}")
                self.keycloak_admin.group_user_remove(member["id"], group_id)

    # Get the user ID by email
    def get_user_id_by_email(self, email: str) -> str | False:
        users = self.keycloak_admin.get_users(query={"email": email})
        if not users:
            print(f"User {email} not found in Keycloak")
            return False

        return users[0]["id"]
