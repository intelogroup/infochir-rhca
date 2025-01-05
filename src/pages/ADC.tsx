import { MainLayout } from "@/components/layouts/MainLayout";
import { AtlasTableOfContents } from "@/components/atlas/AtlasTableOfContents";
import { AtlasCard } from "@/components/atlas/AtlasCard";
import { atlasChapters } from "@/components/atlas/data/atlasChapters";

const ADC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            Atlas de Diagnostic Chirurgical
          </h1>
          <p className="text-lg text-gray-700">
            Explorez notre base de données visuelle de cas chirurgicaux pour améliorer votre pratique clinique.
          </p>
        </section>

        <section className="flex justify-between items-center">
          <AtlasTableOfContents />
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {atlasChapters.map((chapter) => (
            <AtlasCard key={chapter.id} chapter={chapter} />
          ))}
        </section>
      </div>
    </MainLayout>
  );
};

export default ADC;