export const FilterButtons = ({ options }) => (
  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
    {options.map(opt => (
      <button key={opt} className="px-6 py-2 rounded-full bg-white border border-gray-200 whitespace-nowrap hover:bg-black hover:text-white transition-all text-sm font-medium">
        {opt}
      </button>
    ))}
  </div>
);