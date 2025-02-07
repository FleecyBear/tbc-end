import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();

    const { data: userData, error: userError } = await (await supabase).auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, title_ka, description, description_ka } = await request.json();

    const { data: blog, error: blogError } = await (await supabase)
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (blogError || !blog || blog.user_id !== userData.user.id) {
      return NextResponse.json({ error: 'You are not allowed to edit this blog' }, { status: 403 });
    }

    const { data, error } = await (await supabase)
      .from('blogs')
      .update({ title, title_ka, description, description_ka })
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Error updating blog' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog updated successfully', blog: data });
  } catch (err) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
