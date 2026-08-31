
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { products } from "./products/ProductsData";

export const ProductsSection = () => (
  <section className="section border-t border-border bg-background px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 max-w-2xl">
        <p className="type-eyebrow mb-3">Nos publications</p>
        <h2 className="type-h1 text-foreground">
          Accédez aux différentes revues d'INFOCHIR/RHCA
        </h2>
        <div className="rule-gold mt-5" />
      </div>
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 auto-rows-fr">
        {products.map((product, index) => (
          <motion.div 
            key={product.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.4, 0, 0.2, 1]
            }}
            viewport={{ once: true }}
            className="perspective-1000 h-full"
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
