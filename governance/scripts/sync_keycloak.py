from keycloak import KeycloakAdmin
from dotenv import load_dotenv
import os

from scripts.utils import get_leads_andrew_ids, get_members_andrew_ids

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
        print("Syncing Keycloak")

        # Sync the team leads to the Keycloak cmumaps-admins group
        admins_andrew_ids = get_leads_andrew_ids(self.team)
        self.sync_group(self.ADMIN_GROUP, admins_andrew_ids)

        # Sync team members to Keycloak cmumaps-devs group
        members_andrew_ids = get_members_andrew_ids(self.team)
        self.sync_group(self.MEMBER_GROUP, members_andrew_ids)

        print("Keycloak sync complete")

    def sync_group(self, group_path: str, target_andrew_ids: set[str]):
        group = self.keycloak_admin.get_group_by_path(group_path)
        group_id = group["id"]
        group_name = group["name"]

        members = self.keycloak_admin.get_group_members(group_id)
        current_andrew_ids = {m["username"].lower() for m in members}

        # --- Add missing users ---
        for andrew_id in target_andrew_ids:
            if andrew_id not in current_andrew_ids:
                user_id = self.get_user_id_by_andrew_id(andrew_id)
                if user_id:
                    print(f"Adding {andrew_id} to Keycloak {group_name}")
                    self.keycloak_admin.group_user_add(user_id, group_id)

        # --- Remove extra users ---
        for member in members:
            andrew_id = member["username"]
            if andrew_id not in target_andrew_ids:
                print(f"Removing {andrew_id} from Keycloak {group_name}")
                self.keycloak_admin.group_user_remove(member["id"], group_id)

    # Get the user ID by email
    def get_user_id_by_andrew_id(self, andrew_id: str):
        users = self.keycloak_admin.get_users(query={"username": andrew_id})

        if not users:
            print(f"User {andrew_id} not found in Keycloak")
            return False

        if len(users) > 1:
            print(f"Multiple users found for {andrew_id}: {users}")
            return False

        return users[0]["id"]
