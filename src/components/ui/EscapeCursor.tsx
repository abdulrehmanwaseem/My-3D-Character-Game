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
    <div className="absolute z-10 top-3 right-3 w-fit flex items-center gap-3 bg-slate-800/80 p-3 rounded-lg backdrop-blur-sm">
      <span className=" text-xs font-semibold text-gray-800   dark:text-gray-100 ">
        Press to hide/unhide cursor:
      </span>
      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
        Esc
      </kbd>
    </div>
  );
};

export default EscapeCursor;
