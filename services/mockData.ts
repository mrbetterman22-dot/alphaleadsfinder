import { Lead, Monitor } from '../types';

export const MOCK_MONITORS: Monitor[] = [
  {
    id: 'm1',
    user_id: 'u1',
    keyword: 'Gym',
    city: 'Austin, TX',
    status: 'active',
    last_check_date: new Date().toISOString(),
  },
  {
    id: 'm2',
    user_id: 'u1',
    keyword: 'Dentist',
    city: 'Miami, FL',
    status: 'paused',
    last_check_date: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    monitor_id: 'm1',
    business_name: 'Iron Forge Fitness',
    google_place_id: 'gp1',
    rating: 5.0,
    type: 'new_business',
    email: 'contact@ironforge.com',
    phone: '+1 512-555-0101',
    review_date: new Date().toISOString(),
  },
  {
    id: 'l2',
    monitor_id: 'm1',
    business_name: 'Metro Flex Gym',
    google_place_id: 'gp2',
    rating: 1.0,
    review_text: "I called 5 times to cancel my membership and nobody picked up! Finally drove there and the front desk was empty. Terrible service.",
    review_date: new Date(Date.now() - 4000000).toISOString(),
    type: 'pain_point',
    email: 'manager@metroflex.com',
    phone: '+1 512-555-0102',
    ai_pitch: "I noticed a recent review mentioning difficulties reaching your front desk at Metro Flex Gym. Our AI voice receptionist can handle 100% of inbound calls 24/7, ensuring members never get frustrated by a busy signal again."
  },
  {
    id: 'l3',
    monitor_id: 'm2',
    business_name: 'Sunshine Dental',
    google_place_id: 'gp3',
    rating: 1.0,
    review_text: "Rude receptionist hung up on me when I asked about insurance. Taking my family elsewhere.",
    review_date: new Date(Date.now() - 12000000).toISOString(),
    type: 'pain_point',
    email: 'info@sunshinedental.com',
    phone: '+1 305-555-0199',
    ai_pitch: "Saw the feedback about staff interactions at Sunshine Dental—managing high call volumes can be stressful for receptionists. We install empathetic AI agents that handle insurance FAQs perfectly every time, improving patient retention."
  },
  {
    id: 'l4',
    monitor_id: 'm2',
    business_name: 'Miami Pearl Smiles',
    google_place_id: 'gp4',
    rating: 5.0,
    type: 'new_business',
    email: 'hello@pearlsmiles.com',
    phone: '+1 305-555-0200',
    review_date: new Date().toISOString(),
  },
];
