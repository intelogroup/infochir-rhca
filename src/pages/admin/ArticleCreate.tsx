import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { ArticleForm } from "@/components/admin/ArticleForm";

const ArticleCreate = () => {
  const navigate = useNavigate();

  // After successful creation, the form will show a toast and reset itself
  // The user can navigate back manually or we can add a callback

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Créer un nouvel article" 
        description="Ajouter un article à la base de données"
        backLink="/admin/content"
      />
      
      <div className="max-w-4xl">
        <ArticleForm />
      </div>
    </div>
  );
};

export default ArticleCreate;
