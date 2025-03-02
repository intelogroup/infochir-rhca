
import React from 'react';
import { RHCASidebar } from './components/RHCASidebar';
import RhcaGrid from './RhcaGrid';

export const RhcaContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <RhcaGrid />
      </div>
      
      <div className="lg:col-span-1">
        <RHCASidebar />
      </div>
    </div>
  );
};
