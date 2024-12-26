import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticCase } from "./types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  }
];

export const DiagnosticGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCases, setFilteredCases] = useState<DiagnosticCase[]>(mockCases);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockCases.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCases(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un chapitre..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

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