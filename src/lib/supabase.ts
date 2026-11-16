import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Fallar rápido y con un mensaje claro si falta configuración.
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Faltan variables de entorno de Supabase. Revisá el archivo .env.local',
  );
}

/** Instancia única del cliente para toda la app. */
export const supabase = createClient(supabaseUrl, supabaseKey);