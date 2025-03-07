export interface LiveUser {
  userName: string;
  color: string;
}

export interface SyncUserPayload {
  users: Record<string, LiveUser>;
}
