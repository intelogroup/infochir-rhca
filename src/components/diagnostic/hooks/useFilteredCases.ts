import { useMemo } from "react";
import { DiagnosticCase, YearGroup } from "../types";

export const useFilteredCases = (
  diagnosticCases: DiagnosticCase[],
  searchTerm: string,
  selectedSpecialty: string
) => {
  return useMemo(() => {
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
  }, [searchTerm, selectedSpecialty, diagnosticCases]);
};