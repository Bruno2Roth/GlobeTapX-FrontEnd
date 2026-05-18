import './ProfileCard.css'

function ProfileCard() {

  return (
    <div className='profileCard'>

      <img
        src='https://i.pravatar.cc/150'
        alt='perfil'
      />

      <h2>Laura Gómez</h2>

      <p>Viajera frecuente ✈</p>

      <button>Editar Perfil</button>

    </div>
  )
}

export default ProfileCard