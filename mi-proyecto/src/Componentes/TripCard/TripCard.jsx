import React from 'react';
import { Heart } from 'lucide-react'; // Opcional: usa una librería de iconos

const TripCard = ({ image, title, location, rating }) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg group">
      {/* Imagen de fondo */}
      <img 
        src={image} 
        alt={title} 
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Botón de favoritos */}
      <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
        <Heart size={20} />
      </button>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm opacity-90">{location}</p>
        <div className="mt-2 flex items-center">
          <span className="bg-blue-500 text-xs px-2 py-1 rounded-lg">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;