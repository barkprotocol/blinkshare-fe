export const handleDiscordCallback: HandleDiscordCallback = async (code) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/discord/callback`;
  
    try {
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
  
      if (!response.ok) {
        throw new Error(`Discord API responded with status ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.access_token) {
        throw new Error("Failed to get access token from Discord API");
      }
  
      // Fetch user and guilds information using the access token
      const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
  
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user information: ${userResponse.status}`);
      }
  
      const user = await userResponse.json();
  
      const guildResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
  
      if (!guildResponse.ok) {
        throw new Error(`Failed to fetch guilds information: ${guildResponse.status}`);
      }
  
      const guilds = await guildResponse.json();
  
      return {
        userId: user.id,
        username: user.username,
        guilds,
        token: data.access_token,
      };
    } catch (error) {
      console.error("Error handling Discord callback:", error);
      throw new Error("An error occurred while processing the Discord callback");
    }
  };
  