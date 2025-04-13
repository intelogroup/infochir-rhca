
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TableProperties } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtlasArticles } from "./hooks/useAtlasArticles";
import { useIsMobile } from "@/hooks/use-mobile";

export const AtlasTableOfContents = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { data: chapters } = useAtlasArticles();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <TableProperties className="h-4 w-4" />
          <span className="hidden sm:inline">Table des matières</span>
          <span className="sm:hidden">TDM</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className={isMobile ? "w-[85vw]" : "w-[540px]"}
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-primary">
            Table des matières
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
          <div className="space-y-6">
            {chapters?.map((chapter, index) => (
              <div key={chapter.id} className="space-y-2">
                <h3 className="text-base font-semibold flex items-baseline gap-2">
                  <span className="text-primary">{index + 1}.</span>
                  {chapter.title}
                </h3>
                {(chapter.lastUpdate || chapter.lastUpdated) && (
                  <p className="text-sm text-gray-500">
                    Dernière mise à jour: {chapter.lastUpdated || chapter.lastUpdate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
