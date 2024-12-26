import { Link } from "react-router-dom";

export const Logo = () => (
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
);