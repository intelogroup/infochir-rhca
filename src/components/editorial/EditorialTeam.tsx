import { motion } from "framer-motion";
import { unifiedEditorialData, unifiedEditorInChief } from "./unifiedEditorialData";

export const EditorialTeam = () => (
  <div className="space-y-14">
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <p className="type-eyebrow">Éditeur en chef</p>
      <div className="h-px w-full bg-border" />
      <p className="type-h3 text-foreground">
        {unifiedEditorInChief.name}
        {unifiedEditorInChief.role && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {unifiedEditorInChief.role}
          </span>
        )}
      </p>
    </motion.section>

    {unifiedEditorialData.map((section, index) => (
      <motion.section
        key={section.title}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 * index }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <p className="type-eyebrow">{section.title}</p>
        <div className="h-px w-full bg-border" />
        <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {section.members.map((member) => (
            <li key={member.id} className="text-sm leading-relaxed">
              <span className={member.isCoordinator ? "font-medium text-foreground" : "text-foreground/85"}>
                {member.name}
              </span>
              {member.role && (
                <span className="ml-2 text-muted-foreground">{member.role}</span>
              )}
            </li>
          ))}
        </ul>
      </motion.section>
    ))}
  </div>
);
