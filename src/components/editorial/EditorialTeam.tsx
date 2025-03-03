
import { motion } from "framer-motion";
import { Users, Star, Award } from "lucide-react";
import { unifiedEditorialData, unifiedEditorInChief } from "./unifiedEditorialData";

export const EditorialTeam = () => (
  <div className="space-y-12">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="flex items-center gap-3 mb-6">
        <Award className="h-8 w-8 text-primary flex-shrink-0" />
        <h2 className="text-2xl font-bold text-primary">Éditeur en chef</h2>
      </div>
      <div className="pl-11">
        <p className="text-xl font-medium text-gray-800">
          {unifiedEditorInChief.name}
          <span className="text-gray-500 ml-2 text-base italic font-normal">
            {unifiedEditorInChief.role}
          </span>
        </p>
      </div>
    </motion.div>

    {unifiedEditorialData.map((section, index) => (
      <motion.div
        key={section.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
        className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="flex items-center gap-3 mb-6">
          {section.title === "Conception et réalisation" ? (
            <Star className="h-7 w-7 text-primary flex-shrink-0" />
          ) : (
            <Users className="h-7 w-7 text-primary flex-shrink-0" />
          )}
          <h2 className="text-xl font-bold text-primary">{section.title}</h2>
        </div>

        <div className="space-y-4 pl-11">
          {section.members.map((member) => (
            <div key={member.id} className="flex flex-col">
              <p className={`${member.isCoordinator ? "font-medium text-gray-800" : "text-gray-700"}`}>
                {member.name}
                {member.role && (
                  <span className={`ml-2 italic ${member.isCoordinator ? "text-primary/70" : "text-gray-500"}`}>
                    {member.role}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);
