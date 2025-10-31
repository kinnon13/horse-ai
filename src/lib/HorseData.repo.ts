// HorseData.repo.ts (30 lines)
import { supabase } from '@/lib/supabase-client';

export interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  user_id: string;
  notes?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  type: 'vet' | 'farrier' | 'trainer';
  service_type: string;
  city: string;
  state: string;
  phone: string;
  rating: number;
  verified: boolean;
}

export class HorseDataRepository {
  static async getUserHorses(userId: string): Promise<Horse[]> {
    const { data, error } = await supabase.from('horses').select('*').eq('user_id', userId);
    if (error) throw error;
    return data || [];
  }

  static async getNearbyVets(city: string, state: string): Promise<ServiceProvider[]> {
    const { data, error } = await supabase.from('service_providers').select('*').eq('type', 'vet').eq('city', city).eq('state', state).eq('verified', true);
    if (error) throw error;
    return data || [];
  }

  static async searchServices(query: string, location: string): Promise<ServiceProvider[]> {
    const { data, error } = await supabase.from('service_providers').select('*').or(`name.ilike.%${query}%,type.ilike.%${query}%`).ilike('city', `%${location}%`);
    if (error) throw error;
    return data || [];
  }

  async searchProviders(serviceType: string, location: string): Promise<ServiceProvider[]> {
    const { data, error } = await supabase.from('service_providers').select('*').eq('type', serviceType).ilike('city', `%${location}%`);
    if (error) throw error;
    return data || [];
  }
}