import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

function MouseController({ onMouseClick }) {
  const { gl } = useThree();

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (onMouseClick) {
        onMouseClick(e.button);
      }
    };

    const handleMouseUp = () => {
      console.log("Mouse released");
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    gl.domElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, [gl, onMouseClick]);

  return null;
}

export default MouseController;
