import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

if (
  !process.env.REACT_APP_SUPABASE_URL ||
  !process.env.REACT_APP_SUPABASE_ANON_KEY
) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env.local and restart the dev server."
  );
}
