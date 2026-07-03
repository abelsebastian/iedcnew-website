import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./data/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_ANON_KEY in your .env file (see .env.example).",
  );
}

/**
 * The single Supabase client for the whole app.
 *
 * Per the design (Architecture: "the Supabase client is the only data path"),
 * this module must export exactly one client instance. Importing `supabase`
 * anywhere reuses this singleton rather than constructing a new connection.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
