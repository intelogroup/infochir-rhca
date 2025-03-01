
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { products } from "./products/ProductsData";

export const ProductsSection = () => (
  <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-5" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    
    <div className="max-w-7xl mx-auto relative">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
            className="perspective-1000"
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
