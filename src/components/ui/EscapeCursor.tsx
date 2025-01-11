import { useEffect, useState } from "react";
import ControlCard from "./controlCard";

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

  return <ControlCard text="Press to hide/unhide cursor" keyboardKey="Esc" />;
};

export default EscapeCursor;
