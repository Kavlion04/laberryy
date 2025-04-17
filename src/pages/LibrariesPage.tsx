import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, MapPin, Book } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Library {
  id: number;
  name: string;
  address: string;
  image: string | null;
  total_books: number;
  is_active: boolean;
}

interface ApiResponse {
  count: number;
  results: Library[];
}

const ITEMS_PER_PAGE = 6;

const api = axios.create({
  baseURL: "https://s-libraries.uz/",
  timeout: 5000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const LibrariesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchLibraries = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse>(
        `/api/v1/libraries/libraries/?page=${page}&page_size=${ITEMS_PER_PAGE}`
      );

      if (response.data) {
        const libraries = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        const total = Array.isArray(response.data)
          ? response.data.length
          : response.data.count || 0;

        setLibraries(libraries);
        setTotalItems(total);
      } else {
        console.error("Unexpected API response format:", response.data);
        setLibraries([]);
        toast({
          title: t("common.error"),
          description: t("library.fetchError"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching libraries:", error);
      let errorMessage = t("library.fetchError");

      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Server bilan bog'lanishda xatolik yuz berdi. Iltimos, internet aloqangizni tekshiring.";
      }

      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      });
      setLibraries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries(currentPage);
  }, [currentPage]);

  const handleLibraryClick = (id: number) => {
    navigate(`/libraries/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedLibraries = libraries.filter((library) =>
    library.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;

            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            if (pageNumber === 2 || pageNumber === totalPages - 1) {
              return (
                <PaginationItem key={pageNumber}>
                  <span className="px-4">...</span>
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("library.libraries")}</CardTitle>
          <CardDescription>{t("library.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("kutubxonalarni qidirish")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentPage !== 1) {
                  setCurrentPage(1);
                }
              }}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayedLibraries.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedLibraries.map((library) => (
                  <Card
                    key={library.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleLibraryClick(library.id)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {library.name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="line-clamp-1">
                            {library.address}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Book className="h-4 w-4 mr-2" />
                          <span>
                            {t("library.totalBooks", {
                              count: library.total_books,
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("library.noLibrariesFound")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LibrariesPage;
