import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';

// Fix the ArticleDetail component by providing location key
const ArticleDetail = () => {
  const { articleId } = useParams();
  
  // Use with default path-based key
  useScrollToTop();

  // Rest of component...
  return (
    <div>
      {/* Article detail content */}
    </div>
  );
};

export default ArticleDetail;
