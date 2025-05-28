import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khkwbovmmzzdehxlecot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoa3dib3ZtbXp6ZGVoeGxlY290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTA4NDIsImV4cCI6MjA2Mzk2Njg0Mn0.Uh6D3jZkf5Milg73EoU5R542YWsGg-odeiwvdx_QO9I';
export const supabase = createClient(supabaseUrl, supabaseKey);