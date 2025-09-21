import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QRCode } from "@/components/ui/qr-code";
import { Store, Package, ShoppingCart, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { blockchain, Product } from "@/lib/blockchain";
import { toast } from "@/hooks/use-toast";

const RetailerPage = () => {
  const [products] = useState<Product[]>(blockchain.getAllProducts().filter(p => p.status === "in-transit" || p.status === "retail"));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  
  const [receiveData, setReceiveData] = useState({
    retailPrice: "",
    storeLocation: "ABC SuperMart, Delhi",
    storageConditions: "",
    qualityCheck: "passed"
  });

  const [sellData, setSellData] = useState({
    soldPrice: "",
    customerInfo: "",
    paymentMethod: "cash"
  });

  const handleReceive = (product: Product) => {
    setSelectedProduct(product);
    setReceiveData({
      retailPrice: (product.currentPrice * 1.3).toFixed(2), // 30% markup
      storeLocation: "ABC SuperMart, Delhi",
      storageConditions: "Room temperature, dry storage",
      qualityCheck: "passed"
    });
    setShowReceiveForm(true);
  };

  const handleSell = (product: Product) => {
    setSelectedProduct(product);
    setSellData({
      soldPrice: receiveData.retailPrice || (product.currentPrice * 1.3).toFixed(2),
      customerInfo: "",
      paymentMethod: "cash"
    });
    setShowSellForm(true);
  };

  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;

    try {
      const success = blockchain.updateProduct(
        selectedProduct.id,
        "retail",
        {
          action: "received_at_store",
          retailPrice: parseFloat(receiveData.retailPrice),
          storeLocation: receiveData.storeLocation,
          storageConditions: receiveData.storageConditions,
          qualityCheck: receiveData.qualityCheck,
          receivedDate: new Date().toISOString()
        },
        "ABC SuperMart",
        receiveData.storeLocation,
        parseFloat(receiveData.retailPrice)
      );

      if (success) {
        setShowReceiveForm(false);
        setSelectedProduct(null);
        toast({
          title: "Product Received!",
          description: `${selectedProduct.name} is now available in store.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product information.",
        variant: "destructive"
      });
    }
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;

    try {
      const success = blockchain.updateProduct(
        selectedProduct.id,
        "consumer",
        {
          action: "sold_to_consumer",
          soldPrice: parseFloat(sellData.soldPrice),
          customerInfo: sellData.customerInfo,
          paymentMethod: sellData.paymentMethod,
          soldDate: new Date().toISOString()
        },
        "ABC SuperMart",
        receiveData.storeLocation,
        parseFloat(sellData.soldPrice)
      );

      if (success) {
        setShowSellForm(false);
        setSelectedProduct(null);
        toast({
          title: "Sale Completed!",
          description: `${selectedProduct.name} has been sold successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete sale.",
        variant: "destructive"
      });
    }
  };

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

  const incomingProducts = products.filter(p => p.status === "in-transit");
  const retailProducts = products.filter(p => p.status === "retail");
  const totalRevenue = products.filter(p => p.status === "sold").reduce((sum, p) => sum + (p.currentPrice * p.quantity * 1.3), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
            <Store className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Retailer Dashboard</h1>
            <p className="text-muted-foreground">Manage inventory and sales in your store</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Incoming Products</p>
                  <p className="text-2xl font-bold text-blockchain">{incomingProducts.length}</p>
                </div>
                <Package className="w-8 h-8 text-blockchain" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold text-warning">{retailProducts.length}</p>
                </div>
                <Store className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue (₹)</p>
                  <p className="text-2xl font-bold text-success">{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold text-primary">30%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receive Form */}
        {showReceiveForm && selectedProduct && (
          <Card className="mb-8 shadow-blockchain">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Receive Product - {selectedProduct.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReceiveSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="retailPrice">Retail Price (₹) *</Label>
                  <Input
                    id="retailPrice"
                    type="number"
                    step="0.01"
                    value={receiveData.retailPrice}
                    onChange={(e) => setReceiveData({...receiveData, retailPrice: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="storeLocation">Store Location *</Label>
                  <Input
                    id="storeLocation"
                    value={receiveData.storeLocation}
                    onChange={(e) => setReceiveData({...receiveData, storeLocation: e.target.value})}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="storageConditions">Storage Conditions</Label>
                  <Input
                    id="storageConditions"
                    value={receiveData.storageConditions}
                    onChange={(e) => setReceiveData({...receiveData, storageConditions: e.target.value})}
                    placeholder="Room temperature, dry storage"
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <Button type="submit" className="bg-warning hover:bg-warning/90 text-foreground">
                    Receive Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowReceiveForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sell Form */}
        {showSellForm && selectedProduct && (
          <Card className="mb-8 shadow-blockchain">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Sell Product - {selectedProduct.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSellSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="soldPrice">Selling Price (₹) *</Label>
                  <Input
                    id="soldPrice"
                    type="number"
                    step="0.01"
                    value={sellData.soldPrice}
                    onChange={(e) => setSellData({...sellData, soldPrice: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select 
                    className="w-full p-2 border border-border rounded-md"
                    value={sellData.paymentMethod}
                    onChange={(e) => setSellData({...sellData, paymentMethod: e.target.value})}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="customerInfo">Customer Information (Optional)</Label>
                  <Input
                    id="customerInfo"
                    value={sellData.customerInfo}
                    onChange={(e) => setSellData({...sellData, customerInfo: e.target.value})}
                    placeholder="Customer name or phone number"
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <Button type="submit" className="bg-success hover:bg-success/90">
                    Complete Sale
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowSellForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Incoming Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Incoming Products</h2>
          
          {incomingProducts.length === 0 ? (
            <Card className="card-gradient">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Incoming Products</h3>
                <p className="text-muted-foreground">No products are currently in transit to your store</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {incomingProducts.map((product) => (
                <Card key={product.id} className="card-gradient shadow-soft hover:shadow-blockchain transition-smooth">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{product.variety}</p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        IN TRANSIT
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{product.quantity} {product.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wholesale Price</p>
                        <p className="font-semibold">₹{product.currentPrice}/{product.unit}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleReceive(product)} 
                        className="w-full bg-warning hover:bg-warning/90 text-foreground"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Receive in Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Products in Store */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Products in Store</h2>
          
          {retailProducts.length === 0 ? (
            <Card className="card-gradient">
              <CardContent className="p-12 text-center">
                <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Products in Stock</h3>
                <p className="text-muted-foreground">Receive incoming products to build your inventory</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {retailProducts.map((product) => (
                <Card key={product.id} className="card-gradient shadow-soft hover:shadow-blockchain transition-smooth">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Store className="w-5 h-5" />
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{product.variety}</p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        IN STOCK
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{product.quantity} {product.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Retail Price</p>
                        <p className="font-semibold text-success">₹{(product.currentPrice * 1.3).toFixed(2)}/{product.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Customer QR Code</p>
                        <QRCode value={product.qrCode} size={60} />
                      </div>
                      
                      <Button 
                        onClick={() => handleSell(product)} 
                        className="bg-success hover:bg-success/90"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Sell Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetailerPage;