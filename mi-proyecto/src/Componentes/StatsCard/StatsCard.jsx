export const StatsCard = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
    
    <div className="text-2xl">
      {icon}
    </div>

    <div>
      <p className="text-gray-400 text-xs">
        {label}
      </p>

      <p className="text-lg font-bold">
        {value}
      </p>
    </div>

  </div>
)