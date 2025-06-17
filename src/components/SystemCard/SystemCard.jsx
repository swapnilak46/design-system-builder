import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SystemCard = ({ system, onRename, onDelete }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(system.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRename = () => {
    if (newName.trim() && newName !== system.name) {
      onRename(system.id, newName.trim());
    }
    setIsRenaming(false);
    setNewName(system.name);
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
    setNewName(system.name);
  };

  const handleDelete = () => {
    onDelete(system.id);
    setShowDeleteConfirm(false);
  };

  const handleOpen = () => {
    navigate(`/system/${system.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card group relative overflow-hidden">
      {/* System Icon and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-white text-xl">🎨</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
          <span className="text-xs text-secondary-600 font-medium">Active</span>
        </div>
      </div>

      {/* System Name */}
      <div className="mb-3">
        {isRenaming ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-field text-lg font-bold"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') handleCancelRename();
              }}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleRename}
                className="btn-primary text-xs py-1 px-3"
              >
                Save
              </button>
              <button
                onClick={handleCancelRename}
                className="btn-ghost text-xs py-1 px-3"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
            {system.name}
          </h3>
        )}
      </div>

      {/* System Details */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Created</span>
          <span className="text-secondary-800 font-medium">
            {formatDate(system.createdAt)}
          </span>
        </div>        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Components</span>
          <span className="text-secondary-800 font-medium">
            {system._count?.components || 0}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Foundations</span>
          <span className="text-secondary-800 font-medium">
            {system._count?.foundations || 0}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleOpen}
          className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-1"
        >
          <span>Open</span>
          <span>→</span>
        </button>
        <button
          onClick={() => setIsRenaming(true)}
          className="btn-secondary text-sm py-2 px-3"
          title="Rename"
        >
          ✏️
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="btn-secondary text-sm py-2 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <h4 className="text-lg font-bold text-secondary-900 mb-2">
              Delete Design System
            </h4>
            <p className="text-secondary-600 mb-4">
              Are you sure you want to delete "{system.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemCard;
