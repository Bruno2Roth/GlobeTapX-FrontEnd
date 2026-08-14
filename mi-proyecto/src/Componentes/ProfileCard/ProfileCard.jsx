import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthSession, getStoredUser, subscribeAuthSession } from "../../services/authSession";
import './index.css'

function ProfileCard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getAuthSession());

  useEffect(() => subscribeAuthSession(setSession), []);

  const user = session.user || getStoredUser() || {};
  const photo = session.photo || "https://i.pravatar.cc/150";

  return (
    <div className='profileCard'>

      <img
        src={photo}
        alt='perfil'
      />

      <h2>{user?.nombre || "Usuario"}</h2>

      <p>{user?.mail || ""}</p>

      <p className="role-badge">{user?.IsAdmin ? "Admin" : "Viajero"}</p>

      <button onClick={() => navigate("/editarPerfil")}>
        Editar Perfil
      </button>

    </div>
  )
}

export default ProfileCard
