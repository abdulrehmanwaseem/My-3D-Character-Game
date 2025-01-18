const SocialsCard = () => {
  return (
    <div className="absolute z-10 -translate-x-1/2 left-1/2 top-2">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/80 backdrop-blur-sm rounded-xl">
        <div className="flex gap-3">
          <a
            href="https://github.com/abdulrehmanwaseem"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors hover:text-gray-300"
          >
            <span className="ml-auto px-2 py-1.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              Github
            </span>
          </a>
          <a
            href="https://pk.linkedin.com/in/abdulrehmanwaseem"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors hover:text-gray-300"
          >
            <span className="ml-auto px-2 py-1.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              Linkedin
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialsCard;
