import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, MapPin, Phone, AtSign } from "lucide-react";
import { useAuth, RegisterData } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationMap from "@/components/map/LocationMap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const RegisterModal = ({
  isOpen,
  onClose,
  onLoginClick,
}: RegisterModalProps) => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat?: number;
    lng?: number;
    address?: string;
  }>({});
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("telegram");

  const form = useForm<{
    name: string;
    phone: string;
    password: string;
    address: string;
    social_media_type: string;
    social_media_username: string;
    can_rent_books: boolean;
    latitude?: number;
    longitude?: number;
  }>({
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      address: "",
      social_media_type: "telegram",
      social_media_username: "",
      can_rent_books: false,
    },
  });

  const handleSwitchToLogin = () => {
    onClose();
    onLoginClick();
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, "");

    // Make sure phone starts with correct prefix
    if (!cleaned.startsWith("998")) {
      cleaned = "998" + cleaned;
    }

    // Ensure it's not longer than 12 digits (998 + 9 digits)
    cleaned = cleaned.slice(0, 12);

    return cleaned;
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    form.setValue("address", address);
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
    setIsMapOpen(false);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Format phone number to match API requirements
      const formattedPhone = formatPhoneNumber(data.phone);

      // Format social media handle based on selected platform
      const socialMediaHandle = `${data.social_media_type}:${data.social_media_username}`;

      const registerData: RegisterData = {
        user: {
          name: data.name,
          phone: formattedPhone,
          password: data.password,
        },
        library: {
          address: data.address,
          social_media: socialMediaHandle,
          can_rent_books: data.can_rent_books,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      };

      const success = await register(registerData);
      if (success) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const socialMediaOptions = [
    { value: "telegram", label: "Telegram" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "website", label: "Website" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("auth.register.title")}</DialogTitle>
            <DialogDescription>
              {t("auth.register.haveAccount")}{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={handleSwitchToLogin}
              >
                {t("auth.register.login")}
              </Button>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="user" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">
                    {t("auth.register.userInfo")}
                  </TabsTrigger>
                  <TabsTrigger value="library">
                    {t("auth.register.libraryInfo")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.register.name")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.register.phone")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="998901234567"
                              className="pl-10"
                              {...field}
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.register.password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="library" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.register.address")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <div className="flex gap-2">
                              <Input
                                placeholder={t(
                                  "auth.register.addressPlaceholder"
                                )}
                                className="pl-10"
                                {...field}
                                disabled={isLoading}
                                value={selectedLocation.address || field.value}
                                readOnly
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsMapOpen(true)}
                                disabled={isLoading}
                              >
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hidden latitude and longitude fields */}
                  <input
                    type="hidden"
                    {...form.register("latitude")}
                    value={selectedLocation.lat}
                  />
                  <input
                    type="hidden"
                    {...form.register("longitude")}
                    value={selectedLocation.lng}
                  />

                  <div className="space-y-2">
                    <Label>{t("auth.register.socialMedia")}</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedSocialMedia}
                        onValueChange={setSelectedSocialMedia}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {socialMediaOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormField
                        control={form.control}
                        name="social_media_username"
                        render={({ field }) => (
                          <div className="flex-1 relative">
                            <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={
                                selectedSocialMedia === "website"
                                  ? "yourlibrary.com"
                                  : "username"
                              }
                              className="pl-10"
                              {...field}
                              disabled={isLoading}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="can_rent_books"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t("auth.register.canRentBooks")}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("auth.register.submit")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <LocationMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        defaultLocation={
          selectedLocation.lat && selectedLocation.lng
            ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
            : undefined
        }
      />
    </>
  );
};

export default RegisterModal;
