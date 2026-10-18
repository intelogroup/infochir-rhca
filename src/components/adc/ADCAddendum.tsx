import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookMarked } from "lucide-react";

/**
 * ADDENDUM section requested by the InfoChir secretariat (ADCH v2,
 * 2026-10-17): three supplementary chapters that sit outside the
 * 24-chapter Sommaire. None of them has a file yet; "Éthique en
 * chirurgie" is explicitly in preparation in the secretariat's note.
 */
const ADDENDUM_CHAPTERS = [
  { title: "Transplantation", inPreparation: false },
  { title: "Recherche chirurgicale", inPreparation: false },
  { title: "Éthique en chirurgie", inPreparation: true },
];

export const ADCAddendum = () => (
  <section id="adc-addendum" className="mt-12">
    <div className="flex items-center gap-2 mb-4">
      <BookMarked className="h-5 w-5 text-secondary" />
      <h2 className="text-xl sm:text-2xl font-bold text-secondary">Addendum</h2>
    </div>
    <p className="text-sm text-muted-foreground mb-6">
      Chapitres supplémentaires de l'Atlas de Diagnostic Chirurgical en Haïti
      (ADCH), en complément des vingt-quatre chapitres du sommaire.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ADDENDUM_CHAPTERS.map((chapter) => (
        <Card key={chapter.title}>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg">{chapter.title}</h3>
            {chapter.inPreparation && (
              <Badge
                variant="secondary"
                className="mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5"
              >
                En préparation
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default ADCAddendum;
