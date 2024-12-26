import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticTable } from "./DiagnosticTable";
import { DiagnosticCase } from "./types";
import { useState } from "react";
import { DiagnosticSearch } from "./DiagnosticSearch";
import { ViewToggle } from "./ViewToggle";

const mockCases: DiagnosticCase[] = [
  {
    id: "1",
    title: "TRAUMA – PLAIES - BRULURES",
    description: "Introduction à l'Atlas de Diagnostic Chirurgical",
    specialty: "Introduction",
    date: "23/07/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1583912267550-d6c2f5e83dd1?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "2",
    title: "PEAU ET TISSUS SOUS CUTANÉS - INFECTIONS - TUMEURS",
    description: "Guide complet sur les pathologies cutanées et sous-cutanées",
    specialty: "Dermatologie",
    date: "12/04/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "3",
    title: "SEIN",
    description: "Atlas complet de la chirurgie mammaire",
    specialty: "Chirurgie mammaire",
    date: "30/03/23",
    diagnosis: "Version stable",
    imageUrl: "https://images.unsplash.com/photo-1583912267550-d6c2f5e83dd1?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "4",
    title: "NEURO CHIRURGIE",
    description: "Guide des procédures en neurochirurgie",
    specialty: "Neurochirurgie",
    date: "11/10/21",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "5",
    title: "OPHTALMO ORL CMF",
    description: "Procédures en ophtalmologie et ORL",
    specialty: "Ophtalmologie",
    date: "11/10/21",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1583912267550-d6c2f5e83dd1?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "6",
    title: "COU",
    description: "Pathologies et chirurgie du cou",
    specialty: "Chirurgie cervicale",
    date: "30/03/22",
    diagnosis: "Version stable",
    imageUrl: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "7",
    title: "THORAX",
    description: "Procédures chirurgicales thoraciques",
    specialty: "Chirurgie thoracique",
    date: "29/05/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "8",
    title: "VASCULAIRE ARTÉRIEL ET ANÉVRISMES",
    description: "Guide des pathologies vasculaires artérielles",
    specialty: "Chirurgie vasculaire",
    date: "12/04/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "9",
    title: "VASCULAIRE VEINEUX ET LYMPHATIQUE",
    description: "Pathologies veineuses et lymphatiques",
    specialty: "Chirurgie vasculaire",
    date: "17/08/22",
    diagnosis: "Version stable",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "10",
    title: "DE L'ŒSOPHAGE, DIAPHRAGME À ILÉON",
    description: "Chirurgie du tractus digestif supérieur",
    specialty: "Chirurgie digestive",
    date: "À venir",
    diagnosis: "À venir",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "11",
    title: "DE APPENDICE À ANUS",
    description: "Chirurgie du tractus digestif inférieur",
    specialty: "Chirurgie digestive",
    date: "À venir",
    diagnosis: "À venir",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "12",
    title: "FOIE – VBEH – PANCRÉAS – RATE",
    description: "Chirurgie hépato-biliaire et pancréatique",
    specialty: "Chirurgie digestive",
    date: "02/01/22",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "13",
    title: "CAVITÉ ABD – OMENTUM – MÉSENTÈRE – RÉTRO PÉRITOINE",
    description: "Chirurgie de la cavité abdominale",
    specialty: "Chirurgie abdominale",
    date: "À venir",
    diagnosis: "À venir",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "14",
    title: "PARIO ABD – HERNIE – ÉVENTRATION – ÉVISCERATION",
    description: "Chirurgie pariétale abdominale",
    specialty: "Chirurgie abdominale",
    date: "04/01/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "15",
    title: "PÉRINÉE ET FESSES",
    description: "Chirurgie périnéale",
    specialty: "Chirurgie périnéale",
    date: "20/10/21",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "16",
    title: "CHIRURGIE PÉDIATRIQUE",
    description: "Guide de chirurgie pédiatrique",
    specialty: "Chirurgie pédiatrique",
    date: "22/11/22",
    diagnosis: "Version stable",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "17",
    title: "UROLOGIE ET APP GÉNITAL HOMME",
    description: "Chirurgie urologique et génitale masculine",
    specialty: "Urologie",
    date: "18/02/23",
    diagnosis: "Version stable",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "18",
    title: "OBGN ET APP GÉN FEMME",
    description: "Chirurgie gynécologique",
    specialty: "Gynécologie",
    date: "09/10/22",
    diagnosis: "Version stable",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "19",
    title: "ORTHOPÉDIE – APP LOCO MOTEUR",
    description: "Chirurgie orthopédique",
    specialty: "Orthopédie",
    date: "11/10/21",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "20",
    title: "GIGANTISMES",
    description: "Prise en charge des gigantismes",
    specialty: "Endocrinologie",
    date: "02/01/22",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "21",
    title: "CORPS ÉTRANGERS",
    description: "Prise en charge des corps étrangers",
    specialty: "Urgences",
    date: "À venir",
    diagnosis: "À venir",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "22",
    title: "CHIRURGIE RECONSTRUCTIVE",
    description: "Techniques de chirurgie reconstructive",
    specialty: "Chirurgie plastique",
    date: "À venir",
    diagnosis: "À venir",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "23",
    title: "BRÛLURES",
    description: "Prise en charge des brûlures",
    specialty: "Urgences",
    date: "À venir",
    diagnosis: "À venir",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=700&fit=crop",
    pdfUrl: "#"
  }
];

const specialties = [
  "Toutes les spécialités",
  "Introduction",
  "Dermatologie",
  "Chirurgie mammaire",
  "Neurochirurgie",
  "Ophtalmologie",
  "Chirurgie cervicale",
  "Chirurgie thoracique",
  "Chirurgie vasculaire",
  "Chirurgie digestive",
  "Chirurgie abdominale",
  "Chirurgie périnéale",
  "Chirurgie pédiatrique",
  "Urologie",
  "Gynécologie",
  "Orthopédie",
  "Endocrinologie",
  "Urgences",
  "Chirurgie plastique"
];

export const DiagnosticGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Toutes les spécialités");
  const [view, setView] = useState<"grid" | "table">("grid");

  const filteredCases = mockCases.filter(item => {
    const matchesSearch = (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesSpecialty = selectedSpecialty === "Toutes les spécialités" || item.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <DiagnosticSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          specialties={specialties}
        />
        <ViewToggle view={view} setView={setView} />
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((diagnosticCase) => (
            <DiagnosticCard
              key={diagnosticCase.id}
              diagnosticCase={diagnosticCase}
            />
          ))}
        </div>
      ) : (
        <DiagnosticTable cases={filteredCases} />
      )}
    </div>
  );
};
