import { NextApiRequest, NextApiResponse } from "next";
import { GetDiscordLoginUrl, HandleDiscordCallback } from "@/lib/types/discord-server";
import { discordServerSchema } from "@/lib/types/discord-server";

// Example: Handling different API routes for Discord

// Function to generate a login URL
export const getDiscordLoginUrl: GetDiscordLoginUrl = async (owner) => {
  // Construct OAuth URL to direct users to Discord login
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/discord/callback`;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const scope = "identify guilds";
  const responseType = "code";

  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.append("client_id", clientId || "");
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("response_type", responseType);
  url.searchParams.append("scope", scope);

  if (owner) {
    url.searchParams.append("permissions", "8"); // Administrator permissions (if required)
  }

  return url.toString();
};

// API handler for getting Discord login URL
export async function getDiscordLoginUrlHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { owner } = req.query; // You could make the 'owner' flag dynamic based on the query params
    const url = await getDiscordLoginUrl(owner === "true");
    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate Discord login URL" });
  }
}

// Function to handle Discord OAuth callback
export const handleDiscordCallback: HandleDiscordCallback = async (code) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/discord/callback`;

  // Make request to Discord API to exchange code for access token
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId || "",
      client_secret: clientSecret || "",
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Failed to get access token");
  }

  // Fetch user and guilds information using the access token
  const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });
  const user = await userResponse.json();

  const guildResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });
  const guilds = await guildResponse.json();

  return {
    userId: user.id,
    username: user.username,
    guilds,
    token: data.access_token,
  };
};

// API handler for Discord OAuth callback
export async function handleDiscordCallbackHandler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const { userId, username, guilds, token } = await handleDiscordCallback(code as string);

    // You can save this data in a database or session for later use
    res.status(200).json({
      userId,
      username,
      guilds,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to handle Discord callback" });
  }
}

// API handler for getting server info (this can be adjusted as needed)
export async function getServerInfoHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { serverId } = req.query;

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    // Fetch server info from your database or Discord API
    const serverInfo = await fetchServerInfo(serverId as string); // Assuming a function that fetches server info

    // Validate server data using Zod schema
    discordServerSchema.parse(serverInfo);

    res.status(200).json(serverInfo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch server info" });
  }
}

// Example function to fetch server info (You might have a database call here)
async function fetchServerInfo(serverId: string) {
  // This could be an API request to Discord or a database call
  return {
    id: serverId,
    name: "Example Server",
    iconUrl: "https://example.com/icon.png",
    description: "A description of the server.",
    ownerId: "12345",
    roles: [],
    memberCount: 100,
    notificationChannelId: "67890",
  };
}

// Defining the API routes for the server
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      if (req.query.code) {
        await handleDiscordCallbackHandler(req, res);
      } else if (req.query.serverId) {
        await getServerInfoHandler(req, res);
      } else {
        await getDiscordLoginUrlHandler(req, res);
      }
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}
