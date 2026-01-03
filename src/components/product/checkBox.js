const CostumCheckBox = ({ label, id, checked, onChange }) => {
  return (
    <div
      role="button"
      className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 active:bg-slate-100"
    >
      <label
        htmlFor={id}
        className="flex w-full cursor-pointer items-center px-3 py-2"
      >
        <div className="inline-flex items-center">

          {/* Checkbox */}
          <label className="flex items-center cursor-pointer relative" htmlFor={id}>
            <input
              type="checkbox"
              id={id}
              checked={!!checked}
              onChange={onChange}
              className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded 
              shadow hover:shadow-md border border-slate-300 
              checked:bg-slate-800 checked:border-slate-800"
            />

            <span className="absolute text-white opacity-0 
            peer-checked:opacity-100 top-1/2 left-1/2 transform 
            -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"></path>
              </svg>
            </span>
          </label>

          {/* Checkbox Label */}
          <label
            className="cursor-pointer ml-2 text-slate-700 text-sm"
            htmlFor={id}
          >
            {label}
          </label>

        </div>
      </label>
    </div>
  );
};

export default CostumCheckBox;
