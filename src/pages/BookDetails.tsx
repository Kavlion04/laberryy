
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBookById, deleteBook } from '@/services/api';
import { Book } from '@/types';
import { useRole } from '@/context/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import {
  BookOpen,
  Calendar,
  Edit,
  Hash,
  Library,
  Trash2,
  User,
  ArrowLeft
} from 'lucide-react';
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

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { role } = useRole();
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
        toast.error('Failed to load book details');
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleDelete = async () => {
    if (!book) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteBook(book.id);
      if (success) {
        toast.success(`"${book.name}" has been deleted`);
        navigate('/books');
      } else {
        toast.error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('An error occurred while deleting the book');
    } finally {
      setIsDeleting(false);
    }
  };

  const getAvailabilityColor = () => {
    if (!book) return "secondary";
    
    const ratio = book.quantity_in_library / book.quantity_in_library;
    if (ratio === 0) return "destructive";
    if (ratio < 0.3) return "secondary";
    return "primary";
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-3/4 bg-muted rounded"></div>
        <div className="h-6 w-1/2 bg-muted rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-muted rounded"></div>
          <div className="md:col-span-2 space-y-4">
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
        <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/books">Return to Book Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{book.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="order-2 md:order-1 flex flex-col gap-6">
          <Card className="book-card overflow-hidden">
            <div className="aspect-[2/3] relative">
              {book.publisher ? (
                <img
                  src={book.publisher}
                  alt={book.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <BookOpen className="w-16 h-16 text-muted-foreground/50" />
                </div>
              )}
              <Badge className="absolute bottom-4 right-4" variant={getAvailabilityColor() as any}>
                {book.quantity_in_library} of {book.quantity_in_library} available
              </Badge>
            </div>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Author:</span>
                  <span className="font-medium">{book.author}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">name:</span>
                  <span className="font-medium">{book.name}</span>
                </div>
                
               
                
                <div className="flex items-center gap-2">
                  <Library className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">soni:</span>
                  <Badge variant="outline">{book.quantity_in_library}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="order-1 md:order-2 md:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">About this book</h2>
                
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Availability</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{book.quantity_in_library}</div>
                    <div className="text-sm text-muted-foreground">Available Copies</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{book.quantity_in_library}</div>
                    <div className="text-sm text-muted-foreground">Total Copies</div>
                  </div>
                </div>
              </div>
              
              {role === 'customer' && (
                <>
                  <Separator />
                  <div className="flex justify-center">
                    <Button
                      disabled={book.quantity_in_library === 0}
                      className="w-full md:w-auto"
                    >
                      {book.quantity_in_library > 0 ? 'Borrow this Book' : 'Currently Unavailable'}
                    </Button>
                  </div>
                </>
              )}
              
              {role === 'librarian' && (
                <>
                  <Separator />
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                      <Link to={`/edit-book/${book.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Book
                      </Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Book
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Book</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{book.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDelete} 
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
