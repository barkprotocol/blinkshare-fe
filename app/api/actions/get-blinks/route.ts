import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Types
type Blink = {
  id: string;
  label: string;
  description: string;
  wallet: string;
  mint: string;
  icon: string;
  created_at: string;
};

type GetBlinksResponse = {
  blinks: Blink[];
  count: number;
};

type PostRequestBody = {
  wallet?: string;
  mint?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

// GET method for basic querying
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase.from('blinks').select('*', { count: 'exact' });

    if (wallet) {
      query = query.eq('wallet', wallet);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching blinks:', error);
      return NextResponse.json({ error: 'Failed to fetch blinks' }, { status: 500 });
    }

    const response: GetBlinksResponse = {
      blinks: data as Blink[],
      count: count || 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/actions/get-blinks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST method for advanced querying and pagination
export async function POST(req: Request) {
  try {
    const body: PostRequestBody = await req.json();
    const { wallet, mint, search, limit = 10, offset = 0 } = body;

    let query = supabase.from('blinks').select('*', { count: 'exact' });

    if (wallet) {
      query = query.eq('wallet', wallet);
    }

    if (mint) {
      query = query.eq('mint', mint);
    }

    if (search) {
      query = query.or(`label.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching blinks:', error);
      return NextResponse.json({ error: 'Failed to fetch blinks' }, { status: 500 });
    }

    const response: GetBlinksResponse = {
      blinks: data as Blink[],
      count: count || 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/actions/get-blinks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

