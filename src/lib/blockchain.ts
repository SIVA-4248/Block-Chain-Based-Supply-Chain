// Simulated Blockchain for Agricultural Supply Chain

export interface BlockData {
  id: string;
  productId: string;
  timestamp: number;
  stage: "farm" | "transport" | "warehouse" | "retail" | "consumer";
  data: any;
  stakeholder: string;
  location: string;
  price: number;
  priceChange: number;
  currency: string;
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
  farmPrice: number;
  currentPrice: number;
  currency: string;
  category: "grains" | "vegetables" | "fruits" | "dairy" | "spices";
  organicCertified: boolean;
  qrCode: string;
  blocks: BlockData[];
  farmerRevenue?: number;
  blockchainFramework: string;
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

  createBlock(productId: string, stage: BlockData["stage"], data: any, stakeholder: string, location: string, price: number = 0, priceChange: number = 0): BlockData {
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
      price,
      priceChange,
      currency: "₹",
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

  addProduct(product: Omit<Product, "id" | "qrCode" | "blocks" | "farmerRevenue" | "blockchainFramework">): Product {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCode = `https://agrichain.app/track/${id}`;
    
    const newProduct: Product = {
      ...product,
      id,
      qrCode,
      blocks: [],
      farmerRevenue: 0,
      blockchainFramework: "Hyperledger Fabric v2.4"
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
        organicCertified: product.organicCertified
      },
      product.farmer,
      product.farmerLocation,
      product.farmPrice,
      0
    );

    newProduct.blocks.push(harvestBlock);
    this.products.set(id, newProduct);
    return newProduct;
  }

  updateProduct(productId: string, stage: BlockData["stage"], data: any, stakeholder: string, location: string, price: number = 0): boolean {
    const product = this.products.get(productId);
    if (!product) return false;

    const previousPrice = product.blocks.length > 0 ? product.blocks[product.blocks.length - 1].price : 0;
    const priceChange = price - previousPrice;
    const newBlock = this.createBlock(productId, stage, data, stakeholder, location, price, priceChange);
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
    product.currentPrice = price > 0 ? price : product.currentPrice;
    
    // Update farmer revenue when product is sold
    if (stage === "consumer" || product.status === "sold") {
      const totalRevenue = product.currentPrice * product.quantity;
      const farmerShare = 0.35; // 35% goes to farmer
      product.farmerRevenue = totalRevenue * farmerShare;
    }
    
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
    // Sample rice product with complete supply chain
    const riceProduct = this.addProduct({
      name: "Basmati Rice",
      variety: "Pusa Basmati 1121",
      quantity: 1000,
      unit: "kg",
      harvestDate: "2024-09-15",
      farmer: "Ramesh Kumar",
      farmerLocation: "Punjab, India",
      status: "harvested",
      farmPrice: 28.50,
      currentPrice: 65.00,
      currency: "₹",
      category: "grains",
      organicCertified: true
    });

    // Add complete supply chain for rice
    this.updateProduct(
      riceProduct.id,
      "transport",
      {
        action: "picked_up",
        vehicle: "PB-05-AB-1234",
        driver: "Suresh Singh",
        temperature: "22°C",
        humidity: "60%",
        transitTime: "6 hours"
      },
      "Green Valley Logistics",
      "Highway NH-1, Punjab",
      32.00
    );

    this.updateProduct(
      riceProduct.id,
      "warehouse",
      {
        action: "stored",
        facility: "Cold Storage Unit A",
        temperature: "18°C",
        humidity: "55%",
        quality_check: "Passed",
        storage_duration: "2 weeks"
      },
      "Punjab Agri Storage Ltd",
      "Ludhiana, Punjab",
      38.50
    );

    this.updateProduct(
      riceProduct.id,
      "retail",
      {
        action: "received_at_store",
        store_id: "STR-001",
        batch_number: "BC-2024-091",
        shelf_life: "12 months",
        packaging: "5kg bags"
      },
      "Fresh Mart Supermarket",
      "Delhi, India",
      58.00
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
      farmPrice: 22.75,
      currentPrice: 45.50,
      currency: "₹",
      category: "grains",
      organicCertified: true
    });

