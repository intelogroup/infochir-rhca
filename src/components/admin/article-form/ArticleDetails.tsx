
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { ArticleInformationSection } from "./sections/ArticleInformationSection";
import { AuthorInformationSection } from "./sections/AuthorInformationSection";
import { PublicationDetailsSection } from "./sections/PublicationDetailsSection";
import { TagsAndKeywordsSection } from "./sections/TagsAndKeywordsSection";
import { AdditionalInformationSection } from "./sections/AdditionalInformationSection";

interface ArticleDetailsProps {
  form: UseFormReturn<ArticleFormData>;
}

export const ArticleDetails = ({ form }: ArticleDetailsProps) => {
  return (
    <div className="space-y-8">
      <ArticleInformationSection form={form} />
      <AuthorInformationSection form={form} />
      <PublicationDetailsSection form={form} />
      <TagsAndKeywordsSection form={form} />
      <AdditionalInformationSection form={form} />
    </div>
  );
};
