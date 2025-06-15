
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Search, Filter, Star, ExternalLink, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/navigation/AppLayout";

const BookmarksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const breadcrumbItems = [
    { label: "Bookmarks" }
  ];

  const bookmarkedItems = [
    {
      id: 1,
      type: "project",
      title: "AI-Powered Trading Bot",
      description: "Advanced algorithmic trading system with machine learning capabilities",
      category: "DeFi",
      trustScore: 88,
      fundingGoal: 50000,
      currentFunding: 32000,
      bookmarkedAt: "2024-01-15",
      href: "/project/1"
    },
    {
      id: 2,
      type: "developer",
      title: "Alex Rodriguez",
      description: "Full-stack blockchain developer specializing in DeFi protocols",
      category: "Developer",
      trustScore: 92,
      githubContributions: 1247,
      bookmarkedAt: "2024-01-12",
      href: "/developer/alex-rodriguez"
    },
    {
      id: 3,
      type: "project",
      title: "NFT Marketplace Platform",
      description: "Decentralized NFT marketplace with advanced analytics",
      category: "NFT",
      trustScore: 85,
      fundingGoal: 75000,
      currentFunding: 45000,
      bookmarkedAt: "2024-01-10",
      href: "/project/3"
    },
    {
      id: 4,
      type: "developer",
      title: "Sarah Chen",
      description: "Smart contract auditor and security researcher",
      category: "Developer",
      trustScore: 95,
      githubContributions: 892,
      bookmarkedAt: "2024-01-08",
      href: "/developer/sarah-chen"
    }
  ];

  const filteredBookmarks = bookmarkedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "all" || 
                         item.category.toLowerCase() === filterCategory.toLowerCase() ||
                         item.type === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout
      breadcrumbItems={breadcrumbItems}
      pageTitle="Bookmarks"
      pageDescription="Your saved projects and developers for quick access"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search bookmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterCategory === "all" ? "default" : "outline"}
                    onClick={() => setFilterCategory("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterCategory === "project" ? "default" : "outline"}
                    onClick={() => setFilterCategory("project")}
                    size="sm"
                  >
                    Projects
                  </Button>
                  <Button
                    variant={filterCategory === "developer" ? "default" : "outline"}
                    onClick={() => setFilterCategory("developer")}
                    size="sm"
                  >
                    Developers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookmarks List */}
          <div className="space-y-4">
            {filteredBookmarks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No bookmarks found</h3>
                  <p className="text-slate-600">
                    {searchQuery || filterCategory !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "Start bookmarking projects and developers you're interested in"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBookmarks.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={item.type === "project" ? "default" : "secondary"}>
                            {item.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {item.type === "project" ? item.trustScore : item.trustScore}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-slate-600 mb-4">{item.description}</p>

                        {item.type === "project" && (
                          <div className="text-sm text-slate-500 mb-4">
                            Funding: ${item.currentFunding?.toLocaleString()} / ${item.fundingGoal?.toLocaleString()}
                          </div>
                        )}

                        {item.type === "developer" && (
                          <div className="text-sm text-slate-500 mb-4">
                            GitHub Contributions: {item.githubContributions?.toLocaleString()}
                          </div>
                        )}

                        <div className="flex items-center text-xs text-slate-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          Bookmarked on {item.bookmarkedAt}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={item.href}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BookmarksPage;
