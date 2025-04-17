import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone } from "lucide-react";

const LibrariesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock data for libraries
  const libraries = [
    {
      id: 1,
      name: "Markaziy kutubxona",
      address: "Toshkent sh., Chilonzor tumani, 1-mavze",
      phone: "+998901234567",
      totalBooks: 5000,
      canRentBooks: true,
    },
    {
      id: 2,
      name: "Alisher Navoiy nomidagi kutubxona",
      address: "Toshkent sh., Yunusobod tumani, 19-mavze",
      phone: "+998901234568",
      totalBooks: 8000,
      canRentBooks: true,
    },
    {
      id: 3,
      name: "Yoshlar kutubxonasi",
      address: "Toshkent sh., Mirzo Ulug'bek tumani, 5-mavze",
      phone: "+998901234569",
      totalBooks: 3000,
      canRentBooks: false,
    },
    // Add more mock data as needed
  ];

  const totalPages = Math.ceil(libraries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLibraries = libraries.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kutubxonalar ro'yxati</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Kutubxona qidirish..." className="pl-9" />
          </div>
          <Button>Xaritada ko'rish</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentLibraries.map((library) => (
          <Card key={library.id}>
            <CardHeader>
              <CardTitle>{library.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                  <p className="text-sm">{library.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{library.phone}</p>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-4">
                  <span>Jami kitoblar: {library.totalBooks}</span>
                  <span>
                    {library.canRentBooks ? "Ijaraga beradi" : "Faqat o'qish"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevPage}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={handleNextPage}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default LibrariesPage;
