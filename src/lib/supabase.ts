import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MusicTrack {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}

export interface BinauralTrack {
  id: string;
  name: string;
  frequency_range: string;
  file_url: string;
  created_at: string;
}

export async function getMusicTracks(): Promise<MusicTrack[]> {
  const { data, error } = await supabase
    .from('music_tracks')
    .select('*')
    .order('title', { ascending: true });
  
  if (error) {
    console.error('Error fetching music tracks:', error);
    return [];
  }
  
  return data || [];
}

export async function getBinauralTracks(): Promise<BinauralTrack[]> {
  const { data, error } = await supabase
    .from('binaural_tracks')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching binaural tracks:', error);
    return [];
  }
  
  return data || [];
}
