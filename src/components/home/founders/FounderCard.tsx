import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { Founder } from "./types";

interface FounderCardProps {
  founder: Founder;
  onClick: () => void;
}

export const FounderCard = ({ founder, onClick }: FounderCardProps) => {
  return (
    <Card 
      className={`relative group overflow-hidden backdrop-blur-sm border-0 cursor-pointer ${
        founder.isDeceased 
          ? 'bg-gradient-to-br from-gray-50/90 to-gray-100/90' 
          : 'bg-gradient-to-br from-white/90 to-gray-50/90 hover:shadow-[0_0_30px_rgba(30,64,175,0.2)] transition-all duration-500'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            className={`relative w-32 h-32 mb-6 ${
              founder.isDeceased ? 'grayscale' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/30 to-[#41b06e]/30 rounded-full animate-pulse" />
            <div className={`relative w-full h-full rounded-full overflow-hidden ring-4 transform transition-all duration-500 ${
              founder.isDeceased 
                ? 'ring-gray-200' 
                : 'ring-[#1E40AF] group-hover:ring-[#1E40AF]/80'
            }`}>
              {founder.image ? (
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src={founder.image}
                    alt={founder.name}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback>
                    <UserRound className="w-12 h-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${
                  founder.isDeceased ? 'bg-gray-200' : 'bg-[#1E40AF]/10'
                }`}>
                  <UserRound className={`w-12 h-12 ${
                    founder.isDeceased ? 'text-gray-400' : 'text-[#1E40AF]'
                  }`} />
                </div>
              )}
            </div>
          </motion.div>
          <motion.h3 
            className={`font-semibold text-xl mb-2 transition-colors duration-300 ${
              founder.isDeceased ? 'text-gray-500' : 'text-gray-900 group-hover:text-[#1E40AF]'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            {founder.name}
          </motion.h3>
          <p className={`text-sm mb-3 ${
            founder.isDeceased ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {founder.title}
          </p>
          <motion.span 
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${
              founder.isDeceased 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-gradient-to-r from-[#1E40AF]/10 to-[#41b06e]/10 text-[#1E40AF] group-hover:from-[#1E40AF]/20 group-hover:to-[#41b06e]/20 transition-colors duration-300'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {founder.role}
          </motion.span>
          {founder.isDeceased && (
            <div className="mt-4 text-sm text-gray-500 italic">
              In memoriam
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};