import { useEffect } from "react";
import { ToggleCameraViewProps } from "../../types";

const ToggleCameraView = ({
  cameraMode,
  setCameraMode,
}: ToggleCameraViewProps) => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "v" || event.key === "V") {
      setCameraMode((prev) =>
        prev === "third-person" ? "first-person" : "third-person"
      );
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg justify-self-end w-fit bg-slate-800/80 backdrop-blur-sm">
      <span className="text-sm font-medium text-white">
        {cameraMode === "third-person" ? "3rd Person" : "1st Person"}
      </span>
      <button
        onClick={() =>
          setCameraMode((prev) =>
            prev === "third-person" ? "first-person" : "third-person"
          )
        }
        className="relative inline-flex items-center h-6 transition-colors duration-300 rounded-full w-11"
        style={{
          backgroundColor:
            cameraMode === "first-person" ? "#4F46E5" : "#374151",
        }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            cameraMode === "first-person" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <kbd className="px-2.5 py-1.5 text-xs font-bold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
        V
      </kbd>
    </div>
  );
};

export default ToggleCameraView;
