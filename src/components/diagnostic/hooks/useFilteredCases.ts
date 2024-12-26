import { useState } from "react";
import { DiagnosticCase } from "../types";
import { diagnosticCases } from "../data";

interface UseFilteredCasesReturn {
  filteredCases: DiagnosticCase[];
  isLoading: boolean;
  error: Error | null;
}

export const useFilteredCases = (searchTerm: string): UseFilteredCasesReturn => {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const filteredCases = diagnosticCases.filter((diagnosticCase) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      diagnosticCase.title.toLowerCase().includes(searchLower) ||
      diagnosticCase.description.toLowerCase().includes(searchLower) ||
      diagnosticCase.specialty.toLowerCase().includes(searchLower)
    );
  });

  return {
    filteredCases,
    isLoading,
    error
  };
};