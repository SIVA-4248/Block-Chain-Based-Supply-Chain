import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { QRCode } from "@/components/ui/qr-code";
import { Leaf, Plus, Package, MapPin, Calendar, Weight } from "lucide-react";
import { blockchain, Product } from "@/lib/blockchain";
import { toast } from "@/hooks/use-toast";

const FarmerPage = () => {
  const [products, setProducts] = useState<Product[]>(blockchain.getProductsByFarmer("Ramesh Kumar"));
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    quantity: "",
    unit: "kg",
    harvestDate: "",
    farmer: "Ramesh Kumar",
    farmerLocation: "Punjab, India",
    currentPrice: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newProduct = blockchain.addProduct({
        name: formData.name,
        variety: formData.variety,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        harvestDate: formData.harvestDate,
        farmer: formData.farmer,
        farmerLocation: formData.farmerLocation,
        status: "harvested" as const,
        farmPrice: parseFloat(formData.currentPrice),
        currentPrice: parseFloat(formData.currentPrice),
        currency: "₹",
        category: "grains",
        organicCertified: true
      });

      setProducts([...products, newProduct]);
      setShowAddForm(false);
      setFormData({
        name: "",
        variety: "",
        quantity: "",
        unit: "kg",
        harvestDate: "",
        farmer: "Ramesh Kumar",
        farmerLocation: "Punjab, India",
        currentPrice: ""
      });

      toast({
        title: "Product Added Successfully!",
        description: `${newProduct.name} has been registered on the blockchain.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Manage your agricultural produce on the blockchain</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-primary">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Shipments</p>
                  <p className="text-2xl font-bold text-blockchain">
                    {products.filter(p => p.status === "in-transit").length}
                  </p>
                </div>
                <Leaf className="w-8 h-8 text-blockchain" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue (₹)</p>
                  <p className="text-2xl font-bold text-success">
                    {products.reduce((sum, p) => sum + (p.status === "sold" ? p.currentPrice * p.quantity : 0), 0).toLocaleString()}
                  </p>
                </div>
                <Weight className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6 text-center">
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="w-full bg-success hover:bg-success/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="mb-8 shadow-blockchain">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Register New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Basmati Rice"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="variety">Variety *</Label>
                  <Input
                    id="variety"
                    value={formData.variety}
                    onChange={(e) => setFormData({...formData, variety: e.target.value})}
                    placeholder="e.g., Pusa Basmati 1121"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      placeholder="1000"
                      required
                    />
                    <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="tons">tons</SelectItem>
                        <SelectItem value="quintals">quintals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Price per unit (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                    placeholder="45.50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    value={formData.farmerLocation}
                    onChange={(e) => setFormData({...formData, farmerLocation: e.target.value})}
                    placeholder="Punjab, India"
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <Button type="submit" className="bg-success hover:bg-success/90">
                    Register Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Products</h2>
          
          {products.length === 0 ? (
            <Card className="card-gradient">
              <CardContent className="p-12 text-center">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first agricultural product to the blockchain</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-success hover:bg-success/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => (
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
                        {product.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Weight className="w-4 h-4 text-muted-foreground" />
                        <span>{product.quantity} {product.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{product.farmerLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-success">₹{product.currentPrice}/{product.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">QR Code for Tracking</p>
                        <QRCode value={product.qrCode} size={80} />
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Product ID</p>
                        <p className="font-mono text-sm">{product.id.slice(-8)}</p>
                        <p className="text-xs text-muted-foreground mt-2">Blocks: {product.blocks.length}</p>
                      </div>
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

export default FarmerPage;