// js/lib/supabase.js · único archivo que importa supabase-js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

import { SUPABASE_URL, SUPABASE_CLAVE_ANON } from "../config/supabase.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_CLAVE_ANON);
