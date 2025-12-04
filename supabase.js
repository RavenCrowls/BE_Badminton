require('dotenv').config();
const postgres = require('postgres');
const { createClient } = require('@supabase/supabase-js');

// Direct Postgres (pooler/direct) for health checks or raw SQL when needed
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment');
}
const sql = postgres(connectionString, { ssl: 'require' });

// Supabase client for PostgREST/Storage/Auth/Realtime
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL or SUPABASE_KEY is not set in environment');
}
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { sql, supabase };
