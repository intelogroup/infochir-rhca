import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { products } from "./products/ProductsData";
import { SectionHeading } from "./SectionHeading";

export const ProductsSection = () => (
  <section className="section border-t border-border bg-background px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Collections"
        title="Quatre publications, un seul point d'accès"
        description="Chaque collection est archivée intégralement : consultez en ligne, téléchargez le PDF, citez la référence."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 auto-rows-fr">
        {products.map((product, index) => (
          <motion.div 
            key={product.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.06,
              ease: [0.4, 0, 0.2, 1]
            }}
            viewport={{ once: true }}
            className="h-full"
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
