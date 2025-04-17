
import axios from 'axios';
import { Book, BookFormData } from '@/types';
import { toast } from '@/components/ui/sonner';
import { API_BASE_URL } from '@/config/env';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup token interceptor
const token = localStorage.getItem('bookmaster_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('bookmaster_token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await api.get('/books/books/');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    toast.error('Failed to load books');
    return [];
  }
};

export const fetchBookById = async (id: number): Promise<Book | null> => {
  try {
    const response = await api.get(`/books/book/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    toast.error('Failed to load book details');
    return null;
  }
};

export const addBook = async (bookData: BookFormData): Promise<Book | null> => {
  try {
    const response = await api.post('/books/books/', bookData);
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    toast.error('Failed to add book');
    return null;
  }
};

export const updateBook = async (id: number, bookData: Partial<BookFormData>): Promise<Book | null> => {
  try {
    const response = await api.patch(`/books/book/${id}/`, bookData);
    return response.data;
  } catch (error) {
    console.error(`Error updating book ${id}:`, error);
    toast.error('Failed to update book');
    return null;
  }
};

export const deleteBook = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/books/book/${id}/`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error);
    toast.error('Failed to delete book');
    return false;
  }
};

export const bulkAddBooks = async (books: BookFormData[]): Promise<Book[]> => {
  try {
    const response = await api.post('/books/add-books/', books);
    return response.data;
  } catch (error) {
    console.error('Error adding books in bulk:', error);
    toast.error('Failed to add books in bulk');
    return [];
  }
};

export const fetchLibraries = async () => {
  try {
    const response = await api.get('/libraries/libraries/');
    return response.data;
  } catch (error) {
    console.error('Error fetching libraries:', error);
    toast.error('Failed to load libraries');
    return [];
  }
};
