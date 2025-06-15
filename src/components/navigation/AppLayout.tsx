
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import NavigationHeader from "./NavigationHeader";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import NavigationSidebar from "./NavigationSidebar";
import EnhancedMobileNavigation from "./EnhancedMobileNavigation";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { toggleSidebar } = useSidebar();

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
