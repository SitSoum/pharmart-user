const CurruncydropDown = () => {
  // return (
  //     <form className="rounded  flex justify-center items-center space-x-2">

  //         <select className="border-none px-2 py-1 outline-0  text-[14px] font-[700px] text-white cursor-pointer">
  //                 <option className="text-[#228B22] text-[14px] font-[700px]  ">USD</option>
  //                 <option className="text-[#228B22] text-[14px] font-[700px]">Riel</option>

  //         </select>
  //     </form>
  // )

  return (
    <div
      className="
        relative
        flex items-center
        h-9 sm:h-10
        px-2 sm:px-3
        rounded-full
        bg-white/10 backdrop-blur-md
        border border-white/20
        shadow-sm
        hover:bg-white/15
        transition
      "
    >
      <select
        className="
          bg-transparent
          text-white
          text-xs sm:text-sm
          font-semibold
          outline-none
          cursor-pointer
          pr-5
          appearance-none
        "
      >
        <option value="USD" className="text-green-900">
          USD
        </option>
        <option value="KHR" className="text-green-900">
          Riel
        </option>
      </select>

      {/* Custom dropdown arrow */}
      <span className="pointer-events-none absolute right-2 text-white/70 text-xs">
        ▼
      </span>
    </div>
  );
};

export default CurruncydropDown;
