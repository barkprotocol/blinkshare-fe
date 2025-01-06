// SearchParamProps
declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Discord-related Types
declare interface DiscordRole {
  id: string;
  name: string;
  price?: string; // Optional field for price
  enabled?: boolean; // Optional field for enabled
  position?: number;
  permissions?: string; // Optional field for permissions
}

declare type DiscordServer = {
  id: string;
  name: string;
  icon: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
  ownerWallet: string;
};

declare type BlinkShareServerSettings = {
  guildId: string;
  customTitle?: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  selectedRoles: string[];
  ownerWallet: string;
};

declare type DiscordOAuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

declare type ServerListResponse = {
  servers: {
    id: string;
    name: string;
    icon: string;
  }[];
};

declare type BlinkData = {
  guildId: string;
  title: string;
  icon: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
};

declare type TransactionDetails = {
  roleId: string;
  amount: number;
  buyerWallet: string;
  sellerWallet: string;
};

declare type BlinkShareApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// API request and response types
declare type CreateBlinkRequest = BlinkShareServerSettings;

declare type CreateBlinkResponse = BlinkShareApiResponse<{
  blinkUrl: string;
}>;

declare type GetBlinkDataRequest = {
  guildId: string;
  code: string;
};

declare type GetBlinkDataResponse = BlinkShareApiResponse<BlinkData>;

declare type ProcessTransactionRequest = TransactionDetails;

declare type ProcessTransactionResponse = BlinkShareApiResponse<{
  success: boolean;
  roleAssigned: boolean;
}>;

// User Types
declare type ServerOwner = SupabaseUser & {
  ownedServers: string[];
};

declare type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[];
};

// Supabase User Types
declare type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

declare type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// UI Types
declare type ServerFormData = {
  iconUrl: string | number | readonly string[] | undefined;
  title: string;
  description: string;
  details: string;
  roles: string[];
};

export interface BlinkAction {
  title: string;
  description: string;
  fields: string[];
}

export interface BlinkProps {
  action: BlinkAction;
  websiteText: string;
}

// API Function Types
declare type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

declare type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

declare type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<{ blinkShareRolePosition: number; roles: DiscordRole[] }>;

declare type CreateOrEditGuild = (
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

declare type PatchGuild = (
  guildId: string,
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// RoleData Type
export type RoleData = {
  blinkShareRolePosition: number;
  roles: DiscordRole[];
};

declare interface ServerFormProps {
  formData: ServerFormData;
  setFormData: React.Dispatch<React.SetStateAction<ServerFormData>>;
  roleData: RoleData;
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>;
  formErrors: Partial<Record<keyof ServerFormData, string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  channels: { name: string; id: string }[];
}
