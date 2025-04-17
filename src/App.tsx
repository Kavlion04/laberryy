
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BookCatalog from "./pages/BookCatalog";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import MyBooks from "./pages/MyBooks";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Import i18n config
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainLayout><Index /></MainLayout>} />
                <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/books" element={<MainLayout><BookCatalog /></MainLayout>} />
                <Route path="/books/:id" element={<MainLayout><BookDetails /></MainLayout>} />
                <Route path="/add-book" element={<MainLayout><AddBook /></MainLayout>} />
                <Route path="/edit-book/:id" element={<MainLayout><EditBook /></MainLayout>} />
                <Route path="/my-books" element={<MainLayout><MyBooks /></MainLayout>} />
                <Route path="/users" element={<MainLayout><UserManagement /></MainLayout>} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <MainLayout><Profile /></MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
