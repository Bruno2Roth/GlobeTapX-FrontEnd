<<<<<<< HEAD
export const Favoritos = () => {
  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      <h1 className="text-3xl font-extrabold mb-2">Tus Favoritos.</h1>
      <p className="text-gray-500 mb-6 text-sm italic">Explora tus destinos guardados.</p>
      
      <div className="flex flex-col gap-6">
        {/* Card Positano */}
        <div className="relative rounded-[2rem] overflow-hidden shadow-sm">
          <img src="positano.jpg" className="w-full h-72 object-cover" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-xl font-bold">Positano Cliffs</h2>
            <p className="text-sm opacity-80">Italy</p>
          </div>
          <button className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">❤️</button>
        </div>
      </div>
    </div>
  );
};
=======
import Header from '../Componentes/Header/Header'
import FavoriteCard from '../Componentes/FavoriteCard/FavoriteCard'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Favoritos() {

  return (
    <div className='page'>

      <Header
        title='Favoritos'
        subtitle='Destinos guardados'
      />

      <FavoriteCard />

      <FavoriteCard />

      <BottomNav />

    </div>
  )
}

export default Favoritos
>>>>>>> 88d0f8af3f1a9b88cb94f9e872a42dc7929d9327
