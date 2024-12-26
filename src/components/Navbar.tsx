import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileMenu } from "./ProfileMenu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Navbar:", event, session?.user?.email);
      setIsAuthenticated(!!session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const navItems = [
    { 
      name: "RHCA", 
      href: "/rhca",
      description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie"
    },
    { 
      name: "Index Medicus", 
      href: "/index-medicus",
      description: "Base de données médicale"
    },
    { 
      name: "Atlas", 
      href: "/adc",
      description: "Atlas de Diagnostic Chirurgical"
    },
    { 
      name: "IGM", 
      href: "/igm",
      description: "Informations Générales Médicales"
    },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img 
                src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                alt="Info Chir Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-bold hidden sm:block">
                INFOCHIR
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center justify-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center">
                <ProfileMenu />
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 p-2 rounded-lg hover:bg-gray-100/50 transition-colors duration-200"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/50 animate-fade-up">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors duration-200 flex flex-col"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">{item.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};