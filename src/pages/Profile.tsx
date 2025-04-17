
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { User, Pencil, Save, X, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import LocationMap from '@/components/map/LocationMap';
import LoadingScreen from '@/components/ui/loading-screen';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      social_media: user?.social_media || '',
      latitude: user?.latitude,
      longitude: user?.longitude,
    }
  });

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  const onSubmit = async (data: any) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setValue('name', user.name);
    setValue('phone', user.phone);
    setValue('address', user.address);
    setValue('social_media', user.social_media || '');
    setValue('latitude', user.latitude);
    setValue('longitude', user.longitude);
    setIsEditing(false);
  };

  const handleMapSelect = (lat: number, lng: number) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('profile.subtitle')}
          </p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            {t('profile.editProfile')}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              {t('profile.cancel')}
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              <Save className="h-4 w-4 mr-2" />
              {t('profile.saveChanges')}
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.name')}</Label>
              {isEditing ? (
                <Input
                  id="name"
                  {...register('name', { required: true })}
                  className={errors.name ? 'border-destructive' : ''}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{user.name}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  {...register('phone', { required: true })}
                  className={errors.phone ? 'border-destructive' : ''}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{user.phone}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">{t('profile.address')}</Label>
              {isEditing ? (
                <Input
                  id="address"
                  {...register('address', { required: true })}
                  className={errors.address ? 'border-destructive' : ''}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{user.address}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social_media">{t('profile.socialMedia')}</Label>
              {isEditing ? (
                <Input
                  id="social_media"
                  {...register('social_media')}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{user.social_media || '—'}</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {t('profile.mapLocation')}
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsMapOpen(true)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('auth.register.selectOnMap')}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.latitude && user.longitude ? (
              <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
                <img 
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+8884ff(${longitude || user.longitude},${latitude || user.latitude})/${longitude || user.longitude},${latitude || user.latitude},14,0/600x400?access_token=pk.eyJ1IjoibGlicmFyeWFwcCIsImEiOiJjbHZtaWRjMDQwazJ2MnZuemt5MDNyNGNyIn0.JdLagzLPB-xwLnm_9WQ60Q`} 
                  alt="Library location" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded text-xs">
                  {t('map.latitude')}: {latitude || user.latitude?.toFixed(6)}, {t('map.longitude')}: {longitude || user.longitude?.toFixed(6)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center aspect-video bg-muted rounded-md p-4 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No location data available</p>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsMapOpen(true)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {t('auth.register.selectOnMap')}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* <LocationMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        // onConfirm={handleMapSelect}
        defaultLatitude={user.latitude}
        defaultLongitude={user.longitude}
      /> */}
    </div>
  );
};

export default Profile;
