
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyBooks = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
        <p className="text-muted-foreground mt-1">
          Manage your borrowed books and reading history
        </p>
      </div>
      
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-medium mb-2">No Books Borrowed</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          You don't have any borrowed books at the moment. Browse our catalog to find your next great read!
        </p>
        <Button asChild>
          <Link to="/books">Browse Books</Link>
        </Button>
      </div>
    </div>
  );
};

export default MyBooks;
