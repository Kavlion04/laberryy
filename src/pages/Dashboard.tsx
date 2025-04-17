
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBooks } from '@/services/api';
import { Book } from '@/types';
import { useRole } from '@/context/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookCard from '@/components/books/BookCard';
import { BookOpen, Library, PlusCircle, Users } from 'lucide-react';

const Dashboard = () => {
  const { role } = useRole();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const recentBooks = [...books].sort((a, b) => 
    new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
  ).slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back to BookMaster {role === 'librarian' ? 'Admin' : ''} Panel
          </p>
        </div>
        
        {role === 'librarian' && (
          <Button asChild>
            <Link to="/add-book">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Book
            </Link>
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Books in collection
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {books.filter(book => book.copies_available > 0).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Books available for borrowing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {books.reduce((total, book) => total + book.total_copies, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total book copies in inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {role === 'librarian' ? 'Registered Users' : 'Borrowed Books'}
            </CardTitle>
            {role === 'librarian' ? (
              <Users className="h-4 w-4 text-muted-foreground" />
            ) : (
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {role === 'librarian' ? 42 : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {role === 'librarian' ? 'Active users in system' : 'Books currently borrowed'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Books</TabsTrigger>
          <TabsTrigger value="popular">Popular Books</TabsTrigger>
          {role === 'customer' && (
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="recent" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-[400px] animate-pulse">
                  <div className="bg-muted h-2/3"></div>
                  <CardContent className="h-1/3">
                    <div className="w-3/4 h-4 bg-muted rounded mt-4"></div>
                    <div className="w-1/2 h-3 bg-muted rounded mt-3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recentBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link to="/books">View All Books</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {books
              .slice()
              .sort((a, b) => (b.total_copies - b.copies_available) - (a.total_copies - a.copies_available))
              .slice(0, 4)
              .map(book => (
                <BookCard key={book.id} book={book} />
              ))
            }
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link to="/books">View All Books</Link>
            </Button>
          </div>
        </TabsContent>
        
        {role === 'customer' && (
          <TabsContent value="recommended" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {books
                .slice()
                .sort(() => 0.5 - Math.random())
                .slice(0, 4)
                .map(book => (
                  <BookCard key={book.id} book={book} />
                ))
              }
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link to="/books">View All Books</Link>
              </Button>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
