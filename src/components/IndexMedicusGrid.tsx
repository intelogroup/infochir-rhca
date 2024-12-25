import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { SearchBar } from "./index-medicus/SearchBar";
import { categories, sources } from "./index-medicus/constants";
import type { Article } from "@/types/article";
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
import { supabase } from "@/integrations/supabase/client";

export const IndexMedicusGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedSource, setSelectedSource] = useState("Toutes les sources");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 1),
  });
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const handleSearch = async () => {
    let query = supabase
      .from('articles')
      .select(`
        *,
        category:categories(name),
        article_authors(author:authors(name)),
        article_tags(tag:tags(name))
      `);

    // Apply filters
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`);
    }

    if (selectedSource !== "Toutes les sources") {
      query = query.eq('source', selectedSource);
    }

    if (date?.from && date?.to) {
      query = query.gte('date', date.from.toISOString())
                  .lte('date', date.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return;
    }

    setFilteredArticles(data || []);
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
                <TableCell>
                  {article.article_authors?.map(a => a.author.name).join(", ")}
                </TableCell>
                <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                <TableCell>{article.category?.name}</TableCell>
                <TableCell>{article.source}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {article.article_tags?.map((t) => (
                      <Badge key={t.tag.name} variant="secondary" className="text-xs">
                        {t.tag.name}
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