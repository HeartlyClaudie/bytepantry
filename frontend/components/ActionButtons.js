import React from "react";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
      >
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
