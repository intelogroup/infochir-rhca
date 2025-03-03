
import { motion } from "framer-motion";
import { EditorialMemberCard } from "./EditorialMemberCard";
import { editorialTeamData } from "./editorialTeamData";
import { Users } from "lucide-react";

export const EditorialTeam = () => (
  <div className="space-y-12">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden mb-12"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="flex items-start gap-4 mb-8">
        <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Notre Équipe Éditoriale
          </h2>
          <p className="text-gray-600">
            Découvrez les experts qui contribuent à la qualité de nos publications.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {editorialTeamData.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <EditorialMemberCard member={member} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);
