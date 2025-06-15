
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MessageCircle, 
  ExternalLink,
  Wallet,
  TrendingUp,
  Shield,
  Settings,
  HelpCircle,
  BookOpen
} from "lucide-react";
import AppLayout from "@/components/navigation/AppLayout";

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  questions: Question[];
}

const helpCategories: Category[] = [
  {
    id: "wallet",
    name: "Wallet & Connection",
    icon: Wallet,
    description: "Issues with connecting wallets and transactions",
    questions: [
      {
        id: "connect-wallet",
        question: "How do I connect my wallet?",
        answer: "Click the 'Connect Wallet' button in the top right corner and select your wallet provider (MetaMask recommended). Make sure you have the wallet extension installed and some ETH for gas fees."
      },
      {
        id: "wallet-not-connecting",
        question: "My wallet won't connect",
        answer: "Try refreshing the page, make sure your wallet is unlocked, and check that you're on the correct network. If using MetaMask, try switching to a different network and back."
      },
      {
        id: "transaction-failed",
        question: "Why did my transaction fail?",
        answer: "Common reasons include insufficient gas fees, network congestion, or insufficient balance. Check your wallet for error details and ensure you have enough ETH for gas fees."
      }
    ]
  },
  {
    id: "lending",
    name: "Lending & Markets",
    icon: TrendingUp,
    description: "Questions about creating markets and lending",
    questions: [
      {
        id: "create-market",
        question: "How do I create a lending market?",
        answer: "Connect your wallet, click 'Create Market' in the sidebar, fill in your loan details (amount, interest rate, duration), and submit. Your market will appear in the marketplace once confirmed."
      },
      {
        id: "interest-rates",
        question: "How are interest rates determined?",
        answer: "Interest rates are set by borrowers when creating markets. Lenders can choose to invest based on the rates offered and their risk assessment of the developer."
      },
      {
        id: "repayment",
        question: "How does loan repayment work?",
        answer: "Borrowers repay loans according to the terms set in their market. Payments are automatically distributed to lenders proportionally to their investment amounts."
      }
    ]
  },
  {
    id: "security",
    name: "Security & Safety",
    icon: Shield,
    description: "Platform security and safety measures",
    questions: [
      {
        id: "platform-security",
        question: "Is the platform secure?",
        answer: "Yes, CoreDev Zero uses smart contracts on the blockchain for transparency and security. All transactions are recorded on-chain and cannot be altered. However, always do your own research before investing."
      },
      {
        id: "trust-score",
        question: "How is the trust score calculated?",
        answer: "Trust scores are based on GitHub activity, project quality, previous loan repayments, and community engagement. Higher scores indicate more reliable developers."
      },
      {
        id: "risk-assessment",
        question: "How do I assess investment risk?",
        answer: "Review the developer's trust score, GitHub history, project portfolio, and loan terms. Diversify your investments and never invest more than you can afford to lose."
      }
    ]
  },
  {
    id: "account",
    name: "Account & Profile",
    icon: Settings,
    description: "Managing your account and profile settings",
    questions: [
      {
        id: "update-profile",
        question: "How do I update my profile?",
        answer: "Go to your Profile page from the sidebar, click 'Edit Profile', and update your information. For developers, make sure to link your GitHub account for better trust scores."
      },
      {
        id: "achievements",
        question: "What are achievements?",
        answer: "Achievements are NFT badges earned by completing actions like successful loan repayments, reaching lending milestones, or contributing to the community. They help build your reputation."
      },
      {
        id: "notifications",
        question: "How do I manage notifications?",
        answer: "Visit the Settings page to configure your notification preferences for market updates, loan status changes, and platform announcements."
      }
    ]
  }
];

const HelpSupportPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedQuestion(null);
  };

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleBack = () => {
    if (selectedQuestion) {
      setSelectedQuestion(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const handleGoToDocumentation = () => {
    window.open("https://docs.lovable.dev/", "_blank");
  };

  const currentCategory = helpCategories.find(cat => cat.id === selectedCategory);

  return (
    <AppLayout
      pageTitle="Help & Support"
      pageDescription="Get help with using CoreDev Zero platform"
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Help & Support" }
      ]}
    >
      <div className="max-w-4xl mx-auto p-6">
        <Card className="min-h-[600px]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(selectedCategory || selectedQuestion) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-xl">
                    {selectedQuestion ? selectedQuestion.question : 
                     selectedCategory ? currentCategory?.name : 
                     "How can we help you?"}
                  </CardTitle>
                  {!selectedQuestion && !selectedCategory && (
                    <p className="text-sm text-slate-600 mt-1">
                      Choose a category to get started
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                AI Assistant
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {/* Category Selection */}
            {!selectedCategory && !selectedQuestion && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <category.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Question Selection */}
            {selectedCategory && !selectedQuestion && currentCategory && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-4">
                  <currentCategory.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-slate-600">
                    {currentCategory.description}
                  </span>
                </div>
                
                {currentCategory.questions.map((question) => (
                  <Button
                    key={question.id}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto"
                    onClick={() => handleQuestionSelect(question)}
                  >
                    <HelpCircle className="h-4 w-4 mr-3 text-slate-500" />
                    {question.question}
                  </Button>
                ))}
              </div>
            )}

            {/* Answer Display */}
            {selectedQuestion && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 rounded-full p-2">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 leading-relaxed">
                        {selectedQuestion.answer}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center space-y-4">
                  <p className="text-sm text-slate-600">
                    Was this answer helpful?
                  </p>
                  
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBack}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      Yes, thanks!
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGoToDocumentation}
                      className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Need more help
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-3">
                  Still can't find what you're looking for?
                </p>
                <Button
                  variant="outline"
                  onClick={handleGoToDocumentation}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default HelpSupportPage;
