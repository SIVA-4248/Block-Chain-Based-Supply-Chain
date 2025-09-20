// Simulated Blockchain for Agricultural Supply Chain

export interface BlockData {
  id: string;
  productId: string;
  timestamp: number;
  stage: "farm" | "transport" | "warehouse" | "retail" | "consumer";
  data: any;
  stakeholder: string;
  location: string;
  previousHash: string;
  hash: string;
}

export interface Product {
  id: string;
  name: string;
  variety: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  farmer: string;
  farmerLocation: string;
  status: "harvested" | "in-transit" | "warehoused" | "retail" | "sold";
  currentPrice: number;
  qrCode: string;
  blocks: BlockData[];
}

// Simple hash function for demonstration
const simpleHash = (data: string): string => {
  let hash = 0;
  if (data.length === 0) return hash.toString();
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

export class AgriBlockchain {
  private static instance: AgriBlockchain;
  private products: Map<string, Product> = new Map();
  private genesisHash = "0";

  static getInstance(): AgriBlockchain {
    if (!AgriBlockchain.instance) {
      AgriBlockchain.instance = new AgriBlockchain();
      AgriBlockchain.instance.initializeSampleData();
    }
    return AgriBlockchain.instance;
  }

  createBlock(productId: string, stage: BlockData["stage"], data: any, stakeholder: string, location: string): BlockData {
    const product = this.products.get(productId);
    const previousHash = product?.blocks.length ? product.blocks[product.blocks.length - 1].hash : this.genesisHash;
    
    const blockData: BlockData = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      timestamp: Date.now(),
      stage,
      data,
      stakeholder,
      location,
      previousHash,
      hash: ""
    };

    // Generate hash
    const hashInput = JSON.stringify({
      productId: blockData.productId,
      timestamp: blockData.timestamp,
      stage: blockData.stage,
      data: blockData.data,
      stakeholder: blockData.stakeholder,
      location: blockData.location,
      previousHash: blockData.previousHash
    });
    
    blockData.hash = simpleHash(hashInput);
    return blockData;
  }

  addProduct(product: Omit<Product, "id" | "qrCode" | "blocks">): Product {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCode = `https://agrichain.app/track/${id}`;
    
    const newProduct: Product = {
      ...product,
      id,
      qrCode,
      blocks: []
    };

    // Create initial block for harvest
    const harvestBlock = this.createBlock(
      id,
      "farm",
      {
        action: "harvested",
        variety: product.variety,
        quantity: product.quantity,
        unit: product.unit,
        quality: "A-Grade",
        organicCertified: true
      },
      product.farmer,
      product.farmerLocation
    );

    newProduct.blocks.push(harvestBlock);
    this.products.set(id, newProduct);
    return newProduct;
  }

  updateProduct(productId: string, stage: BlockData["stage"], data: any, stakeholder: string, location: string): boolean {
    const product = this.products.get(productId);
    if (!product) return false;

    const newBlock = this.createBlock(productId, stage, data, stakeholder, location);
    product.blocks.push(newBlock);

    // Update product status
    const statusMap = {
      farm: "harvested",
      transport: "in-transit",
      warehouse: "warehoused",
      retail: "retail",
      consumer: "sold"
    } as const;

    product.status = statusMap[stage];
    
    this.products.set(productId, product);
    return true;
  }

  getProduct(productId: string): Product | undefined {
    return this.products.get(productId);
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductsByFarmer(farmer: string): Product[] {
    return Array.from(this.products.values()).filter(p => p.farmer === farmer);
  }

  verifyBlockchain(productId: string): boolean {
    const product = this.products.get(productId);
    if (!product) return false;

    for (let i = 0; i < product.blocks.length; i++) {
      const block = product.blocks[i];
      const expectedPreviousHash = i === 0 ? this.genesisHash : product.blocks[i - 1].hash;
      
      if (block.previousHash !== expectedPreviousHash) {
        return false;
      }

      // Verify hash
      const hashInput = JSON.stringify({
        productId: block.productId,
        timestamp: block.timestamp,
        stage: block.stage,
        data: block.data,
        stakeholder: block.stakeholder,
        location: block.location,
        previousHash: block.previousHash
      });
      
      const expectedHash = simpleHash(hashInput);
      if (block.hash !== expectedHash) {
        return false;
      }
    }
    return true;
  }

  private initializeSampleData() {
    // Sample rice product
    const riceProduct = this.addProduct({
      name: "Basmati Rice",
      variety: "Pusa Basmati 1121",
      quantity: 1000,
      unit: "kg",
      harvestDate: "2024-09-15",
      farmer: "Ramesh Kumar",
      farmerLocation: "Punjab, India",
      status: "harvested",
      currentPrice: 45.50
    });

    // Add transport block
    this.updateProduct(
      riceProduct.id,
      "transport",
      {
        action: "picked_up",
        vehicle: "TN-09-AB-1234",
        driver: "Suresh Singh",
        temperature: "25°C",
        humidity: "65%"
      },
      "Green Valley Logistics",
      "Highway NH-1, Punjab"
    );

    // Sample wheat product
    const wheatProduct = this.addProduct({
      name: "Organic Wheat",
      variety: "Durum Wheat",
      quantity: 750,
      unit: "kg",
      harvestDate: "2024-09-12",
      farmer: "Priya Sharma",
      farmerLocation: "Haryana, India",
      status: "harvested",
      currentPrice: 32.75
    });

    // Sample tomato product
    this.addProduct({
      name: "Fresh Tomatoes",
      variety: "Roma Tomatoes",
      quantity: 500,
      unit: "kg",
      harvestDate: "2024-09-18",
      farmer: "Arjun Patel",
      farmerLocation: "Gujarat, India",
      status: "harvested",
      currentPrice: 25.00
    });
  }
}

export const blockchain = AgriBlockchain.getInstance();