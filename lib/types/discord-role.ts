// DiscordRole interface
declare interface DiscordRole {
  id: string;
  name: string;
  price?: string; // Optional field
  enabled?: boolean; // Optional field
  position?: number;
  permissions?: string; // Optional field
}

// Updated RoleData Type
export type RoleData = {
  blinkShareRolePosition: number;
  roles: DiscordRole[];
};
