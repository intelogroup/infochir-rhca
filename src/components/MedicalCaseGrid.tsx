import { useState } from "react";
import { DiagnosticCard } from "./diagnostic/DiagnosticCard";
import { DiagnosticSearch } from "./diagnostic/DiagnosticSearch";
import { useFilteredCases } from "./diagnostic/hooks/useFilteredCases";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export const MedicalCaseGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { filteredCases, isLoading, error } = useFilteredCases(searchTerm);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du chargement des cas médicaux.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <DiagnosticSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSpecialty=""
          setSelectedSpecialty={() => {}}
          specialties={[]}
        />
      </div>
      
      {filteredCases.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun cas trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((diagnosticCase) => (
            <DiagnosticCard
              key={diagnosticCase.id}
              title={diagnosticCase.title}
              description={diagnosticCase.description}
              imageUrl={diagnosticCase.imageUrl}
              date={diagnosticCase.date}
              category={diagnosticCase.specialty}
              author="Dr. John Doe"
            />
          ))}
        </div>
      )}
    </div>
  );
};