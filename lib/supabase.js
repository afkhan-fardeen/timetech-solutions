import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hruuwchgksxndwkavsgr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydXV3Y2hna3N4bmR3a2F2c2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NDQyODAsImV4cCI6MjA1NjIyMDI4MH0.2X5rQw4BOoWzVExiWzKNWYqud6pGRujT50eiI6YktQA';
export const supabase = createClient(supabaseUrl, supabaseKey);