import { BookOpen, Database, Newspaper } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/config/navigation";
import { useNavigate } from "react-router-dom";

export const ProductsSection = () => {
  const navigate = useNavigate();
  const icons = { BookOpen, Database, Newspaper };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos ressources complètes pour la communauté médicale
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.title} 
              className="animate-fade-up cursor-pointer" 
              style={{ animationDelay: '100ms' }}
              onClick={() => navigate(product.href)}
            >
              <ProductCard {...product} icon={icons[product.icon as keyof typeof icons]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};