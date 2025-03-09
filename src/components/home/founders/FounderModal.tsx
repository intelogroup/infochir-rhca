
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Heart, Stethoscope, MapPin, Award, Target, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Founder } from "./types";
import { getFounderAvatarUrl } from "@/integrations/supabase/client";

interface FounderModalProps {
  founder: Founder;
  isOpen: boolean;
  onClose: () => void;
}

export const FounderModal = ({ founder, isOpen, onClose }: FounderModalProps) => {
  const avatarUrl = founder.image ? getFounderAvatarUrl(founder.image) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1E40AF]">
              {founder.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 space-y-6"
            >
              <div className="flex items-start gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={founder.name}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-[#1E40AF]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#1E40AF]/10 flex items-center justify-center ring-4 ring-[#1E40AF]">
                    <X className="w-12 h-12 text-[#1E40AF]" />
                  </div>
                )}
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
                  <Heart className="w-5 h-5 text-[#1E40AF] mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{founder.bio}</p>
                </motion.div>
              )}

              {founder.specialties && founder.specialties.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <Stethoscope className="w-5 h-5 text-[#1E40AF] mt-1 flex-shrink-0" />
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

              {founder.responsibilities && founder.responsibilities.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <Target className="w-5 h-5 text-[#1E40AF] mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Responsabilités</h4>
                    <ul className="list-none space-y-2">
                      {founder.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="w-4 h-4 text-[#1E40AF]" />
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {founder.location && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <MapPin className="w-5 h-5 text-[#1E40AF] flex-shrink-0" />
                  <span className="text-gray-600">{founder.location}</span>
                </motion.div>
              )}

              {founder.achievements && founder.achievements.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <Award className="w-5 h-5 text-[#1E40AF] mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Réalisations</h4>
                    <ul className="list-none space-y-2">
                      {founder.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-[#1E40AF] font-bold">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
