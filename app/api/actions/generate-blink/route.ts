import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/mongodb';

export async function POST(req: Request) {
  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    // Parse the request body
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ success: false, error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Destructure and validate the parsed data
    const { icon, label, description, title, wallet } = data;

    if (!icon || !label || !description || !title || !wallet) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: icon, label, description, title, or wallet' },
        { status: 400 }
      );
    }

    // Validate the wallet address (basic Solana address regex)
    if (!/^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(wallet)) {
      return NextResponse.json({ success: false, error: 'Invalid wallet address' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('Cluster0');

    // Insert the blink into the database
    const result = await db.collection('blinks').insertOne({
      icon,
      label,
      description,
      title,
      wallet,
      createdAt: new Date(),
    });

    // Construct the Blink link (use a base URL from environment variables)
    const blinkLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/actions/donate/${result.insertedId}`;

    // Respond with success
    return NextResponse.json({ success: true, blinkLink });
  } catch (error) {
    console.error('Error generating blink:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate blink. Please try again later.' },
      { status: 500 }
    );
  }
}
