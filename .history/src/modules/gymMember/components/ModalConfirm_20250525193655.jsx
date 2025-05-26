import React from 'react';
import { toast } from 'sonner';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const showDeleteConfirmation = (member, onConfirm) => {
  toast.custom((t) => (
    <div className="bg-gray-800 border border-red-900/50 rounded-xl p-4 shadow-2xl shadow-red-950/50 backdrop-blur-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-white">¿Eliminar miembro?</h3>
          <p className="mt-1 text-sm text-gray-400">
            ¿Estás seguro de que deseas eliminar a {member.name}? Esta acción no se puede deshacer.
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  toast.dismiss(t);
                  await onConfirm(member);
                } catch (error) {
                  console.error('Error in confirmation:', error);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
              Eliminar
            </button>
            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  ), {
    duration: 10000, // 10 seconds
    position: 'top-center',
  });
};

export default showDeleteConfirmation;