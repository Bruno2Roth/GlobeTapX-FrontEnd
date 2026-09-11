import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import './index.css'

function ProfileCard() {
  const navigate = useNavigate();
  const { user, photo } = useSession();
  const displayName = user?.nombreCompleto || user?.NombreCompleto || user?.nombre || "Usuario";

  return (
    <div className='profileCard'>
      <img src={photo || "https://i.pravatar.cc/150"} alt='perfil' />
      <h2>{displayName}</h2>
      <p>{user?.mail || user?.correo || ""}</p>
      <p className="role-badge">Viajero</p>
      <button onClick={() => navigate("/editarPerfil")} type="button">
        Editar Perfil
      </button>
    </div>
  )
}

export default ProfileCard
