
import { useState } from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onBookDelete?: (id: number) => void;
}

const BookGrid = ({ books, onBookDelete }: BookGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  
  const safeBooks = Array.isArray(books) ? books : [];
  
  const genres = ['all', ...new Set(safeBooks.map(book => book.name || 'Noma\'lum'))];
  
  const filteredBooks = safeBooks.filter(book => {
    const title = (book.name || '').toString();
    const author = (book.author || '').toString();
    
    
    const matchesSearch = 
      searchTerm === '' || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesGenre = genreFilter === 'all' || author === genreFilter;
    
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && (book.quantity_in_library || 0) > 0) ||
      (availabilityFilter === 'unavailable' && (book.quantity_in_library || 0) === 0);
      
    return matchesSearch && matchesGenre && matchesAvailability;
  });
  
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch(sortBy) {
      case 'title':
        return (a.name || '').toString().localeCompare((b.name || '').toString());
      case 'author':
        return (a.author || '').toString().localeCompare((b.author || '').toString());
      case 'available':
        return (b.quantity_in_library || 0) - (a.quantity_in_library || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Kitob nomi yoki muallif bo'yicha qidirish..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-1" />
            
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Janr" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre === 'all' ? 'Barcha janrlar' : genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Mavjudligi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha kitoblar</SelectItem>
                <SelectItem value="available">Mavjud</SelectItem>
                <SelectItem value="unavailable">Mavjud emas</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Saralash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Nomi</SelectItem>
                <SelectItem value="author">Muallif</SelectItem>
                <SelectItem value="published_date">Eng yangi</SelectItem>
                <SelectItem value="available">Mavjudligi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {sortedBooks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Kitoblar topilmadi</h3>
          <p className="text-muted-foreground mt-1">Filtringizni yoki qidiruv so'rovingizni o'zgartirib ko'ring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedBooks.map(book => (
            <BookCard key={book.id} book={book} onDelete={onBookDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;
