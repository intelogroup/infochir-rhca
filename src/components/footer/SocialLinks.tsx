import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { socialLinks } from "@/components/layouts/FooterSection";

export const SocialLinks = () => {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-6">Nous suivre</h3>
      <div className="flex space-x-5">
        {socialLinks.map((social, index) => (
          <motion.div
            key={social.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={social.href}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
              aria-label={social.name}
            >
              <social.icon className="h-5 w-5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};