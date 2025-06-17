
import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import NavigationHeader from "./NavigationHeader";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import NavigationSidebar from "./NavigationSidebar";
import EnhancedMobileNavigation from "./EnhancedMobileNavigation";
import { BrowseModeIndicator } from "@/components/BrowseModeIndicator";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  showSidebar?: boolean;
  pageTitle?: string;
  pageDescription?: string;
}

const AppLayoutContent = ({ 
  children, 
  breadcrumbItems, 
  showSidebar = true,
  pageTitle,
  pageDescription 
}: AppLayoutProps) => {
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure we're on the client side to prevent SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Safety check for sidebar context
  let toggleSidebar;
  try {
    const sidebarContext = useSidebar();
    toggleSidebar = sidebarContext?.toggleSidebar;
  } catch (error) {
    console.warn('Sidebar context not available:', error);
    toggleSidebar = () => {};
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex w-full bg-slate-50">
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-slate-200"></div>
          <main className="flex-1 p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Desktop Sidebar - Only visible on lg+ screens */}
      {showSidebar && (
        <div className="hidden lg:block">
          <NavigationSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Header - Responsive design */}
        <NavigationHeader 
          onMenuToggle={toggleSidebar}
          showMenuButton={showSidebar}
        />

        {/* Browse Mode Indicator */}
        <BrowseModeIndicator />

        {/* Breadcrumb - Only show on desktop when sidebar is present */}
        {breadcrumbItems && (
          <div className="hidden lg:block">
            <NavigationBreadcrumb items={breadcrumbItems} />
          </div>
        )}

        {/* Page Header */}
        {(pageTitle || pageDescription) && (
          <div className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {pageTitle && (
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {pageTitle}
                </h1>
              )}
              {pageDescription && (
                <p className="text-slate-600">{pageDescription}</p>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area - Different bottom padding for mobile/desktop */}
        <main className="flex-1 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Only visible on mobile screens */}
      <div className="lg:hidden">
        <EnhancedMobileNavigation />
      </div>
    </div>
  );
};

const AppLayout = (props: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppLayoutContent {...props} />
    </SidebarProvider>
  );
};

export default AppLayout;
