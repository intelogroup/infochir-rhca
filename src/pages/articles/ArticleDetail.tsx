
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';

// Fix the ArticleDetail component by providing location key
const ArticleDetail = () => {
  const { articleId } = useParams();
  
  // Use with default path-based key
  useScrollToTop();

  // Content fade-in animation
  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={articleId}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
        >
          {/* Article detail content */}
        </motion.div>
      </AnimatePresence>
    </LazyMotion>
  );
};

export default ArticleDetail;
