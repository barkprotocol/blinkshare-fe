import { Dispatch, SetStateAction } from "react";

// Utility Types
type InputValue = string | number | readonly string[] | undefined;

// FormData Interface
export declare interface FormData {
  [key: string]: InputValue; // Allows dynamic fields with string keys
}

// SearchParamProps: Defines the shape of search and route parameters
declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Discord Types
export type DiscordRole = {
  id: string;
  name: string;
  price?: string; // Optional field for price
  enabled?: boolean; // Optional field for enabled status
  position?: number; // Optional field for role position
  permissions?: string; // Optional field for permissions
};

declare type DiscordServer = {
  id: string;
  name: string;
  icon: string;
  customIcon?: string; // Optional custom icon URL
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
  ownerWallet: string; // Wallet address of the server owner
};

declare type DiscordOAuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Expiry time in seconds
};

declare type ServerListResponse = {
  servers: { id: string; name: string; icon: string }[];
};

// BlinkShare Types
declare type BlinkShareServerSettings = {
  guildId: string;
  customTitle?: string; // Optional custom title
  customIcon?: string; // Optional custom icon URL
  description: string;
  detailedDescription: string;
  selectedRoles: string[]; // Selected role IDs
  ownerWallet: string; // Server owner's wallet address
};

export type BlinkData = {
  guildId: string;
  title: string;
  icon: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
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

// Transaction Types
declare type TransactionDetails = {
  roleId: string; // Role ID
  amount: number; // Transaction amount
  buyerWallet: string; // Buyer's wallet
  sellerWallet: string; // Seller's wallet
};

declare type BlinkShareApiResponse<T> = {
  success: boolean; // Request success status
  data?: T; // Optional data on success
  error?: string; // Optional error message
};

declare type CreateBlinkRequest = BlinkShareServerSettings;

declare type CreateBlinkResponse = BlinkShareApiResponse<{ blinkUrl: string }>;

declare type GetBlinkDataRequest = { guildId: string; code: string };

declare type GetBlinkDataResponse = BlinkShareApiResponse<BlinkData>;

declare type ProcessTransactionRequest = TransactionDetails;

declare type ProcessTransactionResponse = BlinkShareApiResponse<{
  success: boolean;
  roleAssigned: boolean;
}>;

// User Types
declare type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

declare type ServerOwner = SupabaseUser & {
  ownedServers: string[];
};

declare type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[];
};

declare type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// UI Types
export type RoleData = {
  blinkShareRolePosition: number;
  roles: DiscordRole[];
};

export type ServerFormData = FormData & {
  address: InputValue;
  name: InputValue;
  website: string;
  notificationChannelId: string;
  useUsdc?: boolean;
  limitedTimeRoles?: boolean;
  limitedTimeQuantity: InputValue;
  limitedTimeUnit: string;
  iconUrl: InputValue;
  title: string;
  description: string;
  details: string;
  roles: string[];
};

export declare interface ServerFormProps {
  formData: ServerFormData;
  setFormData: Dispatch<SetStateAction<ServerFormData>>;
  roleData: RoleData;
  setRoleData: Dispatch<SetStateAction<RoleData>>;
  formErrors: Partial<Record<keyof ServerFormData, string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  channels: { name: string; id: string }[];
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
