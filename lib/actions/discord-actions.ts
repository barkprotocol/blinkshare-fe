import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { DiscordRole } from "@/lib/types/discord-role";

// Define the structure for the Roles response
interface RolesResponse {
  roles: DiscordRole[];
  blinkShareRolePosition: number;
  [key: string]: number | DiscordRole[];
}

export const fetchRoles = async (guildId: string): Promise<RolesResponse> => {
  // Get token from Zustand store or localStorage (only on the client side)
  const token = typeof window !== 'undefined'
    ? useUserStore.getState().token || localStorage.getItem("discordToken")
    : null;

  // If no token is found, log and throw error
  if (!token) {
    console.error("No authorization token found.");
    throw new Error("Authorization token is missing");
  }

  try {
    // Send request to fetch roles from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${guildId}/roles`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    // Handle non-OK responses
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid; re-authentication is needed
        console.error("Token expired or invalid. Please log in again.");
        // Optionally trigger logout or refresh here
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response data
    const data: RolesResponse = await response.json();

    // Validate that the roles field is an array
    if (!Array.isArray(data.roles)) {
      throw new Error("Invalid response format: 'roles' is not an array");
    }

    // Ensure blinkShareRolePosition exists
    const blinkShareRolePosition = data.blinkShareRolePosition ?? 0;

    return { ...data, blinkShareRolePosition };
  } catch (error) {
    console.error(`Error fetching roles for guild ${guildId}:`, error);
    // Optionally report error to an external service here (e.g., Sentry)
    throw error; // Propagate the error further
  }
};
