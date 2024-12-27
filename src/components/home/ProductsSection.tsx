import { ProductCard } from "@/components/ProductCard";
import { BookOpen, Database, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  { 
    title: "RHCA", 
    description: "Publiez vos articles scientifiques et contribuez à l'avancement des connaissances en chirurgie et anesthésiologie",
    href: "/rhca",
    icon: BookOpen,
    logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
  },
  {
    title: "IGM",
    description: "Restez informé des dernières nouvelles et évolutions du domaine médical avec notre gazette médicale",
    href: "/igm",
    icon: Newspaper,
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
  },
  {
    title: "Atlas ADC",
    description: "Explorez une base visuelle unique de diagnostics chirurgicaux pour faciliter vos pratiques cliniques",
    href: "/adc",
    icon: BookOpen,
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
  },
  {
    title: "Index Medicus",
    description: "Accédez à une vaste base de données de références médicales organisées par auteur et thème",
    href: "/index-medicus",
    icon: Database,
    logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
  }
];

export const ProductsSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">
            Nos Produits
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos ressources complètes pour la communauté médicale
          </p>
        </motion.div>
        
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
};