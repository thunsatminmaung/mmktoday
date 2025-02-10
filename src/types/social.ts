export interface SocialPost {
  id: string;
  platform: 'facebook' | 'youtube' | 'telegram' | 'tiktok';
  content: string;
  link: string;
  timestamp: string;
  image?: string;
}

export interface SocialConfig {
  facebook: string;
  youtube: string;
  telegram: string;
  tiktok: string;
}