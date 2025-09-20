import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Package, Thermometer, Droplets, MapPin, Clock } from "lucide-react";
import { blockchain, Product } from "@/lib/blockchain";
import { toast } from "@/hooks/use-toast";

const DistributorPage = () => {
  const [products] = useState<Product[]>(blockchain.getAllProducts().filter(p => p.status === "harvested" || p.status === "in-transit"));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  const [updateData, setUpdateData] = useState({
    action: "",
    vehicle: "",
    driver: "",
    temperature: "",
    humidity: "",
    location: "",
    notes: ""
  });

  const handlePickup = (product: Product) => {
    setSelectedProduct(product);
    setUpdateData({
      action: "pickup",
      vehicle: "",
      driver: "",
      temperature: "25",
      humidity: "65",
      location: "",
      notes: ""
    });
    setShowUpdateForm(true);
  };

  const handleDelivery = (product: Product) => {
    setSelectedProduct(product);
    setUpdateData({
      action: "delivery",
      vehicle: "",
      driver: "",
      temperature: "24",
      humidity: "60",
      location: "",
      notes: ""
    });
    setShowUpdateForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;

    try {
      const success = blockchain.updateProduct(
        selectedProduct.id,
        "transport",
        {
          action: updateData.action,
          vehicle: updateData.vehicle,
          driver: updateData.driver,
          temperature: `${updateData.temperature}°C`,
          humidity: `${updateData.humidity}%`,
          notes: updateData.notes,
          timestamp: new Date().toISOString()
        },
        "Green Valley Logistics",
        updateData.location
      );

      if (success) {
        setShowUpdateForm(false);
        setSelectedProduct(null);
        toast({
          title: "Update Successful!",
          description: `${updateData.action} information has been added to the blockchain.`,
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

  const inTransitProducts = products.filter(p => p.status === "in-transit");
  const availableProducts = products.filter(p => p.status === "harvested");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blockchain rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Distributor Dashboard</h1>
            <p className="text-muted-foreground">Manage transportation and cold chain logistics</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Shipments</p>
                  <p className="text-2xl font-bold text-blockchain">{inTransitProducts.length}</p>
                </div>
                <Truck className="w-8 h-8 text-blockchain" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Pickups</p>
                  <p className="text-2xl font-bold text-success">{availableProducts.length}</p>
                </div>
                <Package className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Temperature</p>
                  <p className="text-2xl font-bold text-accent">24°C</p>
                </div>
                <Thermometer className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-primary">98%</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Update Form */}
        {showUpdateForm && selectedProduct && (
          <Card className="mb-8 shadow-blockchain">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Update Transport Information - {selectedProduct.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vehicle">Vehicle Number *</Label>
                  <Input
                    id="vehicle"
                    value={updateData.vehicle}
                    onChange={(e) => setUpdateData({...updateData, vehicle: e.target.value})}
                    placeholder="TN-09-AB-1234"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="driver">Driver Name *</Label>
                  <Input
                    id="driver"
                    value={updateData.driver}
                    onChange={(e) => setUpdateData({...updateData, driver: e.target.value})}
                    placeholder="Suresh Singh"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="temperature">Temperature (°C) *</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={updateData.temperature}
                    onChange={(e) => setUpdateData({...updateData, temperature: e.target.value})}
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="humidity">Humidity (%) *</Label>
                  <Input
                    id="humidity"
                    type="number"
                    value={updateData.humidity}
                    onChange={(e) => setUpdateData({...updateData, humidity: e.target.value})}
                    placeholder="65"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="location">Current Location *</Label>
                  <Input
                    id="location"
                    value={updateData.location}
                    onChange={(e) => setUpdateData({...updateData, location: e.target.value})}
                    placeholder="Highway NH-1, Punjab"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                    placeholder="Any additional information about the shipment..."
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <Button type="submit" className="bg-blockchain hover:bg-blockchain/90">
                    Update Transport Info
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowUpdateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Available for Pickup */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available for Pickup</h2>
          
          {availableProducts.length === 0 ? (
            <Card className="card-gradient">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Products Available</h3>
                <p className="text-muted-foreground">All products are currently in transit or delivered</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableProducts.map((product) => (
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
                        {product.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{product.quantity} {product.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{product.farmerLocation}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handlePickup(product)} 
                        className="w-full bg-blockchain hover:bg-blockchain/90"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Schedule Pickup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* In Transit Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Products in Transit</h2>
          
          {inTransitProducts.length === 0 ? (
            <Card className="card-gradient">
              <CardContent className="p-12 text-center">
                <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Active Shipments</h3>
                <p className="text-muted-foreground">No products are currently in transit</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inTransitProducts.map((product) => (
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
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-muted-foreground" />
                        <span>25°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-muted-foreground" />
                        <span>65% humidity</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleDelivery(product)} 
                        variant="outline"
                        className="w-full"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Update Delivery Status
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

export default DistributorPage;