import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hypothetical function to process a donation
async function processDonation(amount: number, currency: string, recipientWallet: string) {
  // This is where you'd implement the actual donation logic
  // For now, we'll just simulate a successful donation
  console.log(`Processing donation of ${amount} ${currency} to ${recipientWallet}`);
  return { success: true, transactionId: 'transaction-id' };
}

export async function GET(
  req: Request,
  { params }: { params: { uniqueId: string } }
) {
  try {
    const { uniqueId } = params;

    const { data: blink, error: fetchError } = await supabase
      .from('blinks')
      .select('id, label, description, wallet, total_donations, last_donation_at')
      .eq('id', uniqueId)
      .single();

    if (fetchError) {
      console.error('Error fetching blink:', fetchError);
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    return NextResponse.json(blink);
  } catch (error) {
    console.error('Error fetching blink details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { uniqueId: string } }
) {
  try {
    const { uniqueId } = params;
    const { amount, currency } = await req.json();

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!currency || typeof currency !== 'string') {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
    }

    // Fetch the Blink details
    const { data: blink, error: fetchError } = await supabase
      .from('blinks')
      .select('*')
      .eq('id', uniqueId)
      .single();

    if (fetchError || !blink) {
      console.error('Error fetching blink:', fetchError);
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    // Process the donation
    const donationResult = await processDonation(amount, currency, blink.wallet);

    if (!donationResult.success) {
      return NextResponse.json({ error: 'Donation processing failed' }, { status: 500 });
    }

    // Update the Blink record with the donation information
    const { error: updateError } = await supabase
      .from('blinks')
      .update({
        total_donations: (blink.total_donations || 0) + amount,
        last_donation_at: new Date().toISOString(),
      })
      .eq('id', uniqueId);

    if (updateError) {
      console.error('Error updating blink:', updateError);
      return NextResponse.json({ error: 'Failed to update donation record' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Donation processed successfully',
      transactionId: donationResult.transactionId,
    });

  } catch (error) {
    console.error('Error processing donation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

