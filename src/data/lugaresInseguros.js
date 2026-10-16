
const lugaresInsegurosData = {
  Argentina: {
    bandera: "🇦🇷",
    resumen:
      "Prestá atención a los robos y al uso del celular en zonas turísticas y de mucho movimiento.",
    fuente:
      "https://www.gov.uk/foreign-travel-advice/argentina/safety-and-security",
    zonas: [
      {
        nombre: "La Boca, Buenos Aires",
        icono: "🏙️",
        nivel: "precaucion",
        etiqueta: "Mayor precaución",
        descripcion: "Zona turística con sectores de distinto nivel de seguridad.",
        riesgo: "Robos y arrebatos, especialmente fuera del circuito turístico.",
        recomendacion:
          "Recorré las áreas turísticas durante el día y organizá el traslado de ida y vuelta."
      },
      {
        nombre: "Estaciones de Retiro y Constitución",
        icono: "🚉",
        nivel: "precaucion",
        etiqueta: "Atención a tus pertenencias",
        descripcion: "Sectores de gran circulación de pasajeros.",
        riesgo: "Hurtos, arrebatos y robos de equipaje.",
        recomendacion:
          "Mantené bolsos y celular bajo control y evitá exhibir objetos de valor."
      },
      {
        nombre: "Microcentro y calle Florida",
        icono: "🚶",
        nivel: "precaucion",
        etiqueta: "Atención a tus pertenencias",
        descripcion: "Áreas comerciales y turísticas concurridas.",
        riesgo: "Hurtos y robos por distracción en lugares concurridos.",
        recomendacion:
          "Llevá la mochila cerrada y prestá atención a las personas que se acerquen."
      },
      {
        nombre: "Rosario, Santa Fe",
        icono: "📍",
        nivel: "alerta",
        etiqueta: "Informate antes de ir",
        descripcion: "La situación de seguridad puede variar según la zona.",
        riesgo: "Se registran hechos de violencia vinculados al crimen organizado.",
        recomendacion:
          "Consultá las alertas locales y evitá desplazamientos por zonas que las autoridades desaconsejen."
      }
    ],
    consejos: [
      "Evitá caminar distraído con el celular en la mano.",
      "Usá transportes habilitados y organizá los traslados nocturnos.",
      "En caso de robo, no te resistas."
    ]
  },

  Australia: {
    bandera: "🇦🇺",
    resumen:
      "En general, las precauciones se relacionan con hurtos oportunistas, vida nocturna y condiciones naturales.",
    fuente: "https://www.smartraveller.gov.au/destinations",
    zonas: [
      {
        nombre: "Distritos de vida nocturna",
        icono: "🌃",
        nivel: "precaucion",
        etiqueta: "Precaución nocturna",
        descripcion: "Zonas de bares y clubes en ciudades como Sídney y Melbourne.",
        riesgo: "Puede haber peleas, consumo excesivo de alcohol y robos oportunistas.",
        recomendacion:
          "Mantenete con tu grupo, vigilá tu bebida y organizá el regreso."
      },
      {
        nombre: "Playas aisladas",
        icono: "🏖️",
        nivel: "precaucion",
        etiqueta: "Precaución",
        descripcion: "Playas alejadas o con poca presencia de personas.",
        riesgo: "Riesgos ambientales, corrientes peligrosas y pertenencias desatendidas.",
        recomendacion:
          "Nadá entre las banderas habilitadas y no dejes objetos de valor sin supervisión."
      },
      {
        nombre: "Estaciones y centros concurridos",
        icono: "🚉",
        nivel: "atencion",
        etiqueta: "Atención",
        descripcion: "Terminales y sectores de tránsito intenso.",
        riesgo: "Hurtos ocasionales y pérdida de pertenencias.",
        recomendacion:
          "Vigilá el equipaje y guardá documentos y dinero en lugares seguros."
      }
    ],
    consejos: [
      "Respetá las advertencias sobre playas, incendios y fauna.",
      "Utilizá taxis o aplicaciones de transporte habilitadas.",
      "Revisá las recomendaciones locales de la ciudad que vas a visitar."
    ]
  },

  "Estados Unidos": {
    bandera: "🇺🇸",
    resumen:
      "La seguridad varía mucho entre ciudades y barrios. Revisá la situación de cada destino.",
    fuente: "https://travel.state.gov/en/international-travel/travel-advisories.html",
    zonas: [
      {
        nombre: "Alrededores de estaciones y terminales",
        icono: "🚇",
        nivel: "precaucion",
        etiqueta: "Precaución",
        descripcion: "Sectores de tránsito de grandes ciudades.",
        riesgo: "Puede haber hurtos, estafas y situaciones de inseguridad localizadas.",
        recomendacion:
          "Planificá la ruta, mantenete en sectores transitados y revisá las condiciones del área."
      },
      {
        nombre: "Zonas céntricas con poca circulación nocturna",
        icono: "🌙",
        nivel: "precaucion",
        etiqueta: "Precaución nocturna",
        descripcion: "Algunos sectores comerciales quedan vacíos después del horario laboral.",
        riesgo: "El riesgo puede aumentar en calles aisladas o poco iluminadas.",
        recomendacion:
          "Elegí calles iluminadas y utilizá transporte habilitado si tenés que recorrer largas distancias."
      },
      {
        nombre: "Áreas con alertas locales",
        icono: "🚧",
        nivel: "alerta",
        etiqueta: "Verificá las alertas",
        descripcion: "Sectores con incidentes recientes o restricciones de acceso.",
        riesgo: "Las condiciones pueden cambiar rápidamente.",
        recomendacion:
          "Consultá los avisos policiales y municipales antes de dirigirte a esas zonas."
      }
    ],
    consejos: [
      "No dejes equipaje ni objetos de valor a la vista dentro del auto.",
      "En emergencias, llamá al 911.",
      "Consultá la seguridad específica del barrio y no solamente la de la ciudad."
    ]
  },

  Brasil: {
    bandera: "🇧🇷",
    resumen:
      "En algunas grandes ciudades existen riesgos de robos y asaltos, incluso en zonas turísticas.",
    fuente: "https://www.smartraveller.gov.au/destinations/americas/brazil",
    zonas: [
      {
        nombre: "Favelas y áreas con conflictos armados",
        icono: "🚧",
        nivel: "alerta",
        etiqueta: "Evitá ingresar sin orientación oficial",
        descripcion: "La seguridad cambia considerablemente entre comunidades y sectores.",
        riesgo: "Puede haber enfrentamientos entre grupos criminales y fuerzas de seguridad.",
        recomendacion:
          "No ingreses por cuenta propia y respetá las advertencias de las autoridades locales."
      },
      {
        nombre: "Playas y paseos turísticos",
        icono: "🏖️",
        nivel: "precaucion",
        etiqueta: "Cuidá tus pertenencias",
        descripcion: "Áreas populares de ciudades como Río de Janeiro.",
        riesgo: "Arrebatos y robos de teléfonos, joyas y bolsos.",
        recomendacion:
          "Llevá solo lo necesario y no dejes objetos de valor sobre la arena sin supervisión."
      },
      {
        nombre: "Entornos de terminales y mercados",
        icono: "🚌",
        nivel: "precaucion",
        etiqueta: "Mayor atención",
        descripcion: "Sectores concurridos de grandes centros urbanos.",
        riesgo: "Robos oportunistas y estafas a turistas.",
        recomendacion:
          "Mantené el equipaje cerca y utilizá transportes oficiales."
      }
    ],
    consejos: [
      "Evitá caminar solo por lugares aislados durante la noche.",
      "No te resistas ante un asalto.",
      "Consultá las recomendaciones de seguridad de cada ciudad antes de recorrerla."
    ]
  },

  Inglaterra: {
    bandera: "🏴",
    resumen:
      "En Inglaterra, los riesgos para turistas suelen incluir robos de celulares, hurtos y problemas puntuales durante la noche.",
    fuente: "https://www.gov.uk/foreign-travel-advice",
    zonas: [
      {
        nombre: "West End y zonas de ocio de Londres",
        icono: "🌃",
        nivel: "precaucion",
        etiqueta: "Precaución nocturna",
        descripcion: "Áreas con teatros, pubs, clubes y gran movimiento turístico.",
        riesgo: "Hurtos, robos de celulares y situaciones vinculadas a la vida nocturna.",
        recomendacion:
          "Vigilá tus pertenencias y organizá el regreso, especialmente de madrugada."
      },
      {
        nombre: "Grandes estaciones ferroviarias",
        icono: "🚉",
        nivel: "atencion",
        etiqueta: "Atención",
        descripcion: "Terminales concurridas, como King's Cross y Victoria.",
        riesgo: "Hurtos oportunistas y pérdida de equipaje.",
        recomendacion:
          "Guardá el teléfono al consultar mapas y mantené el equipaje a la vista."
      },
      {
        nombre: "Calles poco transitadas de madrugada",
        icono: "🌙",
        nivel: "precaucion",
        etiqueta: "Precaución",
        descripcion: "Sectores aislados de cualquier ciudad.",
        riesgo: "La falta de circulación puede dificultar conseguir ayuda rápidamente.",
        recomendacion:
          "Elegí calles iluminadas y rutas conocidas; utilizá transporte autorizado."
      }
    ],
    consejos: [
      "Protegé el teléfono al caminar cerca de la calle.",
      "Usá transportes habilitados y verificá el último horario de regreso.",
      "Ante una emergencia policial, llamá al 999 o al 112."
    ]
  },

  Francia: {
    bandera: "🇫🇷",
    resumen:
      "En las grandes ciudades turísticas conviene prestar atención a los hurtos y a las aglomeraciones.",
    fuente: "https://www.diplomatie.gouv.fr/en/coming-to-france/",
    zonas: [
      {
        nombre: "Alrededores de la Torre Eiffel y el Louvre",
        icono: "🗼",
        nivel: "precaucion",
        etiqueta: "Atención a los hurtos",
        descripcion: "Sectores turísticos con gran cantidad de visitantes.",
        riesgo: "Carteristas, estafas y robos por distracción.",
        recomendacion:
          "Guardá tus objetos de valor y desconfiá de ofertas o peticiones de dinero inesperadas."
      },
      {
        nombre: "Metro y estaciones de París",
        icono: "🚇",
        nivel: "precaucion",
        etiqueta: "Mayor atención",
        descripcion: "Transporte público y estaciones concurridas.",
        riesgo: "Hurtos de bolsos y teléfonos, especialmente en horas pico.",
        recomendacion:
          "Llevá bolsos cerrados delante del cuerpo y evitá guardar el teléfono en bolsillos accesibles."
      },
      {
        nombre: "Sectores con manifestaciones",
        icono: "🚧",
        nivel: "alerta",
        etiqueta: "Evitá las concentraciones",
        descripcion: "Calles y plazas donde se desarrollen protestas.",
        riesgo: "Puede haber enfrentamientos, cierres de calles y alteraciones del transporte.",
        recomendacion:
          "Alejate de las concentraciones y seguí las instrucciones de las autoridades."
      }
    ],
    consejos: [
      "Vigilá tus pertenencias en atracciones y transporte público.",
      "Revisá posibles manifestaciones y cortes antes de salir.",
      "En una emergencia, llamá al 112."
    ]
  },

  Israel: {
    bandera: "🇮🇱",
    resumen:
      "La situación de seguridad puede cambiar rápidamente por conflictos y alertas. Verificá las recomendaciones antes de viajar.",
    fuente: "https://www.gov.uk/foreign-travel-advice/israel",
    zonas: [
      {
        nombre: "Áreas fronterizas con alertas oficiales",
        icono: "🚧",
        nivel: "alerta",
        etiqueta: "Verificá antes de viajar",
        descripcion: "Sectores próximos a fronteras o áreas afectadas por conflictos.",
        riesgo: "Puede haber ataques, cierres de vías y restricciones de acceso.",
        recomendacion:
          "No viajes a zonas desaconsejadas por las autoridades y seguí las instrucciones de seguridad."
      },
      {
        nombre: "Lugares con concentraciones o incidentes",
        icono: "👥",
        nivel: "precaucion",
        etiqueta: "Alejate de aglomeraciones",
        descripcion: "Plazas, centros urbanos o espacios públicos con alertas recientes.",
        riesgo: "Las manifestaciones y los incidentes pueden cambiar rápidamente de intensidad.",
        recomendacion:
          "Mantenete informado y abandoná el área si las autoridades lo indican."
      },
      {
        nombre: "Lugares públicos durante alertas de seguridad",
        icono: "🛡️",
        nivel: "alerta",
        etiqueta: "Seguí las alertas oficiales",
        descripcion: "Espacios públicos sujetos a instrucciones de protección civil.",
        riesgo: "Puede ser necesario buscar refugio o modificar el itinerario.",
        recomendacion:
          "Identificá los refugios indicados y seguí las instrucciones de las autoridades locales."
      }
    ],
    consejos: [
      "Comprobá las advertencias oficiales inmediatamente antes de viajar.",
      "Conocé los procedimientos de emergencia del lugar donde te alojás.",
      "No te acerques a zonas de conflicto ni cruces cierres de seguridad."
    ]
  },

  "Corea del Sur": {
    bandera: "🇰🇷",
    resumen:
      "Es importante prestar atención a las aglomeraciones, la vida nocturna y las indicaciones de seguridad.",
    fuente: "https://www.smartraveller.gov.au/destinations/asia/south-korea-republic-korea",
    zonas: [
      {
        nombre: "Distritos nocturnos de Seúl",
        icono: "🌃",
        nivel: "precaucion",
        etiqueta: "Precaución nocturna",
        descripcion: "Sectores de bares, clubes y entretenimiento.",
        riesgo: "Puede haber aglomeraciones, intoxicaciones y situaciones incómodas asociadas al consumo de alcohol.",
        recomendacion:
          "Permanecé con tu grupo y utilizá transporte oficial para regresar."
      },
      {
        nombre: "Cruces y estaciones concurridas",
        icono: "🚇",
        nivel: "atencion",
        etiqueta: "Atención",
        descripcion: "Zonas de gran circulación de peatones.",
        riesgo: "Las multitudes pueden dificultar el desplazamiento y la asistencia en una emergencia.",
        recomendacion:
          "Evitá empujones, seguí las indicaciones del personal y buscá rutas alternativas si hay saturación."
      },
      {
        nombre: "Zonas cercanas a la frontera intercoreana",
        icono: "🛡️",
        nivel: "alerta",
        etiqueta: "Solo con información oficial",
        descripcion: "Áreas sujetas a controles y restricciones específicas.",
        riesgo: "Puede haber limitaciones de acceso y medidas de seguridad especiales.",
        recomendacion:
          "Visitá únicamente lugares autorizados y respetá las instrucciones oficiales."
      }
    ],
    consejos: [
      "Revisá las indicaciones para visitar la zona desmilitarizada.",
      "En lugares concurridos, acordá un punto de encuentro con tu grupo.",
      "Respetá las normas locales y las instrucciones de emergencia."
    ]
  },

  China: {
    bandera: "🇨🇳",
    resumen:
      "Los viajeros deben considerar posibles estafas, normas locales estrictas y controles de seguridad.",
    fuente: "https://www.gov.uk/foreign-travel-advice/china",
    zonas: [
      {
        nombre: "Áreas turísticas muy concurridas",
        icono: "🏯",
        nivel: "atencion",
        etiqueta: "Atención",
        descripcion: "Atracciones y calles comerciales con gran afluencia.",
        riesgo: "Puede haber estafas dirigidas a turistas y pérdidas de pertenencias.",
        recomendacion:
          "Acordá precios antes de contratar servicios y comprá entradas en canales oficiales."
      },
      {
        nombre: "Alrededores de estaciones y mercados",
        icono: "🚉",
        nivel: "precaucion",
        etiqueta: "Precaución",
        descripcion: "Lugares con gran circulación de personas.",
        riesgo: "Riesgo de extravío de equipaje y estafas oportunistas.",
        recomendacion:
          "Mantené tus pertenencias controladas y utilizá servicios de transporte autorizados."
      },
      {
        nombre: "Edificios gubernamentales y áreas restringidas",
        icono: "🏛️",
        nivel: "precaucion",
        etiqueta: "Respetá las restricciones",
        descripcion: "Sectores con controles de acceso o vigilancia especial.",
        riesgo: "Fotografiar o acceder a determinadas instalaciones puede estar restringido.",
        recomendacion:
          "Respetá las señales, no ingreses sin autorización y seguí las indicaciones oficiales."
      }
    ],
    consejos: [
      "Informate sobre las leyes y restricciones locales antes de viajar.",
      "Conservá el pasaporte y la dirección del alojamiento.",
      "No participes de actividades que las autoridades locales hayan prohibido."
    ]
  },

  Italia: {
    bandera: "🇮🇹",
    resumen:
      "En las principales ciudades turísticas conviene prestar atención a los hurtos, las estafas y el equipaje.",
    fuente: "https://www.viaggiaresicuri.it/find-country/country/CHN",
    zonas: [
      {
        nombre: "Entornos de la estación Termini, Roma",
        icono: "🚉",
        nivel: "precaucion",
        etiqueta: "Mayor atención",
        descripcion: "Zona de conexión ferroviaria y transporte urbano.",
        riesgo: "Hurtos, estafas y robos oportunistas.",
        recomendacion:
          "Vigilá el equipaje y evitá aceptar ayuda no solicitada de desconocidos."
      },
      {
        nombre: "Alrededores de monumentos turísticos",
        icono: "🏛️",
        nivel: "precaucion",
        etiqueta: "Atención a los hurtos",
        descripcion: "Áreas concurridas de Roma, Florencia y otras ciudades.",
        riesgo: "Carteristas y estafas en lugares de gran afluencia.",
        recomendacion:
          "Usá bolsos cerrados y comprá entradas a través de sitios oficiales."
      },
      {
        nombre: "Transporte público en ciudades grandes",
        icono: "🚇",
        nivel: "atencion",
        etiqueta: "Atención",
        descripcion: "Trenes, autobuses y metros concurridos.",
        riesgo: "Hurtos de celulares, billeteras y equipaje.",
        recomendacion:
          "No pierdas de vista tus pertenencias al subir o bajar."
      }
    ],
    consejos: [
      "Prestá atención a las personas que ofrecen servicios no solicitados.",
      "Verificá los precios antes de aceptar un taxi o una excursión.",
      "En una emergencia, llamá al 112."
    ]
  },

  España: {
    bandera: "🇪🇸",
    resumen:
      "Las zonas turísticas y el transporte concurrido requieren atención frente a hurtos y estafas.",
    fuente: "https://www.exteriores.gob.es/",
    zonas: [
      {
        nombre: "Las Ramblas y zonas turísticas de Barcelona",
        icono: "🏙️",
        nivel: "precaucion",
        etiqueta: "Atención a los hurtos",
        descripcion: "Paseos y espacios con gran cantidad de visitantes.",
        riesgo: "Carteristas y robos por distracción.",
        recomendacion:
          "Llevá el bolso cerrado y evitá dejar el celular sobre mesas o mostradores."
      },
      {
        nombre: "Entornos de estaciones y transporte",
        icono: "🚉",
        nivel: "precaucion",
        etiqueta: "Mayor atención",
        descripcion: "Estaciones ferroviarias y de metro en ciudades grandes.",
        riesgo: "Hurtos de equipaje y objetos personales.",
        recomendacion:
          "Mantené las pertenencias a la vista y usá los canales oficiales para comprar pasajes."
      },
      {
        nombre: "Zonas de ocio nocturno",
        icono: "🌃",
        nivel: "atencion",
        etiqueta: "Precaución nocturna",
        descripcion: "Calles con bares, discotecas y gran circulación nocturna.",
        riesgo: "Robos oportunistas, estafas y situaciones vinculadas al alcohol.",
        recomendacion:
          "Viajá con personas de confianza y vigilá tus bebidas y pertenencias."
      }
    ],
    consejos: [
      "No guardes la billetera en bolsillos traseros.",
      "Utilizá transportes oficiales y acordá los traslados de madrugada.",
      "En una emergencia, llamá al 112."
    ]
  },

  Chile: {
    bandera: "🇨🇱",
    resumen:
      "En ciudades y destinos turísticos conviene prestar atención a los robos, especialmente en zonas concurridas.",
    fuente: "https://www.smartraveller.gov.au/destinations/americas/chile",
    zonas: [
      {
        nombre: "Centro de Santiago",
        icono: "🏙️",
        nivel: "precaucion",
        etiqueta: "Atención a tus pertenencias",
        descripcion: "Sectores comerciales, históricos y de gran circulación.",
        riesgo: "Hurtos, arrebatos de celulares y robos por distracción.",
        recomendacion:
          "Guardá el teléfono cuando no lo utilices y evitá exhibir objetos de valor."
      },
      {
        nombre: "Estaciones y terminales de transporte",
        icono: "🚉",
        nivel: "precaucion",
        etiqueta: "Mayor atención",
        descripcion: "Sectores concurridos de Santiago y otras ciudades.",
        riesgo: "Robos oportunistas de equipaje y pertenencias.",
        recomendacion:
          "Mantené las mochilas cerradas y no pierdas de vista tus objetos."
      },
      {
        nombre: "Áreas aisladas después del anochecer",
        icono: "🌙",
        nivel: "atencion",
        etiqueta: "Precaución nocturna",
        descripcion: "Calles, parques y paseos con poca circulación.",
        riesgo: "La escasa iluminación puede aumentar la vulnerabilidad del viajero.",
        recomendacion:
          "Planificá el recorrido y elegí calles transitadas e iluminadas."
      }
    ],
    consejos: [
      "No dejes equipaje visible dentro de un auto.",
      "Consultá las alertas locales antes de visitar áreas alejadas.",
      "En Chile, el número de Carabineros es 133."
    ]
  }
};

export default lugaresInsegurosData;
