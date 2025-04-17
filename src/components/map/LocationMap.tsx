
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlicmFyeWFwcCIsImEiOiJjbHZtaWRjMDQwazJ2MnZuemt5MDNyNGNyIn0.JdLagzLPB-xwLnm_9WQ60Q';

interface LocationMapProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (latitude: number, longitude: number) => void;
  defaultLatitude?: number;
  defaultLongitude?: number;
}

const LocationMap = ({
  isOpen,
  onClose,
  onConfirm,
  defaultLatitude,
  defaultLongitude,
}: LocationMapProps) => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [coords, setCoords] = useState({
    lat: defaultLatitude || 41.2995,
    lng: defaultLongitude || 69.2401,
  });

  mapboxgl.accessToken = MAPBOX_TOKEN;

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coords.lng, coords.lat],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (defaultLatitude && defaultLongitude) {
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([defaultLongitude, defaultLatitude])
        .addTo(map.current);

      marker.current.on('dragend', () => {
        const position = marker.current?.getLngLat();
        if (position) {
          setCoords({ lat: position.lat, lng: position.lng });
        }
      });
    }

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.remove();
      }

      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      setCoords({ lat, lng });

      marker.current.on('dragend', () => {
        const position = marker.current?.getLngLat();
        if (position) {
          setCoords({ lat: position.lat, lng: position.lng });
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [isOpen, defaultLatitude, defaultLongitude]);

  const handleConfirm = () => {
    onConfirm(coords.lat, coords.lng);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('map.title')}</DialogTitle>
          <DialogDescription>{t('map.subtitle')}</DialogDescription>
        </DialogHeader>
        
        <div ref={mapContainer} className="w-full h-[400px] rounded-md overflow-hidden" />
        
        <div className="grid grid-cols-2 gap-4 py-2">
          <div>
            <p className="text-sm font-medium mb-1">{t('map.latitude')}</p>
            <p className="text-sm">{coords.lat.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">{t('map.longitude')}</p>
            <p className="text-sm">{coords.lng.toFixed(6)}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('map.cancel')}
          </Button>
          <Button onClick={handleConfirm}>
            {t('map.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMap;
