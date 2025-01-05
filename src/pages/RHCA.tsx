import { MainLayout } from "@/components/layouts/MainLayout";
import { IssueHeader } from "@/components/rhca/IssueHeader";
import { ArticleSection } from "@/components/rhca/ArticleSection";
import type { RhcaArticle } from "@/components/rhca/types";

const mockArticles: Record<string, RhcaArticle[]> = {
  "ÉDITORIAL": [
    {
      id: "1",
      title: "ÉDITORIAL",
      authors: ["Comité éditorial"],
      pageNumber: 4,
      section: "ÉDITORIAL"
    }
  ],
  "ARTICLES MÉDICAUX": [
    {
      id: "2",
      title: "Lymphadénite tuberculeuse cervicale associée à une anémie chronique, à propos d'un cas",
      authors: ["Eunice DERIVOIS MERISIER, MD et al"],
      pageNumber: 5,
      section: "ARTICLES MÉDICAUX"
    },
    {
      id: "3",
      title: "Corps étranger bronchique chez l'enfant, à propos d'un cas",
      authors: ["Patrick Marc JEAN-GILLES, MD"],
      pageNumber: 14,
      section: "ARTICLES MÉDICAUX"
    },
    {
      id: "4",
      title: "Glycation et les maladies",
      authors: ["Reynald ALTEMA, MD"],
      pageNumber: 16,
      section: "ARTICLES MÉDICAUX"
    },
    {
      id: "5",
      title: "Instabilité sociopolitique et prise en charge de la drépanocytose chez les enfants en Haïti",
      authors: ["Ronald ÉVEILLARD, MD et al"],
      pageNumber: 20,
      section: "ARTICLES MÉDICAUX"
    }
  ],
  "NEUROSCIENCES": [
    {
      id: "6",
      title: "Anatomie du cervelet/ anatomi sèvelè",
      authors: ["Hélène CLERVIUS MD, MPh et al"],
      pageNumber: 24,
      section: "NEUROSCIENCES"
    }
  ],
  "IMAGES": [
    {
      id: "7",
      title: "Paroi thoracique : côtes et sternum",
      authors: ["Louis-Franck TÉLÉMAQUE, MD, MSc"],
      pageNumber: 29,
      section: "IMAGES"
    },
    {
      id: "8",
      title: "Seins axillaires",
      authors: ["Danielle BENJAMIN, MD et al"],
      pageNumber: 34,
      section: "IMAGES"
    }
  ],
  "DOSSIERS": [
    {
      id: "9",
      title: "Formation ECHO : Importance des 3 « 95 » pour l'atteinte du contrôle de l'épidémie du VIH-SIDA d'ici 2030",
      authors: ["Ermane Robin, MD, MPH et al"],
      pageNumber: 36,
      section: "DOSSIERS"
    },
    {
      id: "10",
      title: "Gestion Intelligence artificielle révolutionne les soins de santé de la gestion de l'information médicale aux relations médecin-patient",
      authors: ["Emmanuel S. François MD, MPH"],
      pageNumber: 42,
      section: "DOSSIERS"
    },
    {
      id: "11",
      title: "Avantages de l'adoption des dossiers électroniques de santé en Haïti : une approche qualitative, sécuritaire et économique de l'informatique appliquée à la santé",
      authors: ["Clifford Lincé BORDES"],
      pageNumber: 48,
      section: "DOSSIERS"
    }
  ]
};

const RHCA = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <IssueHeader
          title="INFOCHIR – RHCA : La Revue Haitienne de Chirurgie et d'Anesthésiologie"
          volume="Vol. 7"
          issueNumber="47"
          date="Juillet 2024"
        />
        
        <div className="mt-8 space-y-8">
          {Object.entries(mockArticles).map(([section, articles]) => (
            <ArticleSection
              key={section}
              title={section}
              articles={articles}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default RHCA;