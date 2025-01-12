const Crosshair = () => {
  return (
    <div className="fixed z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
      <svg width="24" height="24" className="stroke-white">
        <circle cx="12" cy="12" r="8" fill="none" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="16" strokeWidth="2" />
        <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default Crosshair;
