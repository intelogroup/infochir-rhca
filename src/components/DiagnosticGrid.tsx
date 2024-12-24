import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiagnosticCase {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  specialty: string;
  diagnosis: string;
  date: string;
}

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
  }
];

export const DiagnosticGrid = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {diagnosticCases.map((diagnosticCase) => (
        <Card key={diagnosticCase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={diagnosticCase.imageUrl}
              alt={diagnosticCase.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{diagnosticCase.title}</CardTitle>
              <Badge variant="outline">{diagnosticCase.specialty}</Badge>
            </div>
            <CardDescription>{diagnosticCase.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{diagnosticCase.description}</p>
            <p className="text-sm font-semibold">
              Diagnostic: <span className="text-primary">{diagnosticCase.diagnosis}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};