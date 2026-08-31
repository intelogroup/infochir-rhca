
import { motion } from "framer-motion";
import { Users, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { unifiedEditorialData, unifiedEditorInChief } from "./unifiedEditorialData";

export const IGMEditorialCommittee = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <Card className="overflow-hidden bg-card shadow-md hover:shadow-lg transition-all duration-300 p-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
        
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-8 w-8 text-primary flex-shrink-0" />
          <h2 className="text-2xl font-bold text-primary">Éditeur en chef</h2>
        </div>
        
        <div className="pl-11 mb-8">
          <p className="text-xl font-medium text-foreground">
            {unifiedEditorInChief.name}
            <span className="text-muted-foreground ml-2 text-base italic font-normal">
              {unifiedEditorInChief.role}
            </span>
          </p>
        </div>
        
        <div className="space-y-10">
          {unifiedEditorialData.map((section) => (
            <div key={section.title} className="border-t pt-8 first:border-t-0 first:pt-0">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-7 w-7 text-primary flex-shrink-0" />
                <h3 className="text-xl font-bold text-primary">{section.title}</h3>
              </div>
              
              <div className="space-y-3 pl-11">
                {section.members.map((member) => (
                  <div key={member.id} className="flex flex-col">
                    <p className={`${member.isCoordinator ? "font-medium text-foreground" : "text-foreground/80"}`}>
                      {member.name}
                      {member.role && (
                        <span className={`ml-2 italic ${member.isCoordinator ? "text-primary/70" : "text-muted-foreground"}`}>
                          {member.role}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
