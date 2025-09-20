import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowRight, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const DemoHelper = () => {
  const demoFlow = [
    {
      step: 1,
      title: "Farmer Registration",
      description: "Go to Farmer page and add a new product to demonstrate harvest registration",
      link: "/farmer",
      color: "bg-success"
    },
    {
      step: 2, 
      title: "Distribution Update",
      description: "Visit Distributor page to simulate pickup and transport updates",
      link: "/distributor",
      color: "bg-blockchain"
    },
    {
      step: 3,
      title: "Retail Management", 
      description: "Check Retailer page to receive products and manage store inventory",
      link: "/retailer",
      color: "bg-warning"
    },
    {
      step: 4,
      title: "Consumer Tracking",
      description: "Use Consumer or Track page to verify product authenticity and see complete journey",
      link: "/track",
      color: "bg-primary"
    }
  ];

  const features = [
    "🔒 Blockchain Security & Immutability",
    "📱 QR Code Integration",
    "🌾 Multi-Stakeholder Support",
    "📊 Real-time Tracking",
    "✅ Authenticity Verification",
    "📈 Supply Chain Transparency"
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="w-80 shadow-blockchain border-blockchain">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="w-4 h-4 text-blockchain" />
            Demo Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-2">Key Features:</p>
            <div className="grid grid-cols-1 gap-1">
              {features.map((feature, index) => (
                <div key={index} className="text-xs">{feature}</div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-3">
            <p className="text-xs font-semibold mb-2">Demo Flow:</p>
            <div className="space-y-2">
              {demoFlow.map((item) => (
                <Link key={item.step} to={item.link}>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t pt-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-xs text-success font-semibold">Blockchain Verified</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoHelper;