import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Leaf, Truck, Store, User, CheckCircle, TrendingUp, Users } from "lucide-react";

import heroImage from "@/assets/hero-agriculture.jpg";
import supplyChainImage from "@/assets/supply-chain.jpg";
import qrScanImage from "@/assets/qr-scan.jpg";

const HomePage = () => {
  const stakeholders = [
    {
      icon: Leaf,
      title: "Farmers",
      description: "Register your produce and create transparent records from harvest",
      link: "/farmer",
      color: "text-success"
    },
    {
      icon: Truck,
      title: "Distributors",
      description: "Track shipments and maintain cold chain integrity",
      link: "/distributor", 
      color: "text-blockchain"
    },
    {
      icon: Store,
      title: "Retailers",
      description: "Verify authenticity and manage inventory with confidence",
      link: "/retailer",
      color: "text-accent"
    },
    {
      icon: User,
      title: "Consumers",
      description: "Scan QR codes to see complete product journey and origin",
      link: "/consumer",
      color: "text-primary"
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "100% Transparency",
      description: "Complete traceability from farm to fork"
    },
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable records prevent fraud and manipulation"
    },
    {
      icon: TrendingUp,
      title: "Fair Pricing",
      description: "Direct farmer-consumer connection ensures fair prices"
    },
    {
      icon: Users,
      title: "Trust Network",
      description: "Build trust between all stakeholders in the supply chain"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-primary/60" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in slide-in-from-bottom-8 duration-1000">
              AgriChain
            </h1>
            <p className="text-xl md:text-2xl mb-4 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
              Blockchain-Powered Agricultural Supply Chain
            </p>
            <p className="text-lg mb-8 opacity-90 animate-in slide-in-from-bottom-8 duration-1000 delay-400">
              Ensuring transparency, trust, and fair pricing from farm to fork
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-600">
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 font-bold shadow-lg border-2 border-white">
                <Link to="/track">
                  <Shield className="mr-2" />
                  Track Product
                </Link>
              </Button>
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold shadow-lg">
                <Link to="/farmer">
                  <Leaf className="mr-2" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the AgriChain network as a farmer, distributor, retailer, or consumer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stakeholders.map((stakeholder, index) => (
              <Link key={index} to={stakeholder.link}>
                <Card className="h-full transition-smooth hover:shadow-blockchain hover:scale-105 card-gradient">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-background flex items-center justify-center ${stakeholder.color}`}>
                      <stakeholder.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{stakeholder.title}</h3>
                    <p className="text-muted-foreground">{stakeholder.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Why AgriChain?</h2>
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 blockchain-gradient rounded-full flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={supplyChainImage} 
                alt="Supply Chain Visualization" 
                className="rounded-2xl shadow-soft w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to ensure complete transparency in agricultural supply chain
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src={qrScanImage} 
                alt="QR Code Scanning" 
                className="rounded-2xl shadow-soft w-full"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 blockchain-gradient rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Farmer Registers Produce</h3>
                  <p className="text-muted-foreground">Farmers add their harvest details to create the first block in the chain</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 blockchain-gradient rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Supply Chain Updates</h3>
                  <p className="text-muted-foreground">Each stakeholder adds verified information at every step</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 blockchain-gradient rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Consumer Scans QR</h3>
                  <p className="text-muted-foreground">Complete product history is instantly available to consumers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 blockchain-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join AgriChain?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start building trust and transparency in agricultural supply chains today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-white text-blockchain font-bold shadow-lg border-2 border-white">
              <Link to="/farmer">Start as Farmer</Link>
            </Button>
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blockchain font-bold shadow-lg">
              <Link to="/track">Track Product</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;