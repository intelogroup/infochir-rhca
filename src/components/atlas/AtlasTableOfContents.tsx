import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TableProperties } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { atlasChapters } from "./data/atlasChapters";

export const AtlasTableOfContents = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <TableProperties className="h-4 w-4" />
          Table des matières
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[90vw] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl sm:text-2xl font-bold text-primary">
            Table des matières
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
          <div className="space-y-4">
            {atlasChapters.map((chapter, index) => (
              <div key={chapter.id} className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold flex items-baseline gap-2">
                  <span className="text-primary">{index + 1}.</span>
                  {chapter.title}
                </h3>
                {chapter.lastUpdate && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    Dernière mise à jour: {chapter.lastUpdate}
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