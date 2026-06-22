import { useNavigate } from "react-router-dom";
import './index.css'

function ProfileCard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className='profileCard'>

      <img
        src='https://i.pravatar.cc/150'
        alt='perfil'
      />

      <h2>{user?.nombre || "Usuario"}</h2>

      <p>{user?.email || ""}</p>

      <p className="role-badge">{user?.IsAdmin ? "Admin" : "Viajero"}</p>

      <button onClick={() => navigate("/editarPerfil")}>
        Editar Perfil
      </button>

    </div>
  )
}

export default ProfileCard