    this.updateProduct(
      wheatProduct.id,
      "transport",
      {
        action: "in_transit",
        vehicle: "HR-26-CD-5678",
        driver: "Amit Kumar",
        temperature: "25°C",
        estimated_arrival: "2024-09-20"
      },
      "Haryana Transport Co",
      "Karnal-Delhi Highway",
      26.50
    );

    // Sample tomato product
    const tomatoProduct = this.addProduct({
      name: "Fresh Tomatoes",
      variety: "Roma Tomatoes",
      quantity: 500,
      unit: "kg",
      harvestDate: "2024-09-18",
      farmer: "Arjun Patel",
      farmerLocation: "Gujarat, India",
      status: "harvested",
      farmPrice: 12.00,
      currentPrice: 35.00,
      currency: "₹",
      category: "vegetables",
      organicCertified: false
    });

    this.updateProduct(
      tomatoProduct.id,
      "transport",
      {
        action: "cold_chain_transport",
        vehicle: "GJ-12-EF-9101",
        driver: "Ravi Shah",
        temperature: "8°C",
        refrigeration: "Active"
      },
      "Gujarat Fresh Logistics",
      "Ahmedabad-Mumbai Highway",
      18.50
    );

    this.updateProduct(
      tomatoProduct.id,
      "warehouse",
      {
        action: "quality_sorted",
        grade: "Premium",
        storage_temp: "6°C",
        processing_date: "2024-09-19"
      },
      "Mumbai Fresh Market",
      "Vashi, Mumbai",
      25.00
    );

    this.updateProduct(
      tomatoProduct.id,
      "retail",
      {
        action: "retail_ready",
        packaging: "1kg baskets",
        display_location: "Fresh Produce Section",
        best_before: "2024-09-25"
      },
      "Urban Fresh Store",
      "Bandra, Mumbai",
      35.00
    );

    // Sample mango product (fruits)
    const mangoProduct = this.addProduct({
      name: "Alphonso Mangoes",
      variety: "Alphonso",
      quantity: 200,
      unit: "kg",
      harvestDate: "2024-09-10",
      farmer: "Sanjay Kulkarni",
      farmerLocation: "Ratnagiri, Maharashtra",
      status: "harvested",
      farmPrice: 85.00,
      currentPrice: 150.00,
      currency: "₹",
      category: "fruits",
      organicCertified: true
    });

    this.updateProduct(
      mangoProduct.id,
      "transport",
      {
        action: "express_delivery",
        vehicle: "MH-14-GH-2345",
        driver: "Ganesh Patil",
        temperature: "12°C",
        special_handling: "Fragile fruit"
      },
      "Maharashtra Express Cargo",
      "Mumbai-Pune Highway",
      95.00
    );

    this.updateProduct(
      mangoProduct.id,
      "retail",
      {
        action: "premium_display",
        quality_grade: "Export Quality",
        ripeness: "Ready to eat",
        origin_certified: true
      },
      "Premium Fruit Palace",
      "Pune, Maharashtra",
      150.00
    );

    // Sample dairy product
    const milkProduct = this.addProduct({
      name: "Fresh Milk",
      variety: "Buffalo Milk",
      quantity: 100,
      unit: "liters",
      harvestDate: "2024-09-20",
      farmer: "Lakshmi Devi",
      farmerLocation: "Tamil Nadu, India",
      status: "harvested",
      farmPrice: 35.00,
      currentPrice: 55.00,
      currency: "₹",
      category: "dairy",
      organicCertified: true
    });

    this.updateProduct(
      milkProduct.id,
      "transport",
      {
        action: "refrigerated_transport",
        vehicle: "TN-33-IJ-6789",
        temperature: "4°C",
        processing_plant: "Tamil Nadu Dairy Co-op"
      },
      "Tamil Nadu Milk Producers",
      "Chennai, Tamil Nadu",
      42.00
    );

    this.updateProduct(
      milkProduct.id,
      "retail",
      {
        action: "pasteurized_packed",
        packaging: "1L Tetra Pack",
        expiry_date: "2024-09-27",
        fat_content: "6.5%"
      },
      "Daily Fresh Mart",
      "Chennai, Tamil Nadu",
      55.00
    );
  }
}

export const blockchain = AgriBlockchain.getInstance();