export interface ServiceRequest {
  id: string;
  user_id: string;
  service_type: string;
  description: string;
  location: string;
  contact_email: string;
  status: 'pending' | 'claimed' | 'completed';
  created_at: string;
}



