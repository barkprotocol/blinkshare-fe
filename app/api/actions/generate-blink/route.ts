import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Solana connection
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC_URL);

// Utility function to fetch token metadata
async function fetchTokenMetadata(mintAddress: string) {
  try {
    const response = await fetch(`https://public-api.solscan.io/token/meta?tokenAddress=${mintAddress}`);
    if (!response.ok) throw new Error('Failed to fetch token metadata');
    return await response.json();
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    const body = await req.json();
    const { label, description, wallet, mint, commission, percentage } = body;

    if (!label || !description || !wallet || !mint) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate wallet address
    try {
      new PublicKey(wallet);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    // Fetch token metadata and mint info
    const [tokenMetadata, mintInfo] = await Promise.all([
      fetchTokenMetadata(mint),
      getMint(connection, new PublicKey(mint))
    ]);

    if (!tokenMetadata || !mintInfo) {
      return NextResponse.json({ error: 'Failed to fetch token information' }, { status: 400 });
    }

    // Prepare blink data
    const blinkData = {
      icon: tokenMetadata.icon || tokenMetadata.logoURI,
      label,
      description,
      title: `BUY ${tokenMetadata.symbol || tokenMetadata.name}`,
      wallet,
      mint,
      commission: commission || 0,
      percentage: percentage || false,
      decimals: mintInfo.decimals,
      created_at: new Date().toISOString(),
      code: code || null,
    };

    // Insert blink into Supabase
    const { data: insertedBlink, error } = await supabase
      .from('blinks')
      .insert(blinkData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insertion error:', error);
      return NextResponse.json({ error: 'Failed to generate blink' }, { status: 500 });
    }

    // Construct blink link
    const blinkBaseUrl = process.env.NEXT_PUBLIC_BLINK_URL || 'https://blinkshare.fun';
    const blinkLink = `${blinkBaseUrl}/b/${insertedBlink.id}`;

    return NextResponse.json({ success: true, blinkLink });
  } catch (error) {
    console.error('Error generating blink:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

