export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  author_name: string;
  category_id: string;
  category_name: string;
  tags: string[];
}

export interface User {
  id:string;
  email: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_type: string;
  message: string;
  created_at: string;
}

export interface PropertyInquiry {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: User;
}

export interface ContactForm {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_type: string;
  about: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}