import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

// Database insert operation
async function insertSecretData() {
  try {
    const { data, error } = await supabase
      .from('sensitive_table')
      .insert([{ secret_data: 'admin-only-information' }]);

    if (error) {
      console.error('Error inserting data:', error);
      return null;
    }

    console.log('Data inserted successfully:', data);
    return data;
  } catch (catchError) {
    console.error('Unexpected error:', catchError);
    return null;
  }
}

// Optional: Call the function
insertSecretData();

export { supabase, insertSecretData };