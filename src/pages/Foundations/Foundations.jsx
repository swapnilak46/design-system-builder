import React from 'react';
import { useSelector } from 'react-redux';
import FoundationsTab from '../../components/Foundations/FoundationsTab';
import DesignSystemSelector from '../../components/DesignSystemSelector/DesignSystemSelector';

const Foundations = () => {
  const { currentSystem } = useSelector(state => state.designSystem);
  if (!currentSystem) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Design System Foundations</h2>
          <p className="text-gray-600 mb-6">Select a design system to start defining foundations like colors, typography, spacing, and more.</p>
        </div>
        
        <div className="flex justify-center">
          <DesignSystemSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Design System Foundations</h1>
          <p className="text-gray-600">Define the core design tokens and foundations for your system</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <DesignSystemSelector />
        </div>
      </div>
      
      <FoundationsTab systemId={currentSystem.id} />
    </div>
  );
};

export default Foundations;


