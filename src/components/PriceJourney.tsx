import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Product } from "@/lib/blockchain";

interface PriceJourneyProps {
  product: Product;
  className?: string;
}

const PriceJourney = ({ product, className = "" }: PriceJourneyProps) => {
  const priceSteps = product.blocks.map((block, index) => ({
    stage: block.stage,
    price: block.price,
    priceChange: block.priceChange,
    timestamp: block.timestamp,
    stakeholder: block.stakeholder,
    location: block.location
  }));

  const totalPriceIncrease = product.currentPrice - product.farmPrice;
  const percentageIncrease = ((totalPriceIncrease / product.farmPrice) * 100).toFixed(1);

  const getStageIcon = (stage: string) => {
    const icons = {
      farm: "🌾",
      transport: "🚚", 
      warehouse: "🏪",
      retail: "🏬",
      consumer: "👥"
    };
    return icons[stage as keyof typeof icons] || "📦";
  };

  const getStageName = (stage: string) => {
    const names = {
      farm: "Farm",
      transport: "Transport",
      warehouse: "Warehouse",
      retail: "Retail Store",
      consumer: "Consumer"
    };
    return names[stage as keyof typeof names] || stage;
  };

  return (
    <Card className={`shadow-soft ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-success" />
          Price Transparency Journey
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-muted-foreground">
            Total Price Change: 
          </div>
          <Badge className={`${totalPriceIncrease > 0 ? 'bg-warning text-white' : 'bg-success text-white'}`}>
            {totalPriceIncrease > 0 ? '+' : ''}{product.currency}{totalPriceIncrease.toFixed(2)} ({percentageIncrease}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceSteps.map((step, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getStageIcon(step.stage)}</div>
                <div>
                  <h4 className="font-semibold">{getStageName(step.stage)}</h4>
                  <p className="text-sm text-muted-foreground">{step.stakeholder}</p>
                  <p className="text-xs text-muted-foreground">{step.location}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg">{product.currency}{step.price.toFixed(2)}</div>
                {step.priceChange !== 0 && (
                  <div className={`flex items-center gap-1 text-sm ${
                    step.priceChange > 0 ? 'text-warning' : 'text-success'
                  }`}>
                    {step.priceChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {step.priceChange > 0 ? '+' : ''}{step.priceChange.toFixed(2)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {new Date(step.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center justify-between text-success">
            <span className="font-semibold">Fair Trade Impact:</span>
            <span className="text-sm">
              Farmer receives {((product.farmPrice / product.currentPrice) * 100).toFixed(1)}% of final price
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceJourney;