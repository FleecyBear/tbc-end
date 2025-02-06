'use client';
import { createClient } from '../utils/supabase/client';

export const logoutUser = async (router: any) => {
    const supabase = createClient();
  
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
      } else {
        router.push('/home'); 
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };