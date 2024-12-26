import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { products } from "./constants";
import { supabase } from "@/integrations/supabase/client";

export const ProductsGrid = () => {
  const navigate = useNavigate();

  const handleProductClick = async (href: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!session) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        navigate('/auth');
        return;
      }
      
      navigate(href);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Une erreur est survenue lors de la navigation");
    }
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Nos Produits
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez nos ressources complètes pour la communauté médicale
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <div 
            key={product.title}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleProductClick(product.href)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProductClick(product.href);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
};