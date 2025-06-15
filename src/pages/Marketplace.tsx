
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Github, 
  Star, 
  Clock, 
  DollarSign,
  TrendingUp,
  Code2,
  Users,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const loanRequests = [
    {
      id: 1,
      borrower: "alexcoder",
      githubHandle: "@alexcoder",
      amount: 15000,
      interestRate: 7.5,
      duration: "12 months",
      purpose: "Building a SaaS platform for small businesses",
      description: "Need funding to develop a comprehensive business management platform using React, Node.js, and PostgreSQL. Already have MVP with 100+ beta users.",
      trustScore: 88,
      experience: "5 years",
      repos: 42,
      followers: 230,
      tags: ["React", "Node.js", "SaaS", "B2B"],
      timeLeft: "5 days",
      funded: 45,
      target: 100
    },
    {
      id: 2,
      borrower: "sarahml",
      githubHandle: "@sarahml",
      amount: 8000,
      interestRate: 8.2,
      duration: "6 months",
      purpose: "AI-powered code review tool development",
      description: "Developing an AI tool that automatically reviews code for bugs and optimization opportunities. Using Python, TensorFlow, and cloud infrastructure.",
      trustScore: 92,
      experience: "3 years",
      repos: 28,
      followers: 450,
      tags: ["Python", "AI/ML", "DevTools", "TensorFlow"],
      timeLeft: "12 days",
      funded: 20,
      target: 100
    },
    {
      id: 3,
      borrower: "mobiledev",
      githubHandle: "@mobiledev",
      amount: 5000,
      interestRate: 9.0,
      duration: "4 months",
      purpose: "React Native app for local businesses",
      description: "Creating a marketplace app for local service providers. Need funding for development tools, cloud services, and marketing.",
      trustScore: 76,
      experience: "2 years",
      repos: 18,
      followers: 89,
      tags: ["React Native", "Mobile", "E-commerce"],
      timeLeft: "8 days",
      funded: 60,
      target: 100
    }
  ];

  const filteredRequests = loanRequests.filter(request => {
    const matchesSearch = request.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "high-trust") return matchesSearch && request.trustScore >= 85;
    if (filterBy === "new") return matchesSearch && request.timeLeft.includes("days");
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CD</span>
              </div>
              <span className="text-xl font-bold text-slate-900">CoreDev Zero</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Loan Request</DialogTitle>
                    <DialogDescription>
                      Fill out the details for your funding request. Make sure to provide clear information about your project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Loan Amount ($)</Label>
                        <Input id="amount" placeholder="10000" type="number" />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 months</SelectItem>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="12">12 months</SelectItem>
                            <SelectItem value="24">24 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="purpose">Project Title</Label>
                      <Input id="purpose" placeholder="Brief description of your project" />
                    </div>
                    <div>
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Provide detailed information about your project, technology stack, timeline, and how you plan to use the funds."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub Profile</Label>
                      <Input id="github" placeholder="https://github.com/yourusername" />
                    </div>
                    <Button className="w-full">Submit Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Funding Marketplace</h1>
          <p className="text-slate-600">
            Discover funding opportunities and support innovative developer projects
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by developer, project, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="high-trust">High Trust Score</SelectItem>
                <SelectItem value="new">Recently Added</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="amount-high">Highest Amount</SelectItem>
                <SelectItem value="amount-low">Lowest Amount</SelectItem>
                <SelectItem value="trust-score">Trust Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$340K</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Requests */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Github className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{request.purpose}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                        <span>{request.githubHandle}</span>
                        <span>•</span>
                        <span>{request.experience} experience</span>
                        <span>•</span>
                        <span>{request.repos} repos</span>
                        <span>•</span>
                        <span>{request.followers} followers</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{request.trustScore}</span>
                    </div>
                    <Badge variant="outline">Trust Score</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{request.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {request.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-slate-600">Amount</div>
                    <div className="font-semibold">${request.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Interest Rate</div>
                    <div className="font-semibold">{request.interestRate}% APR</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Duration</div>
                    <div className="font-semibold">{request.duration}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Time Left</div>
                    <div className="font-semibold text-orange-600">{request.timeLeft}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-600">
                      Funded: {request.funded}% of target
                    </div>
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${request.funded}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button>Fund This Project</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
