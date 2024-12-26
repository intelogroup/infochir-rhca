import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticCase } from "./types";
import { useState } from "react";
import { DiagnosticSearch } from "./DiagnosticSearch";

const mockCases: DiagnosticCase[] = [
  {
    id: "1",
    title: "TRAUMA – PLAIES - BRULURES",
    description: "Guide complet sur la gestion des traumatismes, plaies et brûlures en chirurgie",
    specialty: "Traumatologie",
    date: "23/07/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "2",
    title: "PEAU ET TISSUS SOUS CUTANÉS",
    description: "Infections et tumeurs cutanées : diagnostic et prise en charge chirurgicale",
    specialty: "Dermatologie",
    date: "12/04/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "3",
    title: "SEIN",
    description: "Atlas complet de la chirurgie mammaire et des pathologies associées",
    specialty: "Chirurgie mammaire",
    date: "30/03/23",
    diagnosis: "Version stable",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "4",
    title: "NEURO CHIRURGIE",
    description: "Techniques et approches en neurochirurgie moderne",
    specialty: "Neurochirurgie",
    date: "11/10/21",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "5",
    title: "OPHTALMO ORL CMF",
    description: "Guide des procédures en ophtalmologie et ORL",
    specialty: "Ophtalmologie",
    date: "11/10/21",
    diagnosis: "À mettre à jour",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=700&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "6",
    title: "THORAX",
    description: "Procédures chirurgicales thoraciques avancées",
    specialty: "Chirurgie thoracique",
    date: "29/05/24",
    diagnosis: "Mise à jour disponible",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=700&fit=crop",
    pdfUrl: "#"
  }
];

const specialties = [
  "Toutes les spécialités",
  "Traumatologie",
  "Dermatologie",
  "Chirurgie mammaire",
  "Neurochirurgie",
  "Ophtalmologie",
  "Chirurgie thoracique"
];

export const DiagnosticGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Toutes les spécialités");

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
      <DiagnosticSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        specialties={specialties}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((diagnosticCase) => (
          <DiagnosticCard
            key={diagnosticCase.id}
            diagnosticCase={diagnosticCase}
          />
        ))}
      </div>
    </div>
  );
};