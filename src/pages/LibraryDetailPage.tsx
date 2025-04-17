import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import LocationMap from "@/components/map/LocationMap";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination-root";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  status: "available" | "borrowed";
}

interface Library {
  id: number;
  name: string;
  address: string;
  description: string;
  phone: string;
  latitude: number;
  longitude: number;
}

interface LibraryBooksResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

const LibraryDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [library, setLibrary] = useState<Library | null>(null);
  const [booksData, setBooksData] = useState<LibraryBooksResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibraryDetails = async () => {
    try {
      const response = await axios.get(`/api/libraries/${id}`);
      setLibrary(response.data);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("library.fetchError"),
        variant: "destructive",
      });
    }
  };

  const fetchLibraryBooks = async (page: number) => {
    try {
      const response = await axios.get(`/api/libraries/${id}/books`, {
        params: {
          page,
          limit: 10,
        },
      });
      setBooksData(response.data);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("library.booksError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    setIsMapOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchLibraryDetails();
  }, [id]);

  useEffect(() => {
    if (library) {
      fetchLibraryBooks(currentPage);
    }
  }, [currentPage, library]);

  if (isLoading || !library || !booksData) {
    return <div className="p-4">{t("common.loading")}...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{library.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMapOpen(true)}
            >
              <Map className="h-4 w-4 mr-2" />
              {t("library.viewOnMap")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{t("library.description")}</h3>
            <p>{library.description}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("library.contact")}</h3>
            <p>{library.address}</p>
            <p>{library.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("library.books")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{t("book.title")}</th>
                  <th className="text-left py-2">{t("book.author")}</th>
                  <th className="text-left py-2">{t("book.isbn")}</th>
                  <th className="text-left py-2">{t("book.status")}</th>
                </tr>
              </thead>
              <tbody>
                {booksData.books.map((book) => (
                  <tr key={book.id} className="border-b">
                    <td className="py-2">{book.title}</td>
                    <td className="py-2">{book.author}</td>
                    <td className="py-2">{book.isbn}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          book.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t(`book.status_${book.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center">
            <PaginationRoot>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: booksData.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
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
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(booksData.totalPages, p + 1)
                      )
                    }
                    className={
                      currentPage === booksData.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </PaginationRoot>
          </div>
        </CardContent>
      </Card>

      <LocationMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        defaultLocation={
          library?.latitude && library?.longitude
            ? { lat: library.latitude, lng: library.longitude }
            : undefined
        }
      />
    </div>
  );
};

export default LibraryDetailPage;
