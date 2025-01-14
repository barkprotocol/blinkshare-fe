import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/mongodb';
import { Connection, PublicKey } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { TokenListProvider } from '@solana/spl-token-registry';
import { getMint } from '@solana/spl-token';

// Environment Variables
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const BLINK_BASE_URL = process.env.NEXT_PUBLIC_BLINK_URL || 'https://blinkshare.fun/generator';

// Umi and Solana Connection
const umi = createUmi(SOLANA_RPC_URL).use(mplCore());
const connection = new Connection(SOLANA_RPC_URL);

// Utility Function: Fetch Token Metadata
async function fetchTokenMetadata(mintAddress: PublicKey) {
  try {
    const { metadata: { Metadata } } = await import('@metaplex-foundation/mpl-token-metadata');
    const metadataPDA = await Metadata.getPDA(mintAddress);
    const tokenMetadata = await Metadata.load(connection, metadataPDA);
    return tokenMetadata?.data?.data || null;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

// Utility Function: Fetch Token Info from Registry
async function fetchTokenInfoFromRegistry(mintAddress: string) {
  const tokenList = await new TokenListProvider().resolve();
  const tokens = tokenList.getList();
  const tokenInfo = tokens.find((t) => t.address === mintAddress);
  if (!tokenInfo) throw new Error('Token not found in registry');
  return { name: tokenInfo.name, image: tokenInfo.logoURI };
}

// GET Handler
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mint = searchParams.get('mint');
    if (!mint) return NextResponse.json({ error: 'Mint address is required' }, { status: 400 });

    const mintAddress = new PublicKey(mint);
    const metadata = await fetchTokenMetadata(mintAddress);

    if (!metadata || !metadata.uri) {
      const tokenInfo = await fetchTokenInfoFromRegistry(mint);
      return NextResponse.json({ icon: tokenInfo.image, title: `BUY ${tokenInfo.name}` });
    }

    const response = await fetch(metadata.uri);
    const tokenJson = await response.json();
    return NextResponse.json({ icon: tokenJson.image, title: `BUY ${metadata.name}` });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Invalid mint address or metadata unavailable' }, { status: 500 });
  }
}

// POST Handler
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const data = JSON.parse(rawBody);

    const { label, description, wallet, mint, commission, percentage } = data;
    if (!label || !description || !wallet || !mint) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mintAddress = new PublicKey(mint);
    const mintInfo = await getMint(connection, mintAddress);
    if (!mintInfo?.decimals) throw new Error('Invalid mint: missing token decimals');

    const metadata = await fetchTokenMetadata(mintAddress);
    let tokenName, tokenJson;

    if (!metadata || !metadata.uri) {
      const tokenInfo = await fetchTokenInfoFromRegistry(mint);
      tokenName = tokenInfo.name;
      tokenJson = { image: tokenInfo.image };
    } else {
      const response = await fetch(metadata.uri);
      tokenJson = await response.json();
      tokenName = metadata.name;
    }

    const client = await clientPromise;
    const db = client.db('Cluster0');
    const result = await db.collection('blinks').insertOne({
      icon: tokenJson.image,
      label,
      description,
      title: `BUY ${tokenName}`,
      wallet,
      mint,
      commission,
      percentage,
      decimals: mintInfo.decimals,
      createdAt: new Date(),
    });

    const blinkLink = `${BLINK_BASE_URL}/api/actions/tokens/${result.insertedId}`;
    return NextResponse.json({ blinkLink });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to generate blink' }, { status: 500 });
  }
}
