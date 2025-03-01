import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { RhcaVolume } from "../types";

interface VolumeModalProps {
  volume: RhcaVolume;
  open: boolean;
  onClose: () => void;
}

export const VolumeModal: React.FC<VolumeModalProps> = ({ volume, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{volume.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Volume:</strong> {volume.volume}
              </p>
              <p>
                <strong>Issue:</strong> {volume.issue}
              </p>
              <p>
                <strong>Year:</strong> {volume.year}
              </p>
              <p>
                <strong>Specialty:</strong> {volume.specialty}
              </p>
              <p>
                <strong>Category:</strong> {volume.category}
              </p>
              <p>
                <strong>Institution:</strong> {volume.institution}
              </p>
              <p>
                <strong>Editor:</strong> {volume.editor}
              </p>
              <p>
                <strong>Page Count:</strong> {volume.pageCount}
              </p>
              <p>
                <strong>Availability:</strong> {volume.availability}
              </p>
              {volume.description && (
                <p>
                  <strong>Description:</strong> {volume.description}
                </p>
              )}
              {volume.articleCount && (
                <p>
                  <strong>Article Count:</strong> {volume.articleCount}
                </p>
              )}
              {volume.downloadCount && (
                <p>
                  <strong>Download Count:</strong> {volume.downloadCount}
                </p>
              )}
              {volume.shareCount && (
                <p>
                  <strong>Share Count:</strong> {volume.shareCount}
                </p>
              )}
            </div>
            <div>
              {volume.coverImage && (
                <img
                  src={volume.coverImage}
                  alt={volume.title}
                  className="rounded-md shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
