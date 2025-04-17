import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Search,
  User,
  LogOut,
  Settings,
  Map,
  LogIn,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import LocationMap from "@/components/map/LocationMap";

const Navbar = () => {
  const { t } = useTranslation();
  const { role, toggleRole } = useRole();
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleMapLocationSelect = (
    lat: number,
    lng: number,
    address: string
  ) => {
    console.log("Selected location:", { lat, lng, address });
    setIsMapModalOpen(false);
  };

  return (
    <>
      <nav className="border-b border-border bg-background px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />

            <Link to="/" className="flex items-center gap-2 text-primary">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-semibold hidden sm:inline-block">
                Library
              </span>
            </Link>
          </div>

          <div
            className={`absolute left-0 top-0 w-full p-3 bg-background md:relative md:block md:w-auto md:p-0 md:mx-4 md:flex-1 ${
              isSearchVisible ? "block" : "hidden"
            }`}
          >
            <div className="relative max-w-md mx-auto md:mx-0 md:max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("navbar.search")}
                className="w-full pl-9 pr-4 py-2"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 md:hidden"
                onClick={() => setIsSearchVisible(false)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {!isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <LogIn className="h-4 w-4 mr-1" />
                    {t("navbar.login")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setIsLoginModalOpen(true)}>
                    {t("navbar.login")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    {t("navbar.register")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user?.name || "My Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleRole} className="sm:hidden">
                    Switch to {role === "customer" ? "Librarian" : "Customer"}{" "}
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" /> {t("navbar.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />{" "}
                      {t("navbar.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> {t("navbar.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <LocationMap
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onLocationSelect={handleMapLocationSelect}
      />
    </>
  );
};

export default Navbar;
