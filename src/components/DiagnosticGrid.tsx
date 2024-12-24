import { useState, useMemo } from "react";
import { DiagnosticSearch } from "./diagnostic/DiagnosticSearch";
import { DiagnosticCard } from "./diagnostic/DiagnosticCard";
import { DiagnosticCase, YearGroup } from "./diagnostic/types";

const diagnosticCases: DiagnosticCase[] = [
  {
    id: "1",
    title: "Cas de Pneumonie Interstitielle",
    description: "Infiltrats bilatéraux avec pattern en verre dépoli",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    specialty: "Pneumologie",
    diagnosis: "Pneumonie Interstitielle Non Spécifique",
    date: "2024-02-15"
  },
  {
    id: "2",
    title: "Fracture Complexe du Fémur",
    description: "Fracture spiralée du fémur droit avec déplacement",
    imageUrl: "https://images.unsplash.com/photo-1516069677018-378515003a27",
    specialty: "Orthopédie",
    diagnosis: "Fracture Fémorale Type III",
    date: "2024-02-14"
  },
  {
    id: "3",
    title: "Lésion Cérébrale Focale",
    description: "Masse hyperdense frontale droite avec œdème périlésionnel",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063",
    specialty: "Neurologie",
    diagnosis: "Glioblastome Grade IV",
    date: "2024-02-13"
  },
  {
    id: "4",
    title: "Pathologie Hépatique Diffuse",
    description: "Hépatomégalie avec texture hétérogène",
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67",
    specialty: "Gastroentérologie",
    diagnosis: "Cirrhose Hépatique",
    date: "2024-02-12"
  },
  {
    id: "5",
    title: "Anomalie Cardiaque Congénitale",
    description: "Défaut septal ventriculaire avec shunt gauche-droit",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
    specialty: "Cardiologie",
    diagnosis: "Communication Interventriculaire",
    date: "2024-02-11"
  },
  {
    id: "6",
    title: "Masse Pulmonaire Suspecte",
    description: "Nodule spiculé du lobe supérieur droit",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9d42cc926859",
    specialty: "Oncologie",
    diagnosis: "Carcinome Bronchique",
    date: "2024-02-10"
  },
  {
    id: "7",
    title: "Syndrome du Canal Carpien",
    description: "Compression du nerf médian au niveau du poignet",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    specialty: "Neurologie",
    diagnosis: "Syndrome du Canal Carpien Bilatéral",
    date: "2024-02-09"
  },
  {
    id: "8",
    title: "Arthrite Rhumatoïde Précoce",
    description: "Inflammation symétrique des articulations MCP",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    specialty: "Rhumatologie",
    diagnosis: "Arthrite Rhumatoïde Débutante",
    date: "2024-02-08"
  },
  {
    id: "9",
    title: "Mélanome Cutané",
    description: "Lésion pigmentée asymétrique du dos",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    specialty: "Dermatologie",
    diagnosis: "Mélanome Malin",
    date: "2024-02-07"
  },
  {
    id: "10",
    title: "Calculs Rénaux",
    description: "Multiples calcifications dans le système collecteur rénal",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    specialty: "Urologie",
    diagnosis: "Néphrolithiase Multiple",
    date: "2024-02-06"
  },
  {
    id: "11",
    title: "Hernie Discale L4-L5",
    description: "Compression radiculaire L5 gauche",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    specialty: "Neurochirurgie",
    diagnosis: "Hernie Discale avec Radiculopathie",
    date: "2024-02-05"
  },
  {
    id: "12",
    title: "Anévrisme Aortique",
    description: "Dilatation de l'aorte abdominale",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    specialty: "Chirurgie Vasculaire",
    diagnosis: "Anévrisme de l'Aorte Abdominale",
    date: "2024-02-04"
  },
  {
    id: "13",
    title: "Kyste Ovarien Complexe",
    description: "Masse annexielle droite multiloculée",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    specialty: "Gynécologie",
    diagnosis: "Kyste Ovarien Hémorragique",
    date: "2024-02-03"
  },
  {
    id: "14",
    title: "Épanchement Pleural",
    description: "Épanchement pleural gauche de moyenne abondance",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    specialty: "Pneumologie",
    diagnosis: "Pleurésie Exsudative",
    date: "2024-02-02"
  },
  {
    id: "15",
    title: "Sténose Carotidienne",
    description: "Sténose significative de la carotide interne droite",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    specialty: "Neurologie Vasculaire",
    diagnosis: "Sténose Carotidienne Critique",
    date: "2024-02-01"
  },
  {
    id: "16",
    title: "Ostéoporose Sévère",
    description: "Multiples tassements vertébraux dorsaux",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    specialty: "Rhumatologie",
    diagnosis: "Ostéoporose Fracturaire",
    date: "2024-01-31"
  },
  {
    id: "17",
    title: "Cholécystite Aiguë",
    description: "Vésicule biliaire lithiasique avec paroi épaissie",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    specialty: "Chirurgie Digestive",
    diagnosis: "Cholécystite Lithiasique",
    date: "2024-01-30"
  },
  {
    id: "18",
    title: "Endométriose Pelvienne",
    description: "Multiples implants endométriosiques pelviens",
    imageUrl: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c",
    specialty: "Gynécologie",
    diagnosis: "Endométriose Stade IV",
    date: "2024-01-29"
  },
  {
    id: "19",
    title: "Lymphome Cervical",
    description: "Adénopathies cervicales multiples",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    specialty: "Hématologie",
    diagnosis: "Lymphome Non-Hodgkinien",
    date: "2024-01-28"
  },
  {
    id: "20",
    title: "Thrombose Veineuse Profonde",
    description: "Thrombose fémorale droite extensive",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    specialty: "Médecine Vasculaire",
    diagnosis: "TVP Fémorale",
    date: "2024-01-27"
  },
  {
    id: "21",
    title: "Hémorragie Sous-Arachnoïdienne",
    description: "Saignement diffus des citernes de la base",
    imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    specialty: "Neurochirurgie",
    diagnosis: "HSA sur Anévrisme Rompu",
    date: "2024-01-26"
  },
  {
    id: "22",
    title: "Spondylarthrite Ankylosante",
    description: "Sacro-iliite bilatérale avec syndesmophytes",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    specialty: "Rhumatologie",
    diagnosis: "Spondylarthrite Active",
    date: "2024-01-25"
  },
  {
    id: "23",
    title: "Embolie Pulmonaire",
    description: "Défect de perfusion segmentaire",
    imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9",
    specialty: "Pneumologie",
    diagnosis: "EP Segmentaire Bilatérale",
    date: "2024-01-24"
  },
  {
    id: "24",
    title: "Méningite Bactérienne",
    description: "Rehaussement méningé diffus",
    imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    specialty: "Infectiologie",
    diagnosis: "Méningite à Pneumocoque",
    date: "2024-01-23"
  },
  {
    id: "25",
    title: "Pancréatite Chronique",
    description: "Calcifications pancréatiques diffuses",
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    specialty: "Gastroentérologie",
    diagnosis: "Pancréatite Chronique Calcifiante",
    date: "2024-01-22"
  },
  {
    id: "26",
    title: "Myélome Multiple",
    description: "Lésions lytiques multiples du squelette axial",
    imageUrl: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc",
    specialty: "Hématologie",
    diagnosis: "Myélome Multiple Stade III",
    date: "2024-01-21"
  }
];

