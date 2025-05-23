
// No file was provided, so we need to create a new one assuming this is a minimal implementation
import React from "react";
import { useRHCAArticles } from "./hooks/useRHCAArticles";

export const RhcaContent = () => {
  const { data, isLoading, isError } = useRHCAArticles();
  
  if (isLoading) {
    return <div>Loading articles...</div>;
  }
  
  if (isError || !data) {
    return <div>Error loading articles</div>;
  }
  
  return (
    <div>
      <h2>RHCA Articles</h2>
      <div>
        {data.map((article) => (
          <div key={article.id}>{article.title}</div>
        ))}
      </div>
    </div>
  );
};
