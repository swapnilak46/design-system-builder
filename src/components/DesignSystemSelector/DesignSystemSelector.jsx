import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSystems, setCurrentSystem } from '../../store/slices/designSystemSlice';
import './DesignSystemSelector.css';

const DesignSystemSelector = ({ onSystemSelect }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { systems, loading, currentSystem } = useSelector(state => state.designSystem);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (systems.length === 0) {
      dispatch(fetchSystems());
    }
  }, [dispatch, systems.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSystemSelect = (system) => {
    dispatch(setCurrentSystem(system));
    setIsOpen(false);
    if (onSystemSelect) {
      onSystemSelect(system);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
        <span>Loading design systems...</span>
      </div>
    );
  }

  if (systems.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-2">📱</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Design Systems Found</h3>
        <p className="text-gray-600 mb-4">Create your first design system to get started.</p>        <button 
          className="btn-primary"
          onClick={() => navigate('/design-systems')}
        >
          Create Design System
        </button>
      </div>
    );
  }
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🎨</span>
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">
              {currentSystem ? currentSystem.name : 'Select Design System'}
            </div>
            {currentSystem && (
              <div className="text-sm text-gray-500">
                {currentSystem.description || 'No description'}
              </div>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {systems.map((system) => (
            <button
              key={system.id}
              onClick={() => handleSystemSelect(system)}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🎨</span>
              </div>
              <div className="text-left flex-1">
                <div className="font-medium text-gray-900">{system.name}</div>
                <div className="text-sm text-gray-500">
                  {system.description || 'No description'}
                </div>
              </div>
              {currentSystem && currentSystem.id === system.id && (
                <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignSystemSelector;
