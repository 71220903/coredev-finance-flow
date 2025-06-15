
import Index from "@/pages/Index";
import Marketplace from "@/pages/Marketplace";
import Dashboard from "@/pages/Dashboard";
import DeveloperProfilePage from "@/pages/DeveloperProfilePage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import NotFound from "@/pages/NotFound";
import AdminPage from "@/pages/AdminPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AchievementsPage from "@/pages/AchievementsPage";
import BookmarksPage from "@/pages/BookmarksPage";
import HistoryPage from "@/pages/HistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserRoleProvider } from "@/contexts/UserRoleContext";

// Create a client instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserRoleProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/developer/:developerId" element={<DeveloperProfilePage />} />
            <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserRoleProvider>
    </QueryClientProvider>
  );
}

export default App;
