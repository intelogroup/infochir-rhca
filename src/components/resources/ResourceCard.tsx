import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ResourceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const ResourceCard = ({ title, description, icon: Icon, href }: ResourceCardProps) => {
  return (
    <Link to={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full bg-white hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-primary font-medium flex items-center">
              En savoir plus
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};