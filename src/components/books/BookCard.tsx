
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/context/RoleContext';
import { BookOpen, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { deleteBook } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onDelete?: (id: number) => void;
}

const BookCard = ({ book, onDelete }: BookCardProps) => {
  const { role } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteBook(book.id);
      if (success) {
        toast.success(`"${book.title}" has been deleted`);
        onDelete?.(book.id);
      } else {
        toast.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("An error occurred while deleting the book");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on a button or dialog
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('[role="dialog"]')) {
      return;
    }
    navigate(`/books/${book.id}`);
  };

  const getAvailabilityColor = () => {
    // Ensure we're working with valid numbers
    const available = typeof book.copies_available === 'number' ? book.copies_available : 0;
    const total = typeof book.total_copies === 'number' ? book.total_copies : 0;
    
    // Avoid division by zero
    if (total === 0) return "warning";
    
    const ratio = available / total;
    if (ratio === 0) return "destructive";
    if (ratio < 0.3) return "warning";
    return "success";
  };

  return (
    <Card 
      className="book-card h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {book.cover_image ? (
          <img 
            src={book.cover_image} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <BookOpen className="w-16 h-16 text-muted-foreground/50" />
          </div>
        )}
        <Badge className="absolute top-2 right-2" variant={getAvailabilityColor() as any}>
          {typeof book.copies_available === 'number' ? book.copies_available : 0} of {typeof book.total_copies === 'number' ? book.total_copies : 0} available
        </Badge>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="text-lg font-semibold line-clamp-2">{book.title || 'Untitled'}</h3>
        <p className="text-sm text-muted-foreground">{book.author || 'Unknown Author'}</p>
        <div className="mt-2 flex items-center">
          <Badge variant="outline" className="mr-2">{book.genre || 'General'}</Badge>
          <span className="text-xs text-muted-foreground">
            {book.published_date ? new Date(book.published_date).getFullYear() : 'Unknown year'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            navigate(`/books/${book.id}`);
          }}
        >
          View Details
        </Button>
        
        {role === 'librarian' && (
          <div className="flex space-x-1">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                navigate(`/edit-book/${book.id}`);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => e.stopPropagation()} // Prevent card click
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}> {/* Prevent card click */}
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Book</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{book.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleDelete();
                    }} 
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
