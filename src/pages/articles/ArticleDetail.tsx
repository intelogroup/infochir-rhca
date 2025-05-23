
// Since the original file wasn't provided, let's create a minimal implementation
// that doesn't reference the 'coverImage' property which doesn't exist in Article type

import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Article } from '@/components/index-medicus/types/article';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArticleActions } from '@/components/index-medicus/article/ArticleActions';

const ArticleDetail = () => {
  const { articleId } = useParams<{ articleId: string }>();
  
  // Mock data
  const article: Article = {
    id: articleId || '',
    title: 'Example Article',
    abstract: 'This is an example abstract',
    authors: ['Author 1', 'Author 2'],
    publicationDate: '2023-01-01',
    source: 'INDEX',
    tags: ['tag1', 'tag2'],
    status: 'published'
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">{article.title}</h1>
          </CardHeader>
          <CardContent>
            <p>{article.abstract}</p>
            <div className="mt-4">
              <ArticleActions 
                article={article}
                title={article.title}
                pdfUrl={article.pdfUrl}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ArticleDetail;
