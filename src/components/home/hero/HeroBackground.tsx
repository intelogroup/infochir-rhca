import { motion, AnimatePresence } from "framer-motion";

interface HeroBackgroundProps {
  currentIndex: number;
  images: string[];
  gradients: string[];
}

export const HeroBackground = ({ currentIndex, images, gradients }: HeroBackgroundProps) => {
  return (
    <AnimatePresence mode="wait">
      <div key={currentIndex} className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[currentIndex]} opacity-90`} />
        <motion.div 
          className="absolute bottom-0 right-0 w-1/2 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ 
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: 'contain',
            backgroundPosition: 'right bottom',
            backgroundRepeat: 'no-repeat',
            opacity: 0.9,
            right: '10px',
            paddingLeft: '5px'
          }}
        />
      </div>
    </AnimatePresence>
  );
};