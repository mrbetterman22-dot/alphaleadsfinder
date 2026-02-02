export interface User {
  id: string;
  email: string;
}

export interface Monitor {
  id: string;
  user_id: string;
  keyword: string;
  city: string;
  status: 'active' | 'paused';
  last_check_date: string;
}

export type LeadType = 'new_business' | 'pain_point';

export interface Lead {
  id: string;
  monitor_id: string;
  business_name: string;
  google_place_id: string;
  rating: number;
  review_text?: string;
  review_date?: string;
  email?: string;
  phone?: string;
  type: LeadType;
  ai_pitch?: string;
}

// Navigation types
export type View = 'dashboard' | 'monitors' | 'leads' | 'settings';