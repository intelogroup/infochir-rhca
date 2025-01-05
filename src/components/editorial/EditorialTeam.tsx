import { motion } from "framer-motion";
import { EditorialMemberCard } from "./EditorialMemberCard";
import { editorialTeamData } from "./editorialTeamData";

export const EditorialTeam = () => (
  <div className="space-y-12">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">
        Notre Équipe Éditoriale
      </h2>
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