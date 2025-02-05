'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
export async function login(formData: FormData, redirectTo: string = '/') {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signup(formData: FormData, redirectTo: string = '/') {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error)
    redirect('/error')
  }

  // Now access the user from authData
  const user = authData.user

  // Check if user exists
  if (user) {
    const { email, id } = user // `id` is the UUID of the user
    const profileData = {
      user_id: id,      // This is the UUID from authentication
      email: email,
      nickname: email,  // Set the nickname to the email by default
      coins: 100,       // Default coins
    }

    // Insert the new profile into the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profileData])

    if (profileError) {
      console.error('Error creating profile:', profileError)
      redirect('/error')
    }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}