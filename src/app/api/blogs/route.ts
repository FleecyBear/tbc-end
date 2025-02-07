// app/api/blogs/route.ts
import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await (await supabase)
      .from('blogs')
      .select('title, title_ka, description, description_ka, creator, user_id, created_at, id')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Error fetching blogs' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
