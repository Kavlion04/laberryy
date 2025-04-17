
import { ReactNode } from 'react';
import Navbar from './Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useRole } from '@/context/RoleContext';
import { useTheme } from '@/context/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { role } = useRole();
  const { theme, textColor } = useTheme();
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${theme === 'dark' ? 'dark' : ''} data-text-color-${textColor}`}>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            <p>© 2025 Library Management System. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
