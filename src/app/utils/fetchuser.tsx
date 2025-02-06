import { createClient } from "./supabase/client";
export const fetchUser = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user; 
};
