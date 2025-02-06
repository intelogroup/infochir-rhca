
import { motion } from "framer-motion";

const heartBubbles = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const bubble = {
  hidden: { 
    opacity: 0,
    y: 0,
    scale: 0.5
  },
  visible: {
    opacity: [0, 1, 0],
    y: -30,
    scale: [0.5, 1.2, 0.5],
    transition: {
      duration: 0.8,
      repeat: 0,
    }
  }
};

interface AnimatedHeartBubblesProps {
  animationKey: number;
  isAnimating: boolean;
}

export const AnimatedHeartBubbles = ({ animationKey, isAnimating }: AnimatedHeartBubblesProps) => {
  return (
    <motion.div
      key={animationKey}
      initial="hidden"
      animate={isAnimating ? "visible" : "hidden"}
      variants={heartBubbles}
      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full pointer-events-none"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          variants={bubble}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translateZ(${Math.random() * 50}px)`
          }}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea384c] fill-[#ea384c]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
};
