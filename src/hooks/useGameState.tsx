import {
  Joystick,
  isHost,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { createContext, useContext } from "react";

const GameStateContext = createContext();

const NEXT_STAGE = {
  lobby: "countdown",
  countdown: "game",
  game: "winner",
  winner: "lobby",
};

const TIMER_STAGE = {
  lobby: -1,
  countdown: 3,
  game: 0,
  winner: 5,
};

export const GameStateProvider = ({ children }: any) => {
  return (
    <GameStateContext.Provider value={{}}>{children}</GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context)
    throw new Error("useGameState must be used within a GameStateProvider");

  return context;
};
