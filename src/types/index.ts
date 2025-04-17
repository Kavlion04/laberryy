
export interface Book {
  id: number;
  name: string;
  author: string;
  publisher : string;
  quantity_in_library: number;
}

export interface BookFormData {
  name: string;
  author: string;
  published_date: string;
  cover_image?: string;
  copies_available: number;
  quantity_in_library: number;
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
