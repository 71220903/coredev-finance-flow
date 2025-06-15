
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  DollarSign,
  Calendar,
  Star
} from "lucide-react";

interface SearchFilters {
  query: string;
  minAmount: number;
  maxAmount: number;
  minInterestRate: number;
  maxInterestRate: number;
  minTrustScore: number;
  status: string[];
  sectors: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

const AdvancedSearch = ({ onFiltersChange, onReset }: AdvancedSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    minAmount: 0,
    maxAmount: 100000,
    minInterestRate: 0,
    maxInterestRate: 25,
    minTrustScore: 0,
    status: [],
    sectors: [],
    sortBy: "newest",
    sortOrder: 'desc'
  });

  const statusOptions = ["funding", "active", "repaid", "defaulted"];
  const sectorOptions = ["DeFi", "AI/ML", "Web3", "Gaming", "SaaS", "Mobile"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "amount", label: "Loan Amount" },
    { value: "interest", label: "Interest Rate" },
    { value: "trust", label: "Trust Score" },
    { value: "deadline", label: "Deadline" }
  ];

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      query: "",
      minAmount: 0,
      maxAmount: 100000,
      minInterestRate: 0,
      maxInterestRate: 25,
      minTrustScore: 0,
      status: [],
      sectors: [],
      sortBy: "newest",
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onReset();
  };

  const activeFiltersCount = [
    filters.status.length > 0,
    filters.sectors.length > 0,
    filters.minAmount > 0,
    filters.maxAmount < 100000,
    filters.minInterestRate > 0,
    filters.maxInterestRate < 25,
    filters.minTrustScore > 0
  ].filter(Boolean).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Advanced Search</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} filters</Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {isExpanded ? "Hide" : "Show"} Filters
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by project, developer, or technology..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Quick Sort */}
        <div className="flex items-center space-x-4">
          <Label className="text-sm font-medium">Sort by:</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Amount Range */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Loan Amount Range</span>
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[filters.minAmount, filters.maxAmount]}
                  onValueChange={([min, max]) => updateFilters({ minAmount: min, maxAmount: max })}
                  max={100000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>${filters.minAmount.toLocaleString()}</span>
                  <span>${filters.maxAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Interest Rate Range */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Interest Rate Range</span>
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[filters.minInterestRate, filters.maxInterestRate]}
                  onValueChange={([min, max]) => updateFilters({ minInterestRate: min, maxInterestRate: max })}
                  max={25}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{filters.minInterestRate}%</span>
                  <span>{filters.maxInterestRate}%</span>
                </div>
              </div>
            </div>

            {/* Trust Score */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Minimum Trust Score: {filters.minTrustScore}</span>
              </Label>
              <Slider
                value={[filters.minTrustScore]}
                onValueChange={([value]) => updateFilters({ minTrustScore: value })}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label>Loan Status</Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => 
                        updateFilters({ 
                          status: toggleArrayFilter(filters.status, status) 
                        })
                      }
                    />
                    <Label className="capitalize">{status}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector Filter */}
            <div className="space-y-3">
              <Label>Project Sectors</Label>
              <div className="flex flex-wrap gap-2">
                {sectorOptions.map(sector => (
                  <div key={sector} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.sectors.includes(sector)}
                      onCheckedChange={() => 
                        updateFilters({ 
                          sectors: toggleArrayFilter(filters.sectors, sector) 
                        })
                      }
                    />
                    <Label>{sector}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button onClick={() => setIsExpanded(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
