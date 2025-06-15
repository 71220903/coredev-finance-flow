
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  Target,
  Clock
} from "lucide-react";

interface ProjectDataRoomProps {
  projectId: string;
}

const ProjectDataRoom = ({ projectId }: ProjectDataRoomProps) => {
  // Mock project data - would come from IPFS in real implementation
  const projectData = {
    title: "DeFi Yield Aggregator Platform",
    description: "A comprehensive DeFi platform that automatically finds the best yield opportunities across multiple protocols",
    category: "DeFi",
    stage: "MVP Ready",
    fundingGoal: 50000,
    duration: "6 months",
    interestRate: 15,
    ipfsHash: "QmX7Y8Z9...",
    documents: [
      { name: "Project Whitepaper", type: "PDF", size: "2.1 MB", url: "#" },
      { name: "Technical Specification", type: "PDF", size: "1.8 MB", url: "#" },
      { name: "Market Analysis", type: "PDF", size: "950 KB", url: "#" },
      { name: "Financial Projections", type: "XLSX", size: "420 KB", url: "#" }
    ],
    milestones: [
      { title: "MVP Development", duration: "2 months", budget: 20000, status: "planned" },
      { title: "Security Audit", duration: "1 month", budget: 15000, status: "planned" },
      { title: "Beta Testing", duration: "2 months", budget: 10000, status: "planned" },
      { title: "Launch & Marketing", duration: "1 month", budget: 5000, status: "planned" }
    ],
    techStack: ["Solidity", "React", "Node.js", "PostgreSQL", "Web3.js"],
    risks: [
      "Smart contract vulnerabilities",
      "Market volatility impact",
      "Regulatory changes",
      "Competition from established players"
    ],
    team: [
      { name: "Alex Rodriguez", role: "Lead Developer", github: "@alexcoder" },
      { name: "Sarah Chen", role: "Smart Contract Developer", github: "@saraheth" },
      { name: "Mike Johnson", role: "UI/UX Designer", github: "@mikedesign" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "planned": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{projectData.title}</CardTitle>
              <CardDescription className="text-base">
                {projectData.description}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-4">
                <Badge variant="outline">{projectData.category}</Badge>
                <Badge variant="secondary">{projectData.stage}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-600">Funding Goal</span>
            </div>
            <div className="text-2xl font-bold">${projectData.fundingGoal.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-slate-600">Duration</span>
            </div>
            <div className="text-2xl font-bold">{projectData.duration}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-slate-600">Interest Rate</span>
            </div>
            <div className="text-2xl font-bold">{projectData.interestRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {projectData.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IPFS Data Room</CardTitle>
              <CardDescription>Decentralized storage of project documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Project Data Room</div>
                    <div className="text-sm text-slate-600">IPFS Hash: {projectData.ipfsHash}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View on IPFS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Download or view project documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-slate-600">{doc.type} • {doc.size}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>Development phases and budget allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectData.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{milestone.title}</div>
                      <Badge className={getStatusColor(milestone.status)}>
                        {milestone.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Duration: {milestone.duration}
                      </div>
                      <div>
                        <DollarSign className="h-3 w-3 inline mr-1" />
                        Budget: ${milestone.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
              <CardDescription>Core team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectData.team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-slate-600">{member.role}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{member.github}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Identified risks and mitigation strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectData.risks.map((risk, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{risk}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDataRoom;
