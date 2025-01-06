import axios from 'axios';
import { DiscordServer, BlinkShareServerSettings, CreateBlinkResponse, BlinkShareApiResponse } from '@/lib/types/discord-server';
import { supabase } from '@/lib/supabase-client';
import { GetServerResponse, CreateServerRequest } from '@/lib/types/discord-server';

// Constants for Discord API interactions
const DISCORD_API_URL = 'https://discord.com/api/v9';

// Utility to get an OAuth2 token for Discord
export const getDiscordToken = async (code: string) => {
  try {
    const response = await axios.post(`${DISCORD_API_URL}/oauth2/token`, {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Discord token', error);
    throw new Error('Could not get Discord token');
  }
};

// Fetch guild details
export const getGuildDetails = async (guildId: string, token: string): Promise<DiscordServer> => {
  try {
    const response = await axios.get(`${DISCORD_API_URL}/guilds/${guildId}`, {
      headers: {
        Authorization: `Bot ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching guild details', error);
    throw new Error('Failed to fetch guild details');
  }
};

// Create a new BlinkShare server
export const createBlinkShareServer = async (
  guildData: BlinkShareServerSettings,
  userAddress: string,
  token: string
): Promise<CreateBlinkResponse> => {
  try {
    const response = await axios.post<CreateBlinkResponse>(`${process.env.BLINK_API_URL}/create`, {
      guildId: guildData.guildId,
      title: guildData.customTitle || guildData.description,
      icon: guildData.customIcon || 'default_icon_url',
      description: guildData.description,
      detailedDescription: guildData.detailedDescription,
      roles: guildData.selectedRoles,
      ownerWallet: userAddress,
      token,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating BlinkShare server', error);
    throw new Error('Failed to create BlinkShare server');
  }
};

// Example of a POST handler for creating a new server
export const createGuildHandler = async (
  req: any, 
  res: any
) => {
  try {
    const { guildData, userAddress, token } = req.body;

    if (!guildData || !userAddress || !token) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const server = await createBlinkShareServer(guildData, userAddress, token);
    return res.status(200).json(server);
  } catch (error) {
    console.error('Error handling server creation', error);
    return res.status(500).json({ message: error.message });
  }
};
