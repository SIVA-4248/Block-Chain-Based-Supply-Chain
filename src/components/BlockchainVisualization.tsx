import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Link as LinkIcon, CheckCircle, Clock } from "lucide-react";
import { BlockData } from "@/lib/blockchain";

interface BlockchainVisualizationProps {
  blocks: BlockData[];
  className?: string;
}

const BlockchainVisualization = ({ blocks, className = "" }: BlockchainVisualizationProps) => {
  const getStageColor = (stage: BlockData["stage"]) => {
    const colors = {
      farm: "bg-success",
      transport: "bg-blockchain",
      warehouse: "bg-accent",
      retail: "bg-warning",
      consumer: "bg-primary"
    };
    return colors[stage] || "bg-muted";
  };

  const getStageName = (stage: BlockData["stage"]) => {
    const names = {
      farm: "Farm",
      transport: "Transport",
      warehouse: "Warehouse", 
      retail: "Retail",
      consumer: "Consumer"
    };
    return names[stage] || stage;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blockchain" />
        <h3 className="font-bold">Blockchain Trail</h3>
        <Badge variant="outline" className="text-xs">
          {blocks.length} blocks
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {blocks.map((block, index) => (
          <div key={block.id} className="flex items-center">
            {/* Block */}
            <Card className="shadow-soft hover:shadow-blockchain transition-smooth blockchain-pulse">
              <CardContent className="p-3">
                <div className={`w-12 h-12 ${getStageColor(block.stage)} rounded-lg flex items-center justify-center mb-2`}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold">{getStageName(block.stage)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(block.timestamp).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Shield className="w-3 h-3 text-blockchain" />
                    <span className="text-xs font-mono">{block.hash.slice(0, 6)}...</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connection Line */}
            {index < blocks.length - 1 && (
              <div className="flex items-center mx-2">
                <LinkIcon className="w-4 h-4 text-blockchain rotate-90" />
                <div className="w-6 h-0.5 bg-blockchain"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
          <CheckCircle className="w-4 h-4" />
          Blockchain Verified & Immutable
        </div>
      </div>
    </div>
  );
};

export default BlockchainVisualization;