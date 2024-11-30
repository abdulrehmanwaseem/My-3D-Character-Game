import { useEffect, useState } from "react";

const EscapeCursor = () => {
  const [isCursorHidden, setIsCursorHidden] = useState(false);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsCursorHidden((prev) => !prev);
      document.body.style.cursor = isCursorHidden ? "auto" : "none";
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isCursorHidden]);

  return (
    <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg w-fit bg-slate-800/80 backdrop-blur-sm dark:text-gray-100">
      Press to hide/unhide cursor
      <span className="px-2 py-1.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
        Esc
      </span>
    </span>
  );
};

export default EscapeCursor;
