import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Heart, Stethoscope, MapPin, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Founder } from "./types";

interface FounderModalProps {
  founder: Founder;
  isOpen: boolean;
  onClose: () => void;
}

export const FounderModal = ({ founder, isOpen, onClose }: FounderModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1E40AF]">
              {founder.name}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 space-y-6"
          >
            <div className="flex items-start gap-4">
              <img
                src={founder.image}
                alt={founder.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-[#1E40AF]"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {founder.title}
                </h3>
                <span className="inline-flex items-center rounded-full bg-[#1E40AF]/10 px-4 py-1.5 text-sm font-medium text-[#1E40AF]">
                  {founder.role}
                </span>
              </div>
            </div>

            {founder.bio && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#1E40AF]/5 to-transparent rounded-lg"
              >
                <Heart className="w-5 h-5 text-[#1E40AF] mt-1" />
                <p className="text-gray-700 leading-relaxed">{founder.bio}</p>
              </motion.div>
            )}

            {founder.specialties && founder.specialties.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3"
              >
                <Stethoscope className="w-5 h-5 text-[#1E40AF] mt-1" />
                <div className="flex flex-wrap gap-2">
                  {founder.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#1E40AF]/10 text-[#1E40AF] rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {founder.location && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <MapPin className="w-5 h-5 text-[#1E40AF]" />
                <span className="text-gray-600">{founder.location}</span>
              </motion.div>
            )}

            {founder.achievements && founder.achievements.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3"
              >
                <Award className="w-5 h-5 text-[#1E40AF] mt-1" />
                <ul className="space-y-2">
                  {founder.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-600">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};