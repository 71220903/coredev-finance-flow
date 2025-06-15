
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Upload, Coins, AlertCircle, Loader2 } from "lucide-react";
import { useDeveloperVerification } from "@/hooks/useDeveloperVerification";
import { useStaking } from "@/hooks/useStaking";
import { useMarketCreation } from "@/hooks/useMarketCreation";
import DeveloperVerification from "@/components/DeveloperVerification";
import EnhancedStakingWidget from "@/components/EnhancedStakingWidget";

interface CreateMarketModalProps {
  trigger?: React.ReactNode;
}

const CreateMarketModal = ({ trigger }: CreateMarketModalProps) => {
  const { isVerified } = useDeveloperVerification();
  const { isStaked } = useStaking();
  const { isCreating, currentStep, progress, createMarket } = useMarketCreation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    amount: "",
    interestRate: "",
    tenor: "",
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

  const handleSubmit = async () => {
    const success = await createMarket(formData);
    
    if (success) {
      setIsOpen(false);
      // Reset form
      setFormData({
        projectTitle: "",
        description: "",
        amount: "",
        interestRate: "",
        tenor: "",
        tags: [],
        currentTag: ""
      });
    }
  };

  const isFormValid = formData.projectTitle && 
                     formData.description && 
                     formData.amount && 
                     formData.interestRate && 
                     formData.tenor &&
                     isVerified && 
                     isStaked;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button disabled={!isVerified || !isStaked}>
            <Plus className="h-4 w-4 mr-2" />
            Create Market
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Loan Market</DialogTitle>
          <DialogDescription>
            Create an isolated lending market for your project with fixed interest rate and clear terms.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Developer Verification Status */}
          <DeveloperVerification />

          {/* Staking Widget */}
          <EnhancedStakingWidget />

          {/* Market Creation Progress */}
          {isCreating && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Market
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-blue-700">{currentStep}</div>
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-blue-600">{progress}% complete</div>
              </CardContent>
            </Card>
          )}

          {/* Only show form if verified and staked */}
          {isVerified && isStaked && (
            <>
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      placeholder="e.g., AI-powered Code Review Tool"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                      disabled={isCreating}
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
                      disabled={isCreating}
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
                        disabled={isCreating}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddTag}
                        disabled={isCreating}
                      >
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
                            disabled={isCreating}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                        disabled={isCreating}
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
                        disabled={isCreating}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tenor">Loan Duration</Label>
                    <Select 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tenor: value }))}
                      disabled={isCreating}
                    >
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

              {/* Submit Button */}
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSubmit}
                disabled={!isFormValid || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Market...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Loan Market
                  </>
                )}
              </Button>
            </>
          )}

          {/* Requirements not met */}
          {(!isVerified || !isStaked) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-3">
                  Complete the following steps to create loan markets:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className={`flex items-center space-x-2 ${isVerified ? 'text-green-700' : 'text-orange-700'}`}>
                    <span>{isVerified ? '✅' : '❌'}</span>
                    <span>Developer verification</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${isStaked ? 'text-green-700' : 'text-orange-700'}`}>
                    <span>{isStaked ? '✅' : '❌'}</span>
                    <span>Stake tCORE tokens</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketModal;
