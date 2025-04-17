
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '@/components/books/BookForm';
import { fetchBookById } from '@/services/api';
import { Book } from '@/types';
import { toast } from '@/components/ui/sonner';

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await fetchBookById(parseInt(id));
        setBook(data);
      } catch (error) {
        console.error('Error loading book details:', error);
        toast.error('Failed to load book for editing');
        navigate('/books');
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/2 bg-muted rounded"></div>
        <div className="h-4 w-1/3 bg-muted rounded"></div>
        <div className="h-[500px] bg-muted rounded"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
        <p className="text-muted-foreground">The book you're trying to edit doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
        <p className="text-muted-foreground mt-1">
          Update details for "{book.title}"
        </p>
      </div>
      
      <BookForm mode="edit" initialData={book} />
    </div>
  );
};

export default EditBook;
