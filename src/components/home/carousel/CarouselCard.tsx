import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { Highlight } from "./carouselData";
import { ChevronDown, ChevronUp, Eye, Quote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CarouselCardProps {
  highlight: Highlight;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-2 h-full"
    >
      <div className="relative group h-full rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={highlight.image}
            alt={highlight.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
            {highlight.category}
          </Badge>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {highlight.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {highlight.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            {highlight.date && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {highlight.date}
              </span>
            )}
            {highlight.author && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {highlight.author}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary/80"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Voir moins <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                En savoir plus <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        <span>{highlight.views} vues</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Quote className="h-4 w-4 text-primary" />
                        <span>{highlight.citations} citations</span>
                      </div>
                    </div>

                    {highlight.extendedContent && (
                      <div className="prose prose-sm max-w-none">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Points clés
                        </h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {highlight.extendedContent.keyPoints.map((point, idx) => (
                            <li key={idx} className="text-gray-600">
                              {point}
                            </li>
                          ))}
                        </ul>
                        {highlight.extendedContent.conclusion && (
                          <>
                            <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                              Conclusion
                            </h4>
                            <p className="text-gray-600">
                              {highlight.extendedContent.conclusion}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};