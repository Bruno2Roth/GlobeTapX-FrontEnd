
export const MissionCard = ({ title, image, tag }) => (
  <div className="relative rounded-[2rem] overflow-hidden h-48 w-full shadow-md">
    <img src={image} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-end">
      <span className="text-xs text-white/80">{tag}</span>
      <h3 className="text-white font-bold">{title}</h3>
    </div>
  </div>
);
