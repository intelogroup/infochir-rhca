
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Newspaper, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { DirectiveSection } from "./DirectiveSection";

export const PublicationsOverview = () => {
  return (
    <DirectiveSection title="Nos publications">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-secondary" />
              <div>
                <CardTitle className="text-lg">RHCA</CardTitle>
                <CardDescription>Revue Haïtienne de Chirurgie et d'Anesthésiologie</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Articles cliniques, expérimentaux et historiques en chirurgie et anesthésiologie.
            </p>
            <Link to="/rhca/directives">
              <Button variant="outline" size="sm" className="w-full">
                Voir les directives RHCA
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-secondary" />
              <div>
                <CardTitle className="text-lg">IGM</CardTitle>
                <CardDescription>Info Gazette Médicale</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Actualités médicales, santé publique et informations socio-culturelles.
            </p>
            <Link to="/igm/directives">
              <Button variant="outline" size="sm" className="w-full">
                Voir les directives IGM
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-secondary" />
              <div>
                <CardTitle className="text-lg">Atlas ADC</CardTitle>
                <CardDescription>Atlas de Diagnostic Chirurgical</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Documentation illustrée et guides de diagnostic chirurgical.
            </p>
            <Link to="/adc">
              <Button variant="outline" size="sm" className="w-full">
                Découvrir Atlas ADC
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DirectiveSection>
  );
};
