import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationMapProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultLocation?: { lat: number; lng: number };
}

declare global {
  interface Window {
    google: typeof google;
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
  const initializedRef = useRef(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const defaultCenter = defaultLocation || { lat: 41.2995, lng: 69.2401 };

  useEffect(() => {
    if (!isOpen || !mapRef.current || initializedRef.current) return;

    const loadGoogleMapsAPI = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          initializeMap();
        };

        script.onerror = () => {
          console.error("Google Maps API load failed");
        };

        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
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

      const markerInstance = new window.google.maps.Marker({
        map: mapInstance,
        draggable: true,
        position: defaultCenter,
      });

      const geocoder = new window.google.maps.Geocoder();

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng;
        if (!latLng) return;

        markerInstance.setPosition(latLng);
        geocoder.geocode(
          { location: { lat: latLng.lat(), lng: latLng.lng() } },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              setSelectedLocation({
                lat: latLng.lat(),
                lng: latLng.lng(),
                address: results[0].formatted_address,
              });
            }
          }
        );
      });

      markerInstance.addListener("dragend", () => {
        const position = markerInstance.getPosition();
        if (!position) return;

        geocoder.geocode(
          { location: { lat: position.lat(), lng: position.lng() } },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              setSelectedLocation({
                lat: position.lat(),
                lng: position.lng(),
                address: results[0].formatted_address,
              });
            }
          }
        );
      });

      // Wait until input is mounted
      setTimeout(() => {
        const input = document.getElementById("pac-input") as HTMLInputElement;
        if (input) {
          const searchBox = new window.google.maps.places.SearchBox(input);

          mapInstance.addListener("bounds_changed", () => {
            const bounds = mapInstance.getBounds();
            if (bounds) searchBox.setBounds(bounds);
          });

          searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            if (!places || places.length === 0) return;

            const place = places[0];
            if (!place.geometry || !place.geometry.location) return;

            mapInstance.setCenter(place.geometry.location);
            markerInstance.setPosition(place.geometry.location);

            setSelectedLocation({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address || "",
            });
          });
        }
      }, 500);

      setMap(mapInstance);
      setMarker(markerInstance);
      initializedRef.current = true;
    };

    loadGoogleMapsAPI();
  }, [isOpen]);

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
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t("map.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              id="pac-input"
              type="text"
              placeholder={t("map.searchPlaceholder")}
              className="w-full pl-3 pr-10 py-2"
            />
          </div>

          {/* MAP DIV - Height fixed to 400px */}
          <div
            ref={mapRef}
            className="w-full rounded-lg"
            style={{ height: "400px" }}
          />

          {selectedLocation && (
            <div className="space-y-4">
              <div>
                <Label>{t("map.selectedLocation")}</Label>
                <Input value={selectedLocation.address} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("map.latitude")}</Label>
                  <Input value={selectedLocation.lat.toFixed(6)} readOnly />
                </div>
                <div>
                  <Label>{t("map.longitude")}</Label>
                  <Input value={selectedLocation.lng.toFixed(6)} readOnly />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedLocation}>
              {t("common.confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMap;
