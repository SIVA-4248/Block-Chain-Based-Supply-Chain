import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QRCode } from "@/components/ui/qr-code";
import { Shield, Search, Scan, Download, Share2, CheckCircle } from "lucide-react";
import { blockchain, Product } from "@/lib/blockchain";
import { toast } from "@/hooks/use-toast";

const TrackPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [searchType, setSearchType] = useState<"id" | "qr">("id");

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast({
        title: "Please enter search criteria",
        variant: "destructive"
      });
      return;
    }

    // Extract product ID from QR code URL if needed
    let productId = searchInput;
    if (searchInput.includes("track/")) {
      productId = searchInput.split("track/")[1];
    }

    const foundProduct = blockchain.getProduct(productId);
    if (foundProduct) {
      setProduct(foundProduct);
      const verified = blockchain.verifyBlockchain(productId);
      setIsVerified(verified);
      
      toast({
        title: verified ? "Product Verified!" : "Verification Failed",
        description: verified 
          ? "Blockchain verification successful." 
          : "Product found but blockchain integrity compromised.",
        variant: verified ? "default" : "destructive"
      });
    } else {
      setProduct(null);
      setIsVerified(false);
      toast({
        title: "Product Not Found",
        description: "Please check the product ID or QR code and try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuickTrack = (productId: string) => {
    setSearchInput(productId);
    const foundProduct = blockchain.getProduct(productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setIsVerified(blockchain.verifyBlockchain(productId));
    }
  };

  const generateReport = () => {
    if (!product) return;
    
    const report = {
      productInfo: {
        name: product.name,
        variety: product.variety,
        quantity: `${product.quantity} ${product.unit}`,
        farmer: product.farmer,
        origin: product.farmerLocation,
        harvestDate: product.harvestDate
      },
      verification: {
        isVerified,
        totalBlocks: product.blocks.length,
        verificationDate: new Date().toISOString()
      },
      journey: product.blocks.map(block => ({
        stage: block.stage,
        timestamp: new Date(block.timestamp).toLocaleString(),
        location: block.location,
        stakeholder: block.stakeholder,
        hash: block.hash
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.name}-verification-report.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Verification report has been downloaded successfully.",
    });
  };

  const shareProduct = () => {
    if (!product) return;
    
    const shareText = `Check out the complete journey of ${product.name} on AgriChain blockchain! Product ID: ${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'AgriChain Product Verification',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Product information copied to clipboard.",
      });
    }
  };

  const sampleProducts = blockchain.getAllProducts().slice(0, 3);
  
  const getStatusColor = (status: Product["status"]) => {
    const colors = {
      harvested: "bg-success text-white",
      "in-transit": "bg-blockchain text-white", 
      warehoused: "bg-accent text-foreground",
      retail: "bg-warning text-foreground",
      sold: "bg-muted text-muted-foreground"
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blockchain rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Product Tracking</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter a product ID or scan a QR code to verify authenticity and trace the complete supply chain journey
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-blockchain max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Search className="w-5 h-5" />
              Track Product
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Type Toggle */}
            <div className="flex justify-center gap-2">
              <Button
                variant={searchType === "id" ? "default" : "outline"}
                onClick={() => setSearchType("id")}
                size="sm"
              >
                <Search className="w-4 h-4 mr-2" />
                Product ID
              </Button>
              <Button
                variant={searchType === "qr" ? "default" : "outline"} 
                onClick={() => setSearchType("qr")}
                size="sm"
              >
                <Scan className="w-4 h-4 mr-2" />
                QR Code
              </Button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <Input
                placeholder={
                  searchType === "id" 
                    ? "Enter Product ID (e.g., prod_1726834567_abc123)"
                    : "Enter QR Code URL or Product ID"
                }
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="text-center"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} className="w-full bg-blockchain hover:bg-blockchain/90">
                <Search className="w-4 h-4 mr-2" />
                Track Product
              </Button>
            </div>
            
            {/* Quick Track Samples */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Try these sample products:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {sampleProducts.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTrack(p.id)}
                    className="text-xs"
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Results */}
        {product && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Verification Status */}
            <Card className={`${isVerified ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isVerified ? 'bg-success' : 'bg-destructive'
                    }`}>
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">
                        {isVerified ? 'Blockchain Verified ✓' : 'Verification Failed ✗'}
                      </h3>
                      <p className="text-muted-foreground">
                        {isVerified 
                          ? 'This product is authentic and all supply chain data is verified.'
                          : 'Warning: Blockchain integrity check failed. Data may be compromised.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={shareProduct} variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button onClick={generateReport} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="card-gradient shadow-soft h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <p className="text-muted-foreground">{product.variety}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Farmer</p>
                        <p className="font-semibold">{product.farmer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Origin</p>
                        <p className="font-semibold">{product.farmerLocation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{product.quantity} {product.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Harvest Date</p>
                        <p className="font-semibold">{new Date(product.harvestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Status</p>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Supply Chain Steps</p>
                        <p className="font-bold text-lg">{product.blocks.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="card-gradient shadow-soft">
                <CardHeader>
                  <CardTitle className="text-center">Product QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <QRCode value={product.qrCode} size={200} />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Product ID</p>
                    <p className="font-mono text-xs break-all bg-muted p-2 rounded">
                      {product.id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blockchain Journey Visualization */}
            <Card className="shadow-blockchain">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blockchain" />
                  Blockchain Journey ({product.blocks.length} blocks)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.blocks.map((block, index) => (
                    <div key={block.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-8 h-8 bg-blockchain text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold capitalize">{block.stage}</h4>
                          <Badge variant="outline" className="text-xs font-mono">
                            {block.hash.slice(0, 8)}...
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>📍 {block.location}</div>
                          <div>🏢 {block.stakeholder}</div>
                          <div>⏰ {new Date(block.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results State */}
        {!product && (
          <Card className="card-gradient max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">Enter Product Details Above</h3>
              <p className="text-muted-foreground mb-6">
                Use the search form to track any product in the AgriChain network
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-success" />
                  <p className="font-semibold">Authentic</p>
                  <p className="text-muted-foreground">Verified origin</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-blockchain" />
                  <p className="font-semibold">Secure</p>
                  <p className="text-muted-foreground">Blockchain protected</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Search className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">Traceable</p>
                  <p className="text-muted-foreground">Full journey visible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrackPage;