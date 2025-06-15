
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavigationBreadcrumbProps {
  items?: BreadcrumbItem[];
  maxItems?: number;
}

const NavigationBreadcrumb = ({ items, maxItems = 4 }: NavigationBreadcrumbProps) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from route if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
    
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Custom labels for known routes
      const routeLabels: Record<string, string> = {
        marketplace: "Marketplace",
        dashboard: "Dashboard",
        admin: "Admin Panel",
        analytics: "Analytics",
        developer: "Developer Profile",
        project: "Project Details"
      };
      
      if (routeLabels[segment]) {
        label = routeLabels[segment];
      }
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();
  
  // Handle overflow with ellipsis
  const displayItems = breadcrumbItems.length > maxItems 
    ? [
        breadcrumbItems[0],
        { label: "...", href: undefined },
        ...breadcrumbItems.slice(-2)
      ]
    : breadcrumbItems;

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            {displayItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {item.label === "..." ? (
                    <BreadcrumbEllipsis />
                  ) : item.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.href} className="flex items-center">
                        {index === 0 && <Home className="h-4 w-4 mr-1" />}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < displayItems.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default NavigationBreadcrumb;
