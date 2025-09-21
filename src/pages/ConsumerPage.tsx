import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Search, Shield, Leaf, Truck, Store, MapPin, Calendar, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { blockchain, Product, BlockData } from "@/lib/blockchain";
import { toast } from "@/hooks/use-toast";

const ConsumerPage = () => {
  const [searchId, setSearchId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleSearch = () => {
    if (!searchId.trim()) {
      toast({
        title: "Please enter a product ID",
        variant: "destructive"
      });
      return;
    }

    const foundProduct = blockchain.getProduct(searchId);
    if (foundProduct) {
      setProduct(foundProduct);
      const verified = blockchain.verifyBlockchain(searchId);
      setIsVerified(verified);
      
      if (verified) {
        toast({
          title: "Product Found & Verified!",
          description: "Blockchain verification successful.",
        });
      } else {
        toast({
          title: "Product Found - Verification Failed",
          description: "Blockchain integrity check failed.",
          variant: "destructive"
        });
      }
    } else {
      setProduct(null);
      toast({
        title: "Product Not Found",
        description: "Please check the product ID and try again.",
        variant: "destructive"
      });
    }
  };

  const getStageIcon = (stage: BlockData["stage"]) => {
    const icons = {
      farm: Leaf,
      transport: Truck,
      warehouse: Store,
      retail: Store,
      consumer: User
    };
    return icons[stage] || Shield;
  };

  const getStageColor = (stage: BlockData["stage"]) => {
    const colors = {
      farm: "text-success",
      transport: "text-blockchain", 
      warehouse: "text-accent",
      retail: "text-warning",
      consumer: "text-primary"
    };
    return colors[stage] || "text-muted-foreground";
  };

  const getStageName = (stage: BlockData["stage"]) => {
    const names = {
      farm: "Farm/Harvest",
      transport: "Transportation",
      warehouse: "Warehouse",
      retail: "Retail Store",
      consumer: "Consumer"
    };
    return names[stage] || stage;
  };

  const sampleProducts = blockchain.getAllProducts().slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Consumer Portal</h1>
            <p className="text-muted-foreground">Track your food from farm to fork</p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-blockchain">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Track Product Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Product ID (e.g., prod_1726834567_abc123)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Try these sample product IDs:</p>
              <div className="flex gap-2 mt-2">
                {sampleProducts.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchId(p.id)}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        {product && (
          <>
            {/* Verification Status */}
            <Card className={`mb-6 ${isVerified ? 'border-success' : 'border-destructive'}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isVerified ? 'bg-success' : 'bg-destructive'
                  }`}>
                    {isVerified ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Shield className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isVerified ? 'Blockchain Verified ✓' : 'Verification Failed ✗'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isVerified 
                        ? 'This product has been authenticated and all records are intact.'
                        : 'Blockchain integrity check failed. Data may have been tampered with.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="mb-6 card-gradient shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-success" />
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Variety</p>
                    <p className="font-semibold">{product.variety}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{product.quantity} {product.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Harvest Date</p>
                    <p className="font-semibold">{new Date(product.harvestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Farmer</p>
                    <p className="font-semibold">{product.farmer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-semibold">{product.farmerLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <Badge className={
                      product.status === "sold" ? "bg-success text-white" :
                      product.status === "retail" ? "bg-warning text-foreground" :
                      product.status === "in-transit" ? "bg-blockchain text-white" :
                      "bg-muted text-muted-foreground"
                    }>
                      {product.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Framework Info */}
            <Card className="mb-6 border-blockchain">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blockchain rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Blockchain Framework</h3>
                    <p className="text-sm text-muted-foreground">{product.blockchainFramework}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Journey */}
            <Card className="shadow-blockchain">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blockchain" />
                  Supply Chain Journey
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete blockchain-verified journey from farm to your table
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.blocks.map((block, index) => {
                    const StageIcon = getStageIcon(block.stage);
                    const isLast = index === product.blocks.length - 1;
                    
                    return (
                      <div key={block.id} className="relative">
                        {!isLast && (
                          <div className="absolute left-6 top-16 w-0.5 h-16 bg-border"></div>
                        )}
                        
                        <Card className="ml-0 border-l-4 border-l-current">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStageColor(block.stage)} bg-background border-2 border-current`}>
                                <StageIcon className="w-5 h-5" />
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-lg">{getStageName(block.stage)}</h4>
                                  <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                                  <Badge className="bg-blockchain text-white text-xs">
                                    {block.hash.slice(0, 6)}...
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{block.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>{new Date(block.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{block.stakeholder}</span>
                                  </div>
                                  {block.price > 0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-success font-bold">₹{block.price}/kg</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Enhanced stage-specific data */}
                                <div className="bg-muted/30 rounded-lg p-3">
                                  {block.stage === "farm" && (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-muted-foreground">Quality Grade:</span> <span className="font-semibold">{block.data.quality}</span></div>
                                        <div><span className="text-muted-foreground">Organic:</span> <span className="font-semibold">{block.data.organicCertified ? "Certified" : "Conventional"}</span></div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {block.stage === "transport" && (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-semibold">{block.data.vehicle}</span></div>
                                        <div><span className="text-muted-foreground">Driver:</span> <span className="font-semibold">{block.data.driver}</span></div>
                                        <div><span className="text-muted-foreground">Temperature:</span> <span className="font-semibold">{block.data.temperature}</span></div>
                                        <div><span className="text-muted-foreground">Condition:</span> <span className="font-semibold">Optimal</span></div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {block.stage === "warehouse" && (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-muted-foreground">Facility:</span> <span className="font-semibold">{block.data.facility || "Central Warehouse"}</span></div>
                                        <div><span className="text-muted-foreground">Storage Temp:</span> <span className="font-semibold">{block.data.temperature || "Ambient"}</span></div>
                                        <div><span className="text-muted-foreground">Quality Check:</span> <span className="font-semibold">{block.data.quality_check || "Passed"}</span></div>
                                        <div><span className="text-muted-foreground">Duration:</span> <span className="font-semibold">{block.data.storage_duration || "3 days"}</span></div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {block.stage === "retail" && (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-muted-foreground">Store ID:</span> <span className="font-semibold">{block.data.store_id || "N/A"}</span></div>
                                        <div><span className="text-muted-foreground">Packaging:</span> <span className="font-semibold">{block.data.packaging || "Standard"}</span></div>
                                        <div><span className="text-muted-foreground">Shelf Life:</span> <span className="font-semibold">{block.data.shelf_life || "Fresh"}</span></div>
                                        <div><span className="text-muted-foreground">Display:</span> <span className="font-semibold">{block.data.display_location || "Fresh Section"}</span></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
                
                {/* Farmer Revenue Info */}
                {product.farmerRevenue && product.farmerRevenue > 0 && (
                  <div className="mt-6 p-4 bg-success/10 border border-success rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <span className="font-bold text-success">Farmer Revenue Impact</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      When this product sells, farmer <span className="font-semibold">{product.farmer}</span> receives:
                    </p>
                    <p className="text-2xl font-bold text-success">₹{product.farmerRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      (35% of total revenue • Supporting sustainable farming)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* No Product State */}
        {!product && (
          <Card className="card-gradient">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">Track Your Product</h3>
              <p className="text-muted-foreground mb-6">
                Enter a product ID above to see its complete journey from farm to fork
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <Shield className="w-5 h-5 text-blockchain flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Blockchain Verified</p>
                    <p className="text-xs text-muted-foreground">
                      Every step is cryptographically secured and cannot be tampered with
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConsumerPage;