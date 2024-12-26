import { BookOpen, Database, Newspaper } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/config/navigation";
import { useNavigate } from "react-router-dom";

const icons = {
  BookOpen,
  Database,
  Newspaper,
} as const;

export const ProductsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent mb-6">
            Nos Produits
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos ressources complètes pour la communauté médicale
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {products.map((product, index) => (
            <div 
              key={product.title} 
              className="animate-fade-up" 
              style={{ 
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'backwards'
              }}
              onClick={() => navigate(product.href)}
            >
              <ProductCard 
                {...product} 
                icon={icons[product.icon]} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};