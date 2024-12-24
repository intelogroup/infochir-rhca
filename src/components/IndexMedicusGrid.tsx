import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, Tag, BookOpen, User } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  authors: string[];
  date: string;
  category: string;
  source: "RHCA" | "IGM" | "ADC";
  abstract: string;
  tags: string[];
  imageUrl?: string;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Nouvelles Approches en Chirurgie Laparoscopique",
    authors: ["Dr. Jean Martin", "Dr. Marie Dubois"],
    date: "2024-02-15",
    category: "Chirurgie",
    source: "RHCA",
    abstract: "Une étude approfondie des techniques innovantes en chirurgie mini-invasive...",
    tags: ["laparoscopie", "chirurgie mini-invasive", "innovation"],
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format"
  },
  {
    id: "2",
    title: "Cas Clinique: Pneumonie Atypique",
    authors: ["Dr. Pierre Lambert"],
    date: "2024-02-14",
    category: "Pneumologie",
    source: "IGM",
    abstract: "Présentation d'un cas de pneumonie avec manifestations atypiques...",
    tags: ["pneumonie", "diagnostic", "cas clinique"]
  },
  {
    id: "3",
    title: "Diagnostic Radiologique des Fractures Complexes",
    authors: ["Dr. Sophie Bernard", "Dr. Luc Moreau"],
    date: "2024-02-13",
    category: "Radiologie",
    source: "ADC",
    abstract: "Analyse détaillée des approches diagnostiques en traumatologie...",
    tags: ["radiologie", "traumatologie", "diagnostic"]
  }
];

const categories = [
  "Toutes les catégories",
  "Chirurgie",
  "Pneumologie",
  "Radiologie",
  "Cardiologie",
  "Neurologie",
  "Orthopédie"
];

const sources = [
  "Toutes les sources",
  "RHCA",
  "IGM",
  "ADC"
];

export const IndexMedicusGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 1),
  });
  const [filteredArticles, setFilteredArticles] = useState(mockArticles);

  const handleSearch = () => {
    const filtered = mockArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.abstract.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "Toutes les catégories" || 
        article.category === selectedCategory;
      
      const matchesSource = selectedSource === "Toutes les sources" ||
        article.source === selectedSource;
      
      const articleDate = new Date(article.date);
      const matchesDate = !date?.from || !date?.to || 
        (articleDate >= date.from && articleDate <= date.to);

      return matchesSearch && matchesCategory && matchesSource && matchesDate;
    });

    setFilteredArticles(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher par titre, auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedSource}>
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePickerWithRange date={date} setDate={setDate} />

          <div className="lg:col-span-4">
            <Button onClick={handleSearch} className="w-full gap-2">
              <Search className="h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {article.imageUrl && (
                <div className="md:w-48 h-48 md:h-auto">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        {article.authors.join(", ")}
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4" />
                        {article.date}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{article.source}</Badge>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.abstract}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
