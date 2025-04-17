
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  published_date: string;
  genre: string;
  description: string;
  cover_image?: string;
  copies_available: number;
  total_copies: number;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  published_date: string;
  genre: string;
  description: string;
  cover_image?: string;
  copies_available: number;
  total_copies: number;
}

export type UserRole = 'customer' | 'librarian';

export interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  can_rent_books: boolean;
  latitude?: number;
  longitude?: number;
  social_media?: string;
}

export interface Library {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  books_available: number;
  can_rent_books: boolean;
}

export interface DashboardStats {
  total_books: number;
  available_books: number;
  total_copies: number;
  registered_users?: number;
  borrowed_books?: number;
}
