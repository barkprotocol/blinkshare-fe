import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: 'Blink ID is required' }, { status: 400 })
    }

    const { data: blink, error } = await supabase
      .from('blinks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch blink' }, { status: 500 })
    }

    if (!blink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 })
    }

    return NextResponse.json({ blink })
  } catch (error) {
    console.error('Error fetching blink:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

