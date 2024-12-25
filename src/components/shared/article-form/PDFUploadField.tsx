import { PDFUploader } from "@/components/pdf/PDFUploader";

export const PDFUploadField = () => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        PDF Upload
      </label>
      <PDFUploader />
    </div>
  );
};