import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import LocationMap from "@/components/map/LocationMap";

const customerSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgi bo'lishi kerak"),
  email: z.string().email("Noto'g'ri email format"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak"),
});

const librarySchema = z.object({
  name: z.string().min(2, "Kutubxona nomi kamida 2 ta belgi bo'lishi kerak"),
  email: z.string().email("Noto'g'ri email format"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak"),
  address: z.string().min(5, "Manzil kamida 5 ta belgi bo'lishi kerak"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const RegisterModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");
  const [isMapOpen, setIsMapOpen] = useState(false);

  const customerForm = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const libraryForm = useForm({
    resolver: zodResolver(librarySchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // API call to register
      console.log("Form data:", data);
      toast({
        title: t("auth.registerSuccess"),
        description: t("auth.registerSuccessDesc"),
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("auth.registerError"),
        variant: "destructive",
      });
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    libraryForm.setValue("latitude", lat);
    libraryForm.setValue("longitude", lng);
    libraryForm.setValue("address", address);
    setIsMapOpen(false);
  };

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("auth.register")}</DialogTitle>
            <DialogDescription>
              {t("auth.registerDescription")}
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">{t("auth.customer")}</TabsTrigger>
              <TabsTrigger value="library">{t("auth.library")}</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <Form {...customerForm}>
                <form
                  onSubmit={customerForm.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={customerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.phone")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{t("auth.register")}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="library">
              <Form {...libraryForm}>
                <form
                  onSubmit={libraryForm.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={libraryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.libraryName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={libraryForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={libraryForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={libraryForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.phone")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={libraryForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.address")}</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsMapOpen(true)}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={libraryForm.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.latitude")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={libraryForm.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.longitude")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{t("auth.register")}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <LocationMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
};

export default RegisterModal;
