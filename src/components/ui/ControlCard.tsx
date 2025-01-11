import React from "react";

const ControlCard = ({ text = "", keyboardKey = "" }) => {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg bg-slate-800/80 backdrop-blur-sm dark:text-gray-100">
      <p>{text}</p>
      <span className="ml-auto px-2 py-1.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
        {keyboardKey}
      </span>
    </div>
  );
};

export default ControlCard;
