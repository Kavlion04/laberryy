import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultLocation?: { lat: number; lng: number };
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const LocationMap = ({
  isOpen,
  onClose,
  onLocationSelect,
  defaultLocation,
}: LocationMapProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const defaultCenter = defaultLocation || { lat: 41.2995, lng: 69.2401 }; // Tashkent coordinates

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      // Initialize map
      const mapInstance = new window.google.maps.Map(mapRef.current!, {
        center: defaultCenter,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Initialize marker
      const markerInstance = new window.google.maps.Marker({
        position: defaultCenter,
        map: mapInstance,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      // Initialize search box
      if (searchBoxRef.current) {
        const searchBox = new window.google.maps.places.SearchBox(
          searchBoxRef.current
        );

        // Bias the SearchBox results towards current map's viewport
        mapInstance.addListener("bounds_changed", () => {
          searchBox.setBounds(
            mapInstance.getBounds() as google.maps.LatLngBounds
          );
        });

        // Listen for search box events
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();
          if (!places || places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          // Update map and marker
          mapInstance.setCenter(place.geometry.location);
          markerInstance.setPosition(place.geometry.location);
          updateSelectedLocation(
            place.geometry.location.lat(),
            place.geometry.location.lng(),
            place.formatted_address || ""
          );
        });
      }

      // Listen for map clicks
      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        markerInstance.setPosition(e.latLng);
        updateSelectedLocation(e.latLng.lat(), e.latLng.lng());
      });

      // Listen for marker drag events
      markerInstance.addListener("dragend", () => {
        const position = markerInstance.getPosition();
        if (!position) return;
        updateSelectedLocation(position.lat(), position.lng());
      });

      setMap(mapInstance);
      setMarker(markerInstance);

      // If there's a default location, update the selected location
      if (defaultLocation) {
        updateSelectedLocation(defaultLocation.lat, defaultLocation.lng);
      }
    };

    loadGoogleMaps();

    return () => {
      if (map) {
        map.unbindAll();
      }
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [isOpen, defaultLocation]);

  const updateSelectedLocation = async (
    lat: number,
    lng: number,
    address?: string
  ) => {
    if (!address) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({
          location: { lat, lng },
        });
        if (response.results[0]) {
          address = response.results[0].formatted_address;
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
        address = `${lat}, ${lng}`;
      }
    }
    setSelectedLocation({ lat, lng, address: address || `${lat}, ${lng}` });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(
        selectedLocation.lat,
        selectedLocation.lng,
        selectedLocation.address
      );
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{t("map.title")}</DialogTitle>
        </DialogHeader>
        <div className="relative h-full p-4">
          <Input
            ref={searchBoxRef}
            type="text"
            placeholder={t("map.searchPlaceholder")}
            className="w-full mb-4"
          />
          <div ref={mapRef} className="w-full h-[400px] rounded-md" />
          {selectedLocation && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{t("map.selectedLocation")}</span>
              </div>
              <p className="text-sm mb-2">{selectedLocation.address}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("map.latitude")}: </span>
                  {selectedLocation.lat.toFixed(6)}
                </div>
                <div>
                  <span className="font-medium">{t("map.longitude")}: </span>
                  {selectedLocation.lng.toFixed(6)}
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="p-4">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedLocation}>
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMap;
