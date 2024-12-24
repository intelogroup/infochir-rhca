import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface Issue {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
}

const issues: Issue[] = [
  {
    id: "1",
    title: "Avancées en chirurgie laparoscopique",
    date: "Décembre 2023",
    pdfUrl: "/issues/dec-2023.pdf"
  },
  {
    id: "2",
    title: "Nouvelles techniques en anesthésie régionale",
    date: "Octobre 2023",
    pdfUrl: "/issues/oct-2023.pdf"
  },
  {
    id: "3",
    title: "Études de cas: Chirurgie traumatologique",
    date: "Août 2023",
    pdfUrl: "/issues/aug-2023.pdf"
  },
  {
    id: "4",
    title: "Innovation en chirurgie cardiaque",
    date: "Juin 2023",
    pdfUrl: "/issues/jun-2023.pdf"
  },
  {
    id: "5",
    title: "Anesthésie en pédiatrie",
    date: "Avril 2023",
    pdfUrl: "/issues/apr-2023.pdf"
  },
  {
    id: "6",
    title: "Chirurgie mini-invasive",
    date: "Février 2023",
    pdfUrl: "/issues/feb-2023.pdf"
  },
  {
    id: "7",
    title: "Progrès en neurochirurgie",
    date: "Décembre 2022",
    pdfUrl: "/issues/dec-2022.pdf"
  },
  {
    id: "8",
    title: "Techniques d'anesthésie moderne",
    date: "Octobre 2022",
    pdfUrl: "/issues/oct-2022.pdf"
  },
  {
    id: "9",
    title: "Chirurgie orthopédique avancée",
    date: "Août 2022",
    pdfUrl: "/issues/aug-2022.pdf"
  },
  {
    id: "10",
    title: "Gestion de la douleur post-opératoire",
    date: "Juin 2022",
    pdfUrl: "/issues/jun-2022.pdf"
  }
];

// Group issues by year and month
const groupIssuesByYear = (issues: Issue[]) => {
  const grouped: Record<string, Issue[]> = {};
  
  issues.forEach(issue => {
    const [month, year] = issue.date.split(' ');
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(issue);
  });

  return grouped;
};

export const IssuesGrid = () => {
  const groupedIssues = groupIssuesByYear(issues);
  const years = Object.keys(groupedIssues).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Archives par année
      </h2>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-8">
          {years.map(year => (
            <div key={year} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 sticky top-0 bg-white py-2">
                {year}
              </h3>
              <div className="space-y-4 pl-4">
                {groupedIssues[year].map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={issue.pdfUrl}
                        className="block text-sm font-medium text-gray-900 hover:text-primary transition-colors"
                      >
                        {issue.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {issue.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};