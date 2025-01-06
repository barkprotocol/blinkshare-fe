// SearchParamProps: Defines the shape of search and route parameters
declare type SearchParamProps = {
  params: { [key: string]: string }; // Route parameters
  searchParams: { [key: string]: string | string[] | undefined }; // Query parameters
};

// Discord-related Types

// DiscordRole: Represents a Discord role with optional fields for price, enabled status, position, and permissions
declare interface DiscordRole {
  id: string;
  name: string;
  price?: string; // Optional field for price
  enabled?: boolean; // Optional field for enabled status
  position?: number; // Optional field for role position
  permissions?: string; // Optional field for permissions associated with the role
}

// DiscordServer: Represents a Discord server (guild) with basic details and roles
declare type DiscordServer = {
  id: string;
  name: string;
  icon: string;
  customIcon?: string; // Optional custom icon URL
  description: string;
  detailedDescription: string;
  roles: DiscordRole[]; // List of roles in the server
  ownerWallet: string; // Wallet address of the server owner
};

// BlinkShareServerSettings: Represents settings for the BlinkShare integration on a server
declare type BlinkShareServerSettings = {
  guildId: string; // Discord guild (server) ID
  customTitle?: string; // Optional custom title
  customIcon?: string; // Optional custom icon URL
  description: string;
  detailedDescription: string;
  selectedRoles: string[]; // List of selected role IDs for BlinkShare integration
  ownerWallet: string; // Wallet address of the server owner
};

// DiscordOAuthResponse: The expected response from Discord OAuth authentication
declare type DiscordOAuthResponse = {
  accessToken: string; // Access token for authorized API requests
  refreshToken: string; // Refresh token for token renewal
  expiresIn: number; // Expiry time of the access token in seconds
};

// ServerListResponse: Represents a list of Discord servers
declare type ServerListResponse = {
  servers: {
    id: string;
    name: string;
    icon: string;
  }[];
};

// BlinkData: Data related to a BlinkShare server
declare type BlinkData = {
  guildId: string;
  title: string;
  icon: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[]; // List of roles for the server
};

// TransactionDetails: Data for a transaction (buying/selling roles)
declare type TransactionDetails = {
  roleId: string; // ID of the role being transacted
  amount: number; // Amount of currency involved in the transaction
  buyerWallet: string; // Wallet address of the buyer
  sellerWallet: string; // Wallet address of the seller
};

// BlinkShareApiResponse: Generic API response wrapper for BlinkShare endpoints
declare type BlinkShareApiResponse<T> = {
  success: boolean; // Whether the API request was successful
  data?: T; // Optional data returned on success
  error?: string; // Optional error message if the request failed
};

// API request and response types

// CreateBlinkRequest: Request data for creating a new BlinkShare integration
declare type CreateBlinkRequest = BlinkShareServerSettings;

// CreateBlinkResponse: Response data for creating a BlinkShare integration
declare type CreateBlinkResponse = BlinkShareApiResponse<{
  blinkUrl: string; // URL of the newly created BlinkShare integration
}>;

// GetBlinkDataRequest: Request data for fetching BlinkShare data by guildId and code
declare type GetBlinkDataRequest = {
  guildId: string;
  code: string;
};

// GetBlinkDataResponse: Response data for BlinkShare integration
declare type GetBlinkDataResponse = BlinkShareApiResponse<BlinkData>;

// ProcessTransactionRequest: Request data for processing a role transaction
declare type ProcessTransactionRequest = TransactionDetails;

// ProcessTransactionResponse: Response data for processing a transaction
declare type ProcessTransactionResponse = BlinkShareApiResponse<{
  success: boolean; // Whether the transaction was successful
  roleAssigned: boolean; // Whether the role was assigned successfully
}>;

// User Types

// ServerOwner: Represents a server owner (with related servers)
declare type ServerOwner = SupabaseUser & {
  ownedServers: string[]; // List of owned servers
};

// DiscordMember: Represents a Discord member with related server info
declare type DiscordMember = SupabaseUser & {
  discordId: string; // Discord user ID
  joinedServers: string[]; // List of servers the user has joined
};

// Supabase User Types

// SupabaseUser: Represents a user from Supabase (based on the schema)
declare type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

// SupabaseResponse: Wrapper for Supabase API responses
declare type SupabaseResponse<T> = {
  data: T | null; // Data returned by the API
  error: Error | null; // Error returned by the API (if any)
};

// UI Types

// ServerFormData: Represents the data for a server form
declare type ServerFormData = {
  iconUrl: string | number | readonly string[] | undefined;
  title: string;
  description: string;
  details: string;
  roles: string[];
};

// BlinkAction: Represents a BlinkShare action
export interface BlinkAction {
  title: string;
  description: string;
  fields: string[];
}

// BlinkProps: Represents properties for a BlinkShare component
export interface BlinkProps {
  action: BlinkAction;
  websiteText: string;
}

// API Function Types

// GetDiscordLoginUrl: Function to get the Discord login URL
declare type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

// HandleDiscordCallback: Function to handle the Discord OAuth callback
declare type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[]; // List of Discord servers the user is a member of
  token: string; // OAuth access token
}>;

// GetGuildRoles: Function to fetch roles of a guild
declare type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<{ blinkShareRolePosition: number; roles: DiscordRole[] }>;

// CreateOrEditGuild: Function to create or edit a BlinkShare guild
declare type CreateOrEditGuild = (
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// PatchGuild: Function to update an existing BlinkShare guild
declare type PatchGuild = (
  guildId: string,
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// RoleData Type: Represents role data for a guild, including the BlinkShare role position
export type RoleData = {
  blinkShareRolePosition: number; // The position of the BlinkShare role in the role list
  roles: DiscordRole[]; // List of roles in the guild
};

// ServerFormProps: Props for the server form component
declare interface ServerFormProps {
  formData: ServerFormData; // Server form data
  setFormData: React.Dispatch<React.SetStateAction<ServerFormData>>; // Setter for form data
  roleData: RoleData; // Role data
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>; // Setter for role data
  formErrors: Partial<Record<keyof ServerFormData, string>>; // Validation errors for form fields
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>; // Submit handler
  isLoading: boolean; // Loading state for the form
  channels: { name: string; id: string }[]; // List of available channels in the server
}
