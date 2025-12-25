import { motion } from "framer-motion";
import { type Skill } from "@shared/schema";

export function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-primary/50 transition-colors duration-300"
    >
      <h3 className="text-xl font-bold text-primary mb-4 font-display">{skill.category}</h3>
      <div className="flex flex-wrap gap-2">
        {skill.items.map((item, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-white/5 rounded-full text-sm font-medium text-muted-foreground border border-white/5 hover:border-primary/30 hover:text-primary transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
