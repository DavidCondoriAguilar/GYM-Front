import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Sample data for demonstration
const initialMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    status: 'active',
    joinDate: '2023-05-15',
    membership: 'Premium'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    status: 'inactive',
    joinDate: '2023-06-20',
    membership: 'Basic'
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(555) 456-7890',
    status: 'active',
    joinDate: '2023-07-10',
    membership: 'Premium'
  },
];

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
};

export default function GymMembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle member deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Gym Members</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the members in your gym including their details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Member
          </button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="mt-4">
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Members table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Join Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Membership
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-gray-500">ID: {member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <EnvelopeIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {member.email}
                        </div>
                        <div className="mt-1 flex items-center">
                          <PhoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {member.phone}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[member.status]}`}>
                          {member.status === 'active' ? (
                            <>
                              <CheckCircleIcon className="mr-1 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="mr-1 h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {member.membership}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(member.id)}
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
