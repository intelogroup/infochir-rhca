export interface DiagnosticCase {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  specialty: string;
  diagnosis: string;
  date: string;
}

export interface YearGroup {
  year: number;
  months: MonthGroup[];
}

export interface MonthGroup {
  month: number;
  cases: DiagnosticCase[];
}