import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, MapPin, Phone, Loader2 } from "lucide-react";
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
  description: string;
  phone: string;
  latitude: number;
  longitude: number;
  booksCount: number;
}

interface LibrariesResponse {
  libraries: Library[];
  total: number;
  page: number;
  totalPages: number;
}

const INITIAL_LIBRARIES_DATA: LibrariesResponse = {
  libraries: [],
  total: 0,
  page: 1,
  totalPages: 0,
};

const LibrariesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [librariesData, setLibrariesData] = useState<LibrariesResponse>(
    INITIAL_LIBRARIES_DATA
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibraries = async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/libraries/libraries/", {
        params: {
          page,
          limit: 9,
          search,
        },
      });

      const data = response.data;
      if (data && Array.isArray(data.libraries)) {
        setLibrariesData({
          libraries: data.libraries || [],
          total: data.total || 0,
          page: data.page || 1,
          totalPages: data.totalPages || 0,
        });
      } else {
        setLibrariesData(INITIAL_LIBRARIES_DATA);
      }
    } catch (error) {
      console.error("Error fetching libraries:", error);
      toast({
        title: t("common.error"),
        description: t("library.fetchError"),
        variant: "destructive",
      });
      setLibrariesData(INITIAL_LIBRARIES_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLibraries(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchQuery]);

  const handleLibraryClick = (libraryId: number) => {
    navigate(`/libraries/${libraryId}`);
  };

  const renderLibraryCards = () => {
    return librariesData.libraries.map((library) => (
      <Card
        key={library.id}
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => handleLibraryClick(library.id)}
      >
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{library.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {library.description}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="line-clamp-1">{library.address}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2" />
              <span>{library.phone}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {t("library.booksCount", { count: library.booksCount })}
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (
      !Array.isArray(librariesData?.libraries) ||
      librariesData.libraries.length === 0
    ) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {t("library.noLibrariesFound")}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderLibraryCards()}
      </div>
    );
  };

  const renderPagination = () => {
    if (
      isLoading ||
      !librariesData?.totalPages ||
      librariesData.totalPages <= 1
    ) {
      return null;
    }

    return (
      <div className="mt-6 flex justify-center">
        <Pagination>
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
              { length: librariesData.totalPages },
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
                    Math.min(librariesData.totalPages, p + 1)
                  )
                }
                className={
                  currentPage === librariesData.totalPages
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("library.libraries")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("library.searchPlaceholder")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {renderContent()}
          {renderPagination()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LibrariesPage;
