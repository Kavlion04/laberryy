
import BookForm from '@/components/books/BookForm';

const AddBook = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
        <p className="text-muted-foreground mt-1">
          Add a new book to the library collection
        </p>
      </div>
      
      <BookForm mode="add" />
    </div>
  );
};

export default AddBook;
