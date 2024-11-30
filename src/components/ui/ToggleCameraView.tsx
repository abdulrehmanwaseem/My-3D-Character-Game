import { ToggleCameraViewProps } from "../../types";

const ToggleCameraView = ({
  cameraMode,
  setCameraMode,
}: ToggleCameraViewProps) => {
  return (
    <div className="absolute z-10 top-4 right-4 w-[9.5rem] flex items-center gap-3 bg-slate-800/80 p-3 rounded-lg backdrop-blur-sm">
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
    </div>
  );
};

export default ToggleCameraView;
