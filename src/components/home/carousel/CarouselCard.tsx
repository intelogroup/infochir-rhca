
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CarouselModal, CarouselItem } from "./CarouselModal";

interface CarouselCardProps {
  highlight: CarouselItem;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-500";
    
    const categories: Record<string, string> = {
      "IGM": "bg-blue-500",
      "RHCA": "bg-green-500",
      "ADC": "bg-purple-500",
      "Événement": "bg-orange-500",
      "Formation": "bg-red-500"
    };
    
    return categories[category] || "bg-gray-500";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div 
          className="h-[30%] bg-cover bg-top" 
          style={{ backgroundImage: `url(${highlight.image})` }}
        >
          <div className="p-4 flex justify-between">
            {highlight.category && (
              <span className={cn("text-xs font-semibold px-2 py-1 rounded-full text-white", getCategoryColor(highlight.category))}>
                {highlight.category}
              </span>
            )}
            {highlight.date && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm">
                {highlight.date}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-xl mb-2 line-clamp-2">{highlight.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {highlight.description}
          </p>
          
          <div className="mt-auto">
            {highlight.author && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                Par {highlight.author}
              </p>
            )}
            
            <Link 
              to={highlight.link} 
              className="text-primary font-medium text-sm inline-flex items-center hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Lire la suite
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
      
      <CarouselModal
        item={highlight}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
