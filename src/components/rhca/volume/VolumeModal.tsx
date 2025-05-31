
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VolumeModalActions } from "./VolumeModalActions";
import type { RhcaVolume } from "../types";

interface VolumeModalProps {
  volume: RhcaVolume;
  open: boolean;
  onClose: () => void;
}

export const VolumeModal: React.FC<VolumeModalProps> = ({ volume, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-white flex flex-col">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 sm:p-6 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{volume.title}</h2>
          <p className="text-primary/80 font-medium text-sm sm:text-base">
            Volume {volume.volume}, Issue {volume.issue} - {volume.year}
          </p>
        </div>

        <div className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Volume</p>
                  <p className="text-sm sm:text-base text-gray-900">{volume.volume}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Issue</p>
                  <p className="text-sm sm:text-base text-gray-900">{volume.issue}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Year</p>
                  <p className="text-sm sm:text-base text-gray-900">{volume.year}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Page Count</p>
                  <p className="text-sm sm:text-base text-gray-900">{volume.pageCount}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Specialty</p>
                <p className="text-sm sm:text-base text-gray-900 break-words">{volume.specialty}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Category</p>
                <p className="text-sm sm:text-base text-gray-900 break-words">{volume.category}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Institution</p>
                <p className="text-sm sm:text-base text-gray-900 break-words">{volume.institution}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Editor</p>
                <p className="text-sm sm:text-base text-gray-900 break-words">{volume.editor}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Availability</p>
                <p className="text-sm sm:text-base text-gray-900">{volume.availability}</p>
              </div>
              
              {volume.articleCount && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Article Count</p>
                  <p className="text-sm sm:text-base text-gray-900">{volume.articleCount}</p>
                </div>
              )}
              
              {volume.downloadCount && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Download Count</p>
                  <p className="text-sm sm:text-base text-gray-900">{volume.downloadCount}</p>
                </div>
              )}
              
              {volume.shareCount && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Share Count</p>
                  <p className="text-sm sm:text-base text-gray-900">{volume.shareCount}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              {volume.coverImage && (
                <img
                  src={volume.coverImage}
                  alt={volume.title}
                  className="rounded-md shadow-md w-full max-w-xs lg:max-w-full h-auto object-cover"
                />
              )}
            </div>
          </div>

          {volume.description && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base break-words">{volume.description}</p>
            </div>
          )}
        </div>

        {/* Fixed footer with actions - consistent with other modals */}
        <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex justify-end shadow-sm flex-shrink-0">
          <VolumeModalActions volume={volume} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
