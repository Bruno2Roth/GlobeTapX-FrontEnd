export const InputField = ({ label, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-medium text-gray-600 ml-2">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      className="px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
  )