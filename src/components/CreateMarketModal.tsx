
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Upload, Coins, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeveloperVerification } from "@/hooks/useDeveloperVerification";
import DeveloperVerification from "@/components/DeveloperVerification";

interface CreateMarketModalProps {
  trigger?: React.ReactNode;
  isStaked?: boolean;
  stakeAmount?: number;
}

const CreateMarketModal = ({ trigger, isStaked = false, stakeAmount = 0 }: CreateMarketModalProps) => {
  const { toast } = useToast();
  const { isVerified, isLoading } = useDeveloperVerification();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    amount: "",
    interestRate: "",
    tenor: "",
    ipfsHash: "",
    tags: [] as string[],
    currentTag: ""
  });

  const handleAddTag = () => {
    if (formData.currentTag && !formData.tags.includes(formData.currentTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag],
        currentTag: ""
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = () => {
    if (!isVerified) {
      toast({
        title: "Developer Verification Required",
        description: "You need to be a verified developer to create markets.",
        variant: "destructive"
      });
      return;
    }

    if (!isStaked) {
      toast({
        title: "Staking Required",
        description: "You need to stake tCORE2 before creating a market.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Market Created Successfully!",
      description: `Your loan request for $${Number(formData.amount).toLocaleString()} has been created and is now seeking funding.`
    });
    
    setIsOpen(false);
    // Reset form
    setFormData({
      projectTitle: "",
      description: "",
      amount: "",
      interestRate: "",
      tenor: "",
      ipfsHash: "",
      tags: [],
      currentTag: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button disabled={!isVerified}>
            <Plus className="h-4 w-4 mr-2" />
            Create Market
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Loan Market</DialogTitle>
          <DialogDescription>
            Create an isolated lending market for your project with fixed interest rate and clear terms.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Developer Verification Status */}
          <DeveloperVerification />

          {/* Staking Status */}
          <Card className={isStaked ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Coins className={`h-5 w-5 ${isStaked ? "text-green-600" : "text-red-600"}`} />
                <CardTitle className="text-lg">Staking Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isStaked ? (
                <div className="text-green-700">
                  ✅ You have staked {stakeAmount} tCORE2. You can create markets.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    You need to stake tCORE2 before creating a market.
                  </div>
                  <Button variant="outline" size="sm">
                    Stake 1 tCORE2
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Only show form if verified */}
          {isVerified && (
            <>
              {/* Project Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectTitle">Project Title</Label>
                  <Input
                    id="projectTitle"
                    placeholder="e.g., AI-powered Code Review Tool"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project, technology stack, timeline, and how you plan to use the funds..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Tags */}
                <div>
                  <Label>Technology Tags</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add a tag (e.g., React, AI/ML)"
                      value={formData.currentTag}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentTag: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pr-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loan Terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Loan Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Loan Amount (sUSDT)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="50000"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="interestRate">Interest Rate (% APR)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        placeholder="12.5"
                        value={formData.interestRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tenor">Loan Duration</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, tenor: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="18">18 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Calculation Preview */}
                  {formData.amount && formData.interestRate && formData.tenor && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm font-medium mb-2">Loan Summary:</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Principal:</span>
                          <span className="font-medium ml-2">${Number(formData.amount).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Interest:</span>
                          <span className="font-medium ml-2">
                            ${Math.round(Number(formData.amount) * Number(formData.interestRate) / 100 * Number(formData.tenor) / 12).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Total Repayment:</span>
                          <span className="font-medium ml-2">
                            ${(Number(formData.amount) + Math.round(Number(formData.amount) * Number(formData.interestRate) / 100 * Number(formData.tenor) / 12)).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Monthly Payment:</span>
                          <span className="font-medium ml-2">
                            ${Math.round((Number(formData.amount) + Math.round(Number(formData.amount) * Number(formData.interestRate) / 100 * Number(formData.tenor) / 12)) / Number(formData.tenor)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* IPFS Data Room */}
              <div>
                <Label htmlFor="ipfsHash">IPFS Project Data Room (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="ipfsHash"
                    placeholder="QmXxX... (IPFS hash for detailed project documentation)"
                    value={formData.ipfsHash}
                    onChange={(e) => setFormData(prev => ({ ...prev, ipfsHash: e.target.value }))}
                  />
                  <Button variant="outline" type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Upload detailed project documentation, pitch deck, or technical specifications to IPFS
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSubmit}
                disabled={!isVerified || !isStaked || !formData.projectTitle || !formData.amount || !formData.interestRate || !formData.tenor}
              >
                Create Loan Market
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketModal;
