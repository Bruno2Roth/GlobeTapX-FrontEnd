export const Header = ({ title }) => (
  <header className="flex justify-between items-center px-6 py-4">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <div className="flex gap-4">
      <button className="p-2 bg-gray-100 rounded-full">🔔</button>
      <img src="user-avatar.jpg" className="w-10 h-10 rounded-full" alt="profile" />
    </div>
  </header>
);