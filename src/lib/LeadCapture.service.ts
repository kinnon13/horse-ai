import { supabase } from '@/lib/supabase';
import { ServiceRequest } from './LeadCapture.types';
import { extractServiceRequestLogic, notifyProvidersLogic } from './LeadCaptureHelpers';

export class LeadCaptureService {
  static async extractServiceRequest(message: string, userId: string): Promise<ServiceRequest | null> {
    return extractServiceRequestLogic(message, userId);
  }

  static async saveServiceRequest(request: ServiceRequest): Promise<void> {
    const { error } = await supabase.from('service_requests').insert(request);
    if (error) throw error;
  }

  static async notifyProviders(request: ServiceRequest): Promise<void> {
    return notifyProvidersLogic(request);
  }
}