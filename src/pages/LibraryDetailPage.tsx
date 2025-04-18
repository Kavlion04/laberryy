// Kod boshida o'zgartirishlar yo'q
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Map,
  ChevronLeft,
  ChevronRight,
  Phone,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface Book {
  id: number;
  library: number;
  name: string;
  author: string;
  publisher: string;
  quantity_in_library: number;
}

interface SocialMedia {
  telegram: string | null;
}

interface Library {
  id: number;
  user: number;
  name: string;
  image: string | null;
  address: string;
  social_media: SocialMedia;
  can_rent_books: boolean;
  google_maps_url: string | null;
  phone: string | null;
  is_active: boolean;
  books: Book[];
}

const api = axios.create({
  baseURL: "https://s-libraries.uz/api/v1",
  timeout: 5000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const BOOKS_PER_SLIDE = 3;
const DEFAULT_LIBRARY_IMAGE = "/src/assets/photo_2025-04-11_15-14-49 (2).jpg";

const LibraryDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [library, setLibrary] = useState<Library | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ KITOBLARNI FETCH QILISH QISMI
  const fetchLibraryDetails = async () => {
    try {
      const response = await api.get<Library>(`/libraries/library/${id}/`);

      console.log("Library data:", response.data); // 👈 Test uchun
      if (response.data) {
        setLibrary(response.data);
      } else {
        toast({
          title: t("common.error"),
          description: t("library.notFound"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching library details:", error);
      toast({
        title: t("common.error"),
        description: t("library.fetchError"),
        variant: "destructive",
      });
    }
  };
  
  

  useEffect(() => {
    fetchLibraryDetails();
  }, [id]);

  const totalSlides = Math.ceil(
    (library?.books?.length || 0) / BOOKS_PER_SLIDE
  );

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentBooks =
    library?.books?.slice(
      currentSlide * BOOKS_PER_SLIDE,
      (currentSlide + 1) * BOOKS_PER_SLIDE
    ) || [];

  if (!library) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleMapClick = () => {
    if (library.google_maps_url) {
      window.open(library.google_maps_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
      </div>
      {/* LIBRARY INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("library.details")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t("library.name")}</h3>
                <p>{library.name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t("library.address")}</h3>
                <div className="flex items-center gap-2">
                  <p>{library.address}</p>
                  {library.google_maps_url && (
                    <button
                      onClick={handleMapClick}
                      className="text-blue-600 hover:text-blue-800"
                      title={t("library.viewOnMap")}
                    >
                      <Map className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t("library.status")}</h3>
                <p>
                  {library.is_active
                    ? t("library.active")
                    : t("library.inactive")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {t("library.canRentBooks")}
                </h3>
                <p>
                  {library.can_rent_books
                    ? t("library.canRentBooks")
                    : t("library.cantRentBooks")}
                </p>
              </div>
              {library.phone && (
                <div>
                  <h3 className="font-semibold mb-2">{t("library.phone")}</h3>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                    onClick={() => window.open(`tel:${library.phone}`)}
                  >
                    <Phone className="h-4 w-4 mr-2 inline" />
                    {library.phone}
                  </Button>
                </div>
              )}
              {library.social_media?.telegram && (
                <div>
                  <h3 className="font-semibold mb-2">
                    {t("library.telegram")}
                  </h3>
                  <a
                    href={library.social_media.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                  >
                    {library.social_media.telegram}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* IMAGE */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="p-4">
              <img
                src={library.image || DEFAULT_LIBRARY_IMAGE}
                alt={library.name}
                className="w-full h-[370px] object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_LIBRARY_IMAGE;
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {library.books?.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("library.books")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentBooks.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{book.name}</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">
                            {t("book.author")}:
                          </span>{" "}
                          {book.author}
                        </p>
                        <p>
                          <span className="font-medium">
                            {t("book.publisher")}:
                          </span>{" "}
                          {book.publisher}
                        </p>
                        <p>
                          <span className="font-medium">
                            {t("book.quantity")}:
                          </span>{" "}
                          {book.quantity_in_library}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalSlides > 1 && (
                <div className="flex justify-center mt-4 space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevSlide}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    {[...Array(totalSlides)].map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          currentSlide === index ? "bg-primary" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextSlide}
                    disabled={currentSlide === totalSlides - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {t("library.noBooks")}
          </CardContent>
        </Card>
      )}
      
      
      
    </div>
  );
};

export default LibraryDetailPage;
