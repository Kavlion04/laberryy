import { api } from './auth';

export interface Book {
  id: number;
  name: string;
  author: string;
  publisher: string;
  quantity_in_library: number;
  library: number;
}

export interface CreateBookDto {
  name: string;
  author: string;
  publisher: string;
  quantity_in_library: number;
  library: number;
}

// Kitoblar ro'yxatini olish
export const getBooks = async (libraryId: number) => {
  try {
    const response = await api.get<Book[]>(`/books/library/${libraryId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Yangi kitob qo'shish
export const addBook = async (bookData: CreateBookDto) => {
  try {
    const response = await api.post<Book>('/books/add-books/', {
      data: [bookData]
    });
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// Kitobni yangilash
export const updateBook = async (bookId: number, bookData: Partial<CreateBookDto>) => {
  try {
    const response = await api.put<Book>(`/books/${bookId}/`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Kitobni o'chirish
export const deleteBook = async (bookId: number) => {
  try {
    await api.delete(`/books/${bookId}/`);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}; 