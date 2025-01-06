import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ArticleDetailsProps {
  title: string;
  setTitle: (title: string) => void;
  abstract: string;
  setAbstract: (abstract: string) => void;
  errors?: { [key: string]: string };
}

export const ArticleDetails = ({
  title,
  setTitle,
  abstract,
  setAbstract,
  errors
}: ArticleDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700">
          Titre
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full ${errors?.title ? 'border-red-500' : ''}`}
          placeholder="Entrez le titre de votre article"
          required
        />
        {errors?.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="abstract" className="block text-sm font-medium mb-1 text-gray-700">
          Résumé
        </label>
        <Textarea
          id="abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          className={`w-full min-h-[150px] ${errors?.abstract ? 'border-red-500' : ''}`}
          placeholder="Entrez le résumé de votre article"
          required
        />
        {errors?.abstract && (
          <p className="mt-1 text-sm text-red-500">{errors.abstract}</p>
        )}
      </div>
    </div>
  );
};