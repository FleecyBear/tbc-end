'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

async function ensureProfileExists(supabase: any, user: any) {
  if (!user) return;

  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (profileCheckError && profileCheckError.code !== 'PGRST116') {
    console.error('Error checking profile:', profileCheckError);
    return;
  }

  if (!existingProfile) {
    const profileData = {
      user_id: user.id,
      email: user.email,
      nickname: user.email,
    };

    const { error: profileInsertError } = await supabase
      .from('profiles')
      .insert([profileData]);

    if (profileInsertError) {
      console.error('Error creating profile:', profileInsertError);
    }
  }
}

export async function login(formData: FormData, redirectTo: string = '/home') {
  const supabase = await createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error);
  }

  const user = authData.user;
  if (!user) {
    console.error('No user found after login');
  }

  await ensureProfileExists(supabase, user);

}

export async function signup(formData: FormData, redirectTo: string = '/login') {
  const supabase = await createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error);
    return redirect('/error');
  }

  const user = authData.user;
  if (!user) {
    console.error('No user found after signup');
  }

  await ensureProfileExists(supabase, user);

}
