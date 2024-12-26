import { useMemo } from "react";
import { DiagnosticCase, YearGroup } from "../types";

export const useFilteredCases = (
  diagnosticCases: DiagnosticCase[],
  searchTerm: string,
  selectedSpecialty: string
): YearGroup[] => {
  return useMemo(() => {
    if (!Array.isArray(diagnosticCases)) {
      console.error("diagnosticCases must be an array");
      return [];
    }

    let filtered = diagnosticCases;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(searchLower) ||
          c.description?.toLowerCase().includes(searchLower) ||
          c.diagnosis?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedSpecialty && selectedSpecialty !== "all") {
      filtered = filtered.filter((c) => c.specialty === selectedSpecialty);
    }

    const groupedByYear = filtered.reduce((acc: YearGroup[], curr) => {
      try {
        const date = new Date(curr.date);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date found: ${curr.date}`);
          return acc;
        }

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
      } catch (error) {
        console.error("Error processing case:", error);
        return acc;
      }
    }, []);

    // Sort years descending
    groupedByYear.sort((a, b) => b.year - a.year);
    // Sort months descending within each year
    groupedByYear.forEach((yearGroup) => {
      yearGroup.months.sort((a, b) => b.month - a.month);
      // Sort cases by date within each month
      yearGroup.months.forEach((monthGroup) => {
        monthGroup.cases.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });
    });

    return groupedByYear;
  }, [searchTerm, selectedSpecialty, diagnosticCases]);
};