import { FileText, Image as ImageIcon } from "lucide-react";

interface UploadIconProps {
  type?: 'document' | 'image';
}

export const UploadIcon = ({ type = 'document' }: UploadIconProps) => {
  return type === 'image' ? (
    <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
  ) : (
    <FileText className="h-8 w-8 mx-auto text-gray-400" />
  );
};