export const DiagnosticGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const specialties = useMemo(() => {
    return Array.from(new Set(diagnosticCases.map((c) => c.specialty))).sort();
  }, []);

  const filteredAndGroupedCases = useMemo(() => {
    let filtered = diagnosticCases;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.diagnosis.toLowerCase().includes(searchLower)
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter((c) => c.specialty === selectedSpecialty);
    }

    const groupedByYear = filtered.reduce((acc: YearGroup[], curr) => {
      const date = new Date(curr.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      let yearGroup = acc.find((g) => g.year === year);
      if (!yearGroup) {
        yearGroup = { year, months: [] };
        acc.push(yearGroup);
      }

      let monthGroup = yearGroup.months.find((m) => m.month === month);
      if (!monthGroup) {
        monthGroup = { month, cases: [] };
        yearGroup.months.push(monthGroup);
      }

      monthGroup.cases.push(curr);
      return acc;
    }, []);

    // Sort years descending
    groupedByYear.sort((a, b) => b.year - a.year);
    // Sort months descending within each year
    groupedByYear.forEach((yearGroup) => {
      yearGroup.months.sort((a, b) => b.month - a.month);
    });

    return groupedByYear;
  }, [searchTerm, selectedSpecialty]);

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="max-w-7xl mx-auto scale-[0.85] origin-top">
      <DiagnosticSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        specialties={specialties}
      />

      <div className="space-y-8">
        {filteredAndGroupedCases.map((yearGroup) => (
          <div key={yearGroup.year}>
            <h2 className="text-2xl font-bold mb-4">{yearGroup.year}</h2>
            <div className="space-y-6">
              {yearGroup.months.map((monthGroup) => (
                <div key={monthGroup.month}>
                  <h3 className="text-lg font-semibold mb-3 text-gray-600">
                    {monthNames[monthGroup.month]}
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {monthGroup.cases.map((diagnosticCase) => (
                      <DiagnosticCard
                        key={diagnosticCase.id}
                        diagnosticCase={diagnosticCase}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
