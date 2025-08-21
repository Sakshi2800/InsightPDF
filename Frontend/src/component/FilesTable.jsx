import React, { useState } from 'react';
import { MoreVertical, FolderIcon, Download, Share2, Copy, Trash2, Edit } from 'lucide-react';

const FileListingTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  

  const files = [
    {
      id: 1,
      name: 'Farhaan_Shaikh_Resume',
      sharedBy: {
        name: 'Farhaan Shaikh',
        avatar: '/api/placeholder/32/32'
      },
      size: '3,0 KB',
      modified: '16 Feb 2024'
    },
    {
      id: 2,
      name: 'Design_Illustrator.docx',
      sharedBy: {
        name: 'Ronald Richards',
        avatar: '/api/placeholder/32/32'
      },
      size: '4,2 KB',
      modified: '16 Feb 2024'
    },
    {
      id: 3,
      name: 'Design_Canva.Video.csv',
      sharedBy: {
        name: 'Courtney Henry',
        avatar: '/api/placeholder/32/32'
      },
      size: '2,2 KB',
      modified: '16 Feb 2024'
    },
    {
      id: 4,
      name: 'Design_Figma.file.csv',
      sharedBy: {
        name: 'Natasya Tailor',
        avatar: '/api/placeholder/32/32'
      },
      size: '4,3 KB',
      modified: '16 Feb 2024'
    },
    {
      id: 5,
      name: 'Canva.Stock.photo.pdf',
      sharedBy: {
        name: 'Melina Sofia',
        avatar: '/api/placeholder/32/32'
      },
      size: '2,7 KB',
      modified: '16 Feb 2024'
    }
  ];

  const handleCheckboxChange = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const ActionMenu = ({ fileId }) => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
      <div className="py-1">
        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
          <Share2 className="w-4 h-4 mr-2" />
          Shared
        </button>
        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
          <Copy className="w-4 h-4 mr-2" />
          Make a Copy
        </button>
        <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <>
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-sm font-medium text-gray-500 text-left">Name</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 text-left">File Size</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 text-left">Uploaded on</th>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id} className="border-b border-gray-200 hover:bg-gray-50">
              
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <FolderIcon className="w-4 h-4 mr-2 text-gray-400" fill='currentColor' />
                  <span className="text-sm text-gray-900">{file.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{file.size}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{file.modified}</td>
              <td className="px-6 py-4 relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {activeMenu === file.id && <ActionMenu fileId={file.id} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default FileListingTable;