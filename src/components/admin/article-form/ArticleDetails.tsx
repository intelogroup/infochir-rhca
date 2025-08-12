
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { ArticleInformationSection } from "./sections/ArticleInformationSection";
import { SimplifiedAuthorSection } from "./sections/SimplifiedAuthorSection";
import { SimplifiedTagsSection } from "./sections/SimplifiedTagsSection";
import { AdvancedDetailsSection } from "./sections/AdvancedDetailsSection";

interface ArticleDetailsProps {
  form: UseFormReturn<ArticleFormData>;
}

export const ArticleDetails = ({ form }: ArticleDetailsProps) => {
  return (
    <div className="space-y-8">
      <ArticleInformationSection form={form} />
      <SimplifiedAuthorSection form={form} />
      <SimplifiedTagsSection form={form} />
      <AdvancedDetailsSection form={form} />
    </div>
  );
};
