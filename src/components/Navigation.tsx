import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Leaf, Shield, Truck, Store, User, Home } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/farmer", label: "Farmer", icon: Leaf },
    { path: "/distributor", label: "Distributor", icon: Truck },
    { path: "/retailer", label: "Retailer", icon: Store },
    { path: "/consumer", label: "Consumer", icon: User },
    { path: "/track", label: "Track", icon: Shield },
  ];

  const NavLink = ({ path, label, icon: Icon, mobile = false }: any) => (
    <Link
      to={path}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth ${
        location.pathname === path
          ? "bg-primary text-primary-foreground shadow-soft"
          : "hover:bg-primary/10 text-foreground"
      } ${mobile ? "w-full" : ""}`}
      onClick={() => setIsOpen(false)}
    >
      <Icon size={18} />
      <span className={mobile ? "block" : "hidden lg:block"}>{label}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 blockchain-gradient rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block">AgriChain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <NavLink key={item.path} {...item} mobile />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;