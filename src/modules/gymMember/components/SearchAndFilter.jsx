import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/outline';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddMember
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
      <div className="relative flex-1 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Buscar miembros..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-1 bg-gray-800 p-1 rounded-lg">
          <button
            type="button"
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => onViewModeChange('grid')}
            title="Vista de cuadrícula"
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => onViewModeChange('table')}
            title="Vista de tabla"
          >
            <TableCellsIcon className="h-5 w-5" />
          </button>
        </div>
        
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onAddMember}
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nuevo Miembro
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;
