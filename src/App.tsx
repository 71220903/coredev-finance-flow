import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Marketplace from "@/pages/Marketplace";
import Dashboard from "@/pages/Dashboard";
import DeveloperProfilePage from "@/pages/DeveloperProfilePage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import NotFound from "@/pages/NotFound";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <QueryClient>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/developer/:developerId" element={<DeveloperProfilePage />} />
          <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
