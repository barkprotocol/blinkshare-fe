import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');

    // Validate wallet address
    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet address in query params' }, { status: 400 });
    }

    if (!/^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(wallet)) { // Regex for Solana wallet address
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Cluster0");

    // Query the database for blinks
    const blinks = await db.collection("blinks").find({ wallet }).toArray();

    return NextResponse.json({ blinks: blinks || [] });
  } catch (error) {
    console.error('Error fetching blinks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blinks. Please try again later.' },
      { status: 500 }
    );
  }
}
