import { useEffect, useState } from "react";
import { fetchBooks } from "@/services/api";
import { Book } from "@/types";
import BookGrid from "@/components/books/BookGrid";
import { toast } from "@/components/ui/sonner";

const BookCatalog = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Failed to load books. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookDelete = (id: number) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book Catalog</h1>
        <p className="text-muted-foreground mt-1">
          Browse our collection of {books.length} books
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="book-card h-[400px] animate-pulse bg-card">
              <div className="bg-muted h-2/3"></div>
              <div className="p-4 h-1/3">
                <div className="w-3/4 h-4 bg-muted rounded"></div>
                <div className="w-1/2 h-3 bg-muted rounded mt-3"></div>
                <div className="w-1/3 h-3 bg-muted rounded mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BookGrid books={books} onBookDelete={handleBookDelete} />
      )}
    </div>
  );
};

export default BookCatalog;
