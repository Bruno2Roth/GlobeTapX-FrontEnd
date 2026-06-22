import "./index.css";

const StatsCard = ({ label, value, icon }) => (
  <div className="stats-card">
    <span className="stats-card-icon">{icon}</span>
    <div>
      <p className="stats-card-label">{label}</p>
      <p className="stats-card-value">{value}</p>
    </div>
  </div>
);

export default StatsCard;
