import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MedicalCase {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

const medicalCases: MedicalCase[] = [
  {
    id: "1",
    title: "Cas Clinique: Radiographie Thoracique",
    description: "Analyse d'une radiographie thoracique montrant une pneumonie atypique",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    category: "Radiologie",
    date: "2024-02-15"
  },
  {
    id: "2",
    title: "Étude de Cas: Dermatologie",
    description: "Observation d'une lésion cutanée rare",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    category: "Dermatologie",
    date: "2024-02-14"
  },
  {
    id: "3",
    title: "Imagerie Cérébrale",
    description: "IRM cérébrale révélant une anomalie structurelle",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Neurologie",
    date: "2024-02-13"
  },
  {
    id: "4",
    title: "Échographie Abdominale",
    description: "Cas d'étude d'une masse hépatique",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    category: "Gastroentérologie",
    date: "2024-02-12"
  },
  {
    id: "5",
    title: "Radiographie Osseuse",
    description: "Fracture complexe du fémur",
    imageUrl: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632",
    category: "Orthopédie",
    date: "2024-02-11"
  },
  {
    id: "6",
    title: "Analyse Histologique",
    description: "Étude microscopique d'un tissu tumoral",
    imageUrl: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    category: "Pathologie",
    date: "2024-02-10"
  }
];

export const MedicalCaseGrid = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medicalCases.map((medicalCase) => (
        <Card key={medicalCase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={medicalCase.imageUrl}
              alt={medicalCase.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{medicalCase.title}</CardTitle>
            <CardDescription>{medicalCase.category} - {medicalCase.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{medicalCase.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};