
import React from 'react';

interface RHCAFileStatusProps {
  pdfFilesStatus: Record<string, boolean>;
  coverFilesStatus: Record<string, boolean>;
  pdfFilesList: string[];
  coverFilesList: string[];
}

export const RHCAFileStatus: React.FC<RHCAFileStatusProps> = ({
  pdfFilesStatus,
  coverFilesStatus,
  pdfFilesList,
  coverFilesList
}) => {
  return (
    <div>
      <p className="text-sm mt-2">
        <strong>Statut des fichiers:</strong>
        {Object.entries(pdfFilesStatus).length > 0 && (
          <span className="block mt-1">
            PDFs: {Object.entries(pdfFilesStatus).map(([vi, exists]) => (
              <span key={`pdf-${vi}`} className={`inline-flex items-center mr-2 px-2 py-1 rounded-full text-xs ${exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Vol {vi.split(':')[0]}, No {vi.split(':')[1]}: {exists ? '✓' : '✗'}
              </span>
            ))}
          </span>
        )}
        {Object.entries(coverFilesStatus).length > 0 && (
          <span className="block mt-1">
            Covers: {Object.entries(coverFilesStatus).map(([vi, exists]) => (
              <span key={`cover-${vi}`} className={`inline-flex items-center mr-2 px-2 py-1 rounded-full text-xs ${exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Vol {vi.split(':')[0]}, No {vi.split(':')[1]}: {exists ? '✓' : '✗'}
              </span>
            ))}
          </span>
        )}
      </p>
      
      {pdfFilesList.length > 0 && (
        <div className="mt-3">
          <strong className="text-sm">Fichiers PDF disponibles:</strong>
          <div className="text-xs mt-1 bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
            {pdfFilesList.map(file => (
              <div key={file} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                {file}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {coverFilesList.length > 0 && (
        <div className="mt-3">
          <strong className="text-sm">Images de couverture disponibles:</strong>
          <div className="text-xs mt-1 bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
            {coverFilesList.map(file => (
              <div key={file} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                {file}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
