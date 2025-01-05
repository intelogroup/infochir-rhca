import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TableProperties } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { atlasContent } from "./data/atlasContent";

export const AtlasTableOfContents = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <TableProperties className="h-5 w-5" />
          Table des matières
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">
            Table des matières
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
          <div className="space-y-4">
            {atlasContent.map((chapter, index) => (
              <div key={chapter.id} className="space-y-2">
                <h3 className="text-lg font-semibold flex items-baseline gap-2">
                  <span className="text-primary">{index + 1}.</span>
                  {chapter.title}
                </h3>
                {chapter.lastUpdate && (
                  <p className="text-sm text-gray-500">
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