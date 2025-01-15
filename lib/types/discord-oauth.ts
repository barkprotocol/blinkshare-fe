import { DiscordOAuthResponse } from '@/lib/types';

// Interface for the Discord server configuration
export interface DiscordServer {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

// Function to generate the Discord OAuth login URL
export const getDiscordLoginUrl = (discordServer: DiscordServer, isOwner: boolean = false): string => {
    // Base URL for Discord OAuth2 authorization
    const baseUrl = "https://discord.com/oauth2/authorize";
    
    // Construct URLSearchParams to include query parameters
    const params = new URLSearchParams({
        client_id: discordServer.clientId,
        redirect_uri: discordServer.redirectUri,
        response_type: "code",
        scope: "identify email guilds", // Added 'guilds' scope for server information
        state: generateRandomState(isOwner), // A random state for CSRF protection (Optional but recommended)
    });

    return `${baseUrl}?${params.toString()}`;
};

// Helper function to generate a random state for CSRF protection
const generateRandomState = (isOwner: boolean): string => {
    const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return isOwner ? `owner_${randomPart}` : `user_${randomPart}`;
}

// Function to handle the Discord callback after OAuth login
export const handleDiscordCallback = async (code: string, discordServer: DiscordServer): Promise<DiscordOAuthResponse> => {
    const tokenUrl = "https://discord.com/api/oauth2/token";
    
    // Prepare the data to exchange the authorization code for an access token
    const data = new URLSearchParams({
        client_id: discordServer.clientId,
        client_secret: discordServer.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: discordServer.redirectUri,
    });

    try {
        // Send a POST request to Discord's token endpoint
        const response = await fetch(tokenUrl, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        // Check if the response was successful
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Discord OAuth2 callback failed: ${errorDetails.error_description || "Unknown error"}`);
        }

        // Extract the OAuth response data
        const { access_token, refresh_token, expires_in } = await response.json();

        return { accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in };
    } catch (error) {
        console.error("Error during Discord OAuth callback:", error);
        throw error;
    }
};

// Function to refresh the Discord access token
export const refreshDiscordToken = async (refreshToken: string, discordServer: DiscordServer): Promise<DiscordOAuthResponse> => {
    const tokenUrl = "https://discord.com/api/oauth2/token";
    
    const data = new URLSearchParams({
        client_id: discordServer.clientId,
        client_secret: discordServer.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Discord token refresh failed: ${errorDetails.error_description || "Unknown error"}`);
        }

        const { access_token, refresh_token, expires_in } = await response.json();

        return { accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in };
    } catch (error) {
        console.error("Error refreshing Discord token:", error);
        throw error;
    }
};

// Function to fetch user information from Discord
export const fetchDiscordUserInfo = async (accessToken: string): Promise<any> => {
    const userInfoUrl = "https://discord.com/api/users/@me";

    try {
        const response = await fetch(userInfoUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Discord user info: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching Discord user info:", error);
        throw error;
    }
};

