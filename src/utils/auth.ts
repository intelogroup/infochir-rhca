import { supabase } from "@/integrations/supabase/client";

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("is_super_admin")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return !!data?.is_super_admin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};