import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

// Utility function to check and validate API base URL
const getValidatedApiBaseUrl = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!apiBaseUrl) {
    console.error("API Base URL is not defined in environment variables.");
    throw new Error('API Base URL is not defined in environment variables.');
  }

  try {
    new URL(apiBaseUrl); // Will throw if invalid
  } catch (error) {
    console.error("Invalid API Base URL format:", apiBaseUrl);
    throw new Error('API Base URL is invalid.');
  }

  return apiBaseUrl;
};

// Default GET handler
export const GET = async () => {
  try {
    const apiBaseUrl = getValidatedApiBaseUrl();

    const payload: ActionsJson = {
      rules: [
        {
          pathPattern: "/**",
          apiPath: `${apiBaseUrl}/blinks/**`,
        },
      ],
    };

    return new Response(JSON.stringify(payload), { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};

// POST handler
export const POST = async (request: Request) => {
  try {
    const apiBaseUrl = getValidatedApiBaseUrl();
    const body = await request.json();

    // Here you would typically process the POST data
    // For this example, we'll just echo it back
    const payload = {
      message: "POST request received",
      data: body,
      apiBaseUrl: apiBaseUrl
    };

    return new Response(JSON.stringify(payload), { 
      status: 200, 
      headers: ACTIONS_CORS_HEADERS 
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};

// PUT handler
export const PUT = async (request: Request) => {
  try {
    const apiBaseUrl = getValidatedApiBaseUrl();
    const body = await request.json();

    // Here you would typically process the PUT data
    // For this example, we'll just echo it back
    const payload = {
      message: "PUT request received",
      data: body,
      apiBaseUrl: apiBaseUrl
    };

    return new Response(JSON.stringify(payload), { 
      status: 200, 
      headers: ACTIONS_CORS_HEADERS 
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};

// OPTIONS handler
export const OPTIONS = GET;