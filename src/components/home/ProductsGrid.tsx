import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { products } from "./constants";

export const ProductsGrid = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleProductClick = async (href: string) => {
    try {
      setIsLoading(true);
      navigate(href);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Une erreur est survenue lors de la navigation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      className="py-16"
      role="region"
      aria-labelledby="products-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            id="products-title"
            className="text-3xl font-bold text-gray-900 mb-4"
            tabIndex={0}
          >
            Nos Produits
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            tabIndex={0}
          >
            Découvrez nos ressources complètes pour la communauté médicale
          </p>
        </div>
        <div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8"
          role="list"
          aria-label="Liste des produits"
        >
          {products.map((product, index) => (
            <div 
              key={product.title} 
              className="animate-fade-up" 
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => !isLoading && handleProductClick(product.href)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  !isLoading && handleProductClick(product.href);
                }
              }}
              role="listitem"
              tabIndex={0}
              aria-label={`${product.title}: ${product.description}`}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};