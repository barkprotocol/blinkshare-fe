import { NextResponse } from "next/server";

// Handle GET requests
export async function GET(request: Request) {
  // Example logic for a GET request, such as fetching data from Discord
  return NextResponse.json({ message: "GET request received" });
}

// Handle POST requests (e.g., Discord callback)
export async function POST(request: Request) {
  try {
    // Parse the incoming request (Discord callback data)
    const data = await request.json();

    // Hhandle the Discord callback (e.g., saving data or making API calls)
    console.log(data);

    // Respond with a success message
    return NextResponse.json({ message: "Discord callback processed successfully", data });
  } catch (error) {
    // Handle error if something goes wrong
    console.error("Error processing Discord callback:", error);
    return NextResponse.json({ message: "Failed to process callback", error: error.message }, { status: 500 });
  }
}
