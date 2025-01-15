import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { DiscordRole } from "@/lib/types/discord-role";

// Utility to retrieve the token
const getToken = (): string | null => {
  const token = useUserStore.getState().token;
  
  // Check if token is a valid string, otherwise return null
  if (typeof token === 'string' && token.trim() !== '') {
    return token;
  }

  // Fallback to retrieving token from localStorage if it's not available in the store
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("discordToken");
    return localToken && localToken.trim() !== '' ? localToken : null;
  }

  return null;
};

// Fetch roles for a given guild
export const fetchRoles = async (
  guildId: string
): Promise<{ roles: DiscordRole[]; blinkShareRolePosition: number }> => {
  const token = getToken();

  if (!token) {
    throw new Error("No authorization token found.");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL is missing.");
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/discord/guilds/${guildId}/roles`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch roles for guild ${guildId}: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.roles)) {
      throw new Error("Invalid response format: 'roles' is not an array.");
    }

    return {
      roles: data.roles,
      blinkShareRolePosition: data.blinkShareRolePosition ?? -1,
    };
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}`, error);
    throw error;
  }
};

// Create an embedded wallet for a Discord user
export const createEmbeddedWallet = async (
  accessToken: string,
  discordUserId: string,
  address: string
): Promise<void> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  try {
    const payload = { discordUserId, address };
    const response = await fetch(
      `${apiBaseUrl}/discord/embedded-wallet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create embedded wallet: ${response.status} - ${response.statusText}. ${errorData.error || "Unknown error occurred."}`);
    }
  } catch (error) {
    console.error(`Error creating embedded wallet`, error);
    throw error;
  }
};

