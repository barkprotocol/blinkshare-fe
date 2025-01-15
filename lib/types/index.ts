import { Dispatch, SetStateAction } from "react";

// Define the Database schema types based on your Supabase schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          created_at: string;
          updated_at: string;
          // Add any other columns from your "users" table
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['users']['Row'], 'id'>>;
      };
      // Add other tables as needed
    };
    Functions: {
      // Add any custom functions here
    };
    Enums: {
      // Add any custom enums here
    };
  };
};

// Utility Types
export type InputValue = string | number | readonly string[] | null | undefined;

// FormData Interface
export interface IFormData {
  [key: string]: InputValue;
}

export interface IGuild {
  id: string;
  name: string;
  iconUrl?: string;
}

// SearchParamProps: Defines the shape of search and route parameters
export type SearchParamProps = {
  params: Record<string, string>; // Route parameters
  searchParams: Record<string, string | string[] | undefined>; // Query parameters
};

// Discord Types
export interface DiscordRole {
  id: string;
  name: string;
  price?: string;
  enabled?: boolean;
  position?: number;
  permissions?: string;
  color?: string; // Added color field
}

export interface DiscordServer {
  id: string;
  name: string;
  icon: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
  ownerWallet: string;
  memberCount?: number; // Added member count
}

export type DiscordOAuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type ServerListResponse = {
  servers: Pick<DiscordServer, "id" | "name" | "icon">[];
};

// BlinkShare Types
export interface BlinkShareServerSettings {
  guildId: string;
  customTitle?: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  selectedRoles: string[];
  ownerWallet: string;
  notificationChannelId?: string; // Added notification channel
}

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
export interface TransactionDetails {
  roleId: string;
  amount: number;
  buyerWallet: string;
  sellerWallet: string;
  timestamp?: number; // Added timestamp
}

export type BlinkShareApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string; // Added message field
};

export type CreateBlinkRequest = BlinkShareServerSettings;
export type CreateBlinkResponse = BlinkShareApiResponse<{ blinkUrl: string }>;

export type GetBlinkDataRequest = { guildId: string; code: string };
export type GetBlinkDataResponse = BlinkShareApiResponse<BlinkData>;

export type ProcessTransactionRequest = TransactionDetails;
export type ProcessTransactionResponse = BlinkShareApiResponse<{
  success: boolean;
  roleAssigned: boolean;
  transactionId?: string; // Added transaction ID
}>;

// User Types
export type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

export type ServerOwner = SupabaseUser & {
  ownedServers: string[];
};

export type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[];
  roles?: string[]; // Added roles
};

export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// UI Types
export interface ServerFormData {
  id: string;
  address: string;
  name: string;
  website: string;
  notificationChannelId: string;
  useUsdc?: boolean;
  limitedTimeRoles?: boolean;
  limitedTimeQuantity: number;
  limitedTimeUnit: string;
  iconUrl: string;
  title: string;
  description: string;
  details: string;
  roles: string[];
}

export interface ServerFormProps {
  formData: ServerFormData;
  setFormData: React.Dispatch<React.SetStateAction<ServerFormData>>;
  roleData: RoleData;
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>;
  formErrors: Partial<Record<keyof ServerFormData, string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  channels: { name: string; id: string }[];
}

// API Function Types
export type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

export type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

export type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<RoleData>;

export type CreateOrEditGuild = (
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

export type PatchGuild = (
  guildId: string,
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// New types for additional functionality
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export type GetServerMembersRequest = {
  guildId: string;
  pagination: PaginationParams;
  sort?: SortParams;
};

export type GetServerMembersResponse = BlinkShareApiResponse<{
  members: DiscordMember[];
  totalCount: number;
}>;

export interface RoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: number;
  expiresAt?: number;
}

export type AssignRoleRequest = {
  guildId: string;
  roleAssignments: RoleAssignment[];
};

export type AssignRoleResponse = BlinkShareApiResponse<{
  successfulAssignments: string[];
  failedAssignments: { userId: string; reason: string }[];
}>;

export interface RoleData {
  blinkShareRolePosition: number;
  roles: DiscordRole[];
}

