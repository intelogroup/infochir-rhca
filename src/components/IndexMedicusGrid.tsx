import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { SearchBar } from "./index-medicus/SearchBar";
import { categories, sources, mockArticles } from "./index-medicus/constants";
import type { Article } from "./index-medicus/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export const IndexMedicusGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 1),
  });
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);

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
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        date={date}
        setDate={setDate}
        onSearch={handleSearch}
        categories={categories}
        sources={sources}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Titre</TableHead>
              <TableHead>Auteurs</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.authors.join(", ")}</TableCell>
                <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{article.source}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Lire
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};