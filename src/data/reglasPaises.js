const reglasPaises = {
  Argentina: {
    bandera: "🇦🇷",

    documentos: [
      "Los ciudadanos argentinos pueden ingresar con DNI vigente a países del Mercosur y asociados.",
      "Para otros destinos se recomienda viajar con pasaporte vigente.",
      "Verificá que el documento esté en buen estado y vigente."
    ],

    entrada: [
      "Los requisitos de entrada dependen de la nacionalidad del viajero.",
      "Algunos países pueden solicitar visa o autorización electrónica.",
      "Se puede solicitar comprobante de alojamiento o pasaje de regreso."
    ],

    aduana: [
      "Declarar productos o bienes cuando corresponda.",
      "Existen límites para el ingreso de dinero y determinados productos.",
      "No ingresar alimentos o productos de origen animal o vegetal prohibidos."
    ],

    comportamiento: [
      "Respetar las leyes y normas locales.",
      "Cuidar los espacios públicos y patrimoniales.",
      "Respetar las costumbres y tradiciones del lugar."
    ],

    consejos: [
      "Guardá una copia digital de tus documentos.",
      "Contratá un seguro de viaje cuando sea recomendable.",
      "Consultá siempre las fuentes oficiales antes de viajar."
    ]
  },

  Australia: {
    bandera: "🇦🇺",

    documentos: [
      "Se necesita pasaporte vigente para ingresar.",
      "La mayoría de los visitantes necesitan una visa o autorización de viaje.",
      "El pasaporte debe cumplir con los requisitos de validez establecidos."
    ],

    entrada: [
      "Es necesario contar con la autorización correspondiente antes del viaje.",
      "Australia tiene controles migratorios y sanitarios estrictos.",
      "Pueden solicitar información sobre alojamiento y motivo del viaje."
    ],

    aduana: [
      "Australia tiene normas muy estrictas sobre alimentos, plantas y productos animales.",
      "Los productos que ingresen deben declararse cuando corresponda.",
      "No ingresar productos prohibidos sin la autorización correspondiente."
    ],

    comportamiento: [
      "Respetar las leyes australianas.",
      "Está prohibido arrojar basura en espacios públicos.",
      "Respetar las normas de seguridad y las indicaciones de las autoridades."
    ],

    consejos: [
      "Declarar siempre los alimentos y productos de origen animal o vegetal.",
      "Llevar una copia de la documentación de viaje.",
      "Revisar los requisitos de entrada antes de viajar."
    ]
  },

  "Estados Unidos": {
    bandera: "🇺🇸",

    documentos: [
      "Se necesita pasaporte vigente para ingresar.",
      "Dependiendo de la nacionalidad, puede ser necesaria una visa.",
      "Algunos viajeros pueden utilizar una autorización electrónica de viaje."
    ],

    entrada: [
      "Los viajeros deben cumplir con los requisitos migratorios correspondientes.",
      "Pueden realizarse controles migratorios al llegar.",
      "Es posible que se solicite información sobre alojamiento y motivo del viaje."
    ],

    aduana: [
      "Los bienes y productos sujetos a declaración deben informarse.",
      "Existen límites y restricciones para alimentos, medicamentos y otros productos.",
      "El dinero y determinados instrumentos financieros pueden estar sujetos a declaración."
    ],

    comportamiento: [
      "Respetar las leyes federales y estatales.",
      "Cumplir las normas de los espacios públicos.",
      "Respetar las indicaciones de las autoridades."
    ],

    consejos: [
      "Guardar copias del pasaporte y documentación.",
      "Revisar los requisitos migratorios antes de viajar.",
      "Considerar contratar un seguro médico o de viaje."
    ]
  },

  Brasil: {
    bandera: "🇧🇷",

    documentos: [
      "Los ciudadanos de países del Mercosur pueden ingresar utilizando documento de identidad válido.",
      "También se puede ingresar con pasaporte vigente.",
      "El documento debe estar en buenas condiciones."
    ],

    entrada: [
      "Los requisitos pueden variar según la nacionalidad.",
      "Para determinadas nacionalidades puede ser necesaria una visa.",
      "Pueden solicitar comprobante de alojamiento o pasaje de salida."
    ],

    aduana: [
      "Se deben declarar determinados bienes y productos.",
      "Existen restricciones para alimentos, plantas y productos de origen animal.",
      "Las autoridades pueden realizar controles de equipaje."
    ],

    comportamiento: [
      "Respetar las leyes y normas locales.",
      "Cuidar los espacios naturales y públicos.",
      "Respetar las costumbres locales."
    ],

    consejos: [
      "Llevar documentación de respaldo.",
      "Guardar copias digitales de los documentos.",
      "Consultar los requisitos actualizados antes de viajar."
    ]
  },

  Inglaterra: {
    bandera: "🏴",

    documentos: [
      "Se necesita pasaporte válido para ingresar al Reino Unido.",
      "El DNI argentino no reemplaza al pasaporte para este destino.",
      "Dependiendo de la nacionalidad, puede ser necesaria una autorización electrónica o visa."
    ],

    entrada: [
      "Los requisitos dependen de la nacionalidad y del motivo del viaje.",
      "Pueden realizarse controles migratorios al ingresar.",
      "Pueden solicitar información sobre alojamiento y duración de la estadía."
    ],

    aduana: [
      "Existen restricciones para alimentos, productos animales y vegetales.",
      "Algunos productos deben ser declarados.",
      "Existen límites para determinadas cantidades de productos y dinero."
    ],

    comportamiento: [
      "Respetar las leyes del Reino Unido.",
      "En Inglaterra se conduce por la izquierda.",
      "Respetar las normas de transporte y espacios públicos."
    ],

    consejos: [
      "Revisar los requisitos específicos para ingresar al Reino Unido.",
      "Llevar el pasaporte y documentación de viaje en un lugar seguro.",
      "Considerar un seguro de viaje."
    ]
  },

  Francia: {
    bandera: "🇫🇷",

    documentos: [
      "Se necesita pasaporte válido para ingresar.",
      "Los ciudadanos de determinados países pueden ingresar sin visa para estadías cortas.",
      "El pasaporte debe cumplir con los requisitos de validez correspondientes."
    ],

    entrada: [
      "Francia forma parte del espacio Schengen.",
      "Pueden solicitar comprobante de alojamiento y pasaje de regreso.",
      "También pueden solicitar demostración de medios económicos suficientes."
    ],

    aduana: [
      "Existen límites para el ingreso de dinero y determinados productos.",
      "Los productos de origen animal y vegetal pueden estar sujetos a restricciones.",
      "Los bienes que superen determinados límites deben declararse."
    ],

    comportamiento: [
      "Respetar las leyes francesas.",
      "Mantener una conducta adecuada en espacios públicos.",
      "Respetar monumentos y lugares históricos."
    ],

    consejos: [
      "Llevar una copia del pasaporte.",
      "Guardar documentación importante de manera digital.",
      "Revisar los requisitos del espacio Schengen antes del viaje."
    ]
  },

  Israel: {
    bandera: "🇮🇱",

    documentos: [
      "Se necesita pasaporte vigente para ingresar.",
      "Los requisitos de visa dependen de la nacionalidad.",
      "El documento debe estar en buenas condiciones."
    ],

    entrada: [
      "Los controles de seguridad pueden ser exhaustivos.",
      "Pueden realizarse preguntas sobre el motivo y duración del viaje.",
      "Es importante contar con la documentación de alojamiento y viaje."
    ],

    aduana: [
      "Los productos sujetos a restricciones deben ser declarados.",
      "Existen controles de seguridad en aeropuertos y pasos fronterizos.",
      "No ingresar objetos prohibidos."
    ],

    comportamiento: [
      "Respetar las leyes y normas locales.",
      "Respetar los lugares religiosos y sus normas.",
      "Seguir las indicaciones de las autoridades."
    ],

    consejos: [
      "Consultar las recomendaciones de viaje antes de viajar.",
      "Llevar documentación de respaldo.",
      "Mantenerse informado sobre las condiciones de seguridad."
    ]
  },

  "Corea del Sur": {
    bandera: "🇰🇷",

    documentos: [
      "Se necesita pasaporte vigente.",
      "Dependiendo de la nacionalidad, puede ser necesaria una autorización electrónica o visa.",
      "El pasaporte debe encontrarse en buen estado."
    ],

    entrada: [
      "Los requisitos dependen de la nacionalidad y duración de la estadía.",
      "Pueden realizarse controles migratorios al ingresar.",
      "Pueden solicitar información sobre el motivo del viaje."
    ],

    aduana: [
      "Los productos sujetos a restricciones deben declararse.",
      "Existen normas específicas para alimentos y productos de origen animal.",
      "Determinados medicamentos pueden estar sujetos a controles."
    ],

    comportamiento: [
      "Respetar las normas y costumbres locales.",
      "Mantener una conducta respetuosa en lugares religiosos.",
      "Respetar las normas de transporte público."
    ],

    consejos: [
      "Llevar una copia del pasaporte.",
      "Tener anotada la dirección del alojamiento.",
      "Revisar los requisitos de entrada antes de viajar."
    ]
  },

  China: {
    bandera: "🇨🇳",

    documentos: [
      "Se necesita pasaporte vigente.",
      "Dependiendo de la nacionalidad y motivo del viaje puede ser necesaria una visa.",
      "El pasaporte debe cumplir con los requisitos de validez establecidos."
    ],

    entrada: [
      "Los requisitos migratorios dependen del motivo y duración del viaje.",
      "Pueden solicitar información sobre alojamiento y actividades.",
      "Es necesario cumplir con los controles migratorios correspondientes."
    ],

    aduana: [
      "Existen restricciones para determinados alimentos, medicamentos y productos.",
      "Los bienes sujetos a declaración deben informarse.",
      "Las autoridades pueden realizar controles de equipaje."
    ],

    comportamiento: [
      "Respetar las leyes y normas locales.",
      "Respetar los lugares históricos y religiosos.",
      "Cumplir las normas establecidas para espacios públicos."
    ],

    consejos: [
      "Llevar copias de los documentos importantes.",
      "Tener disponible la información del alojamiento.",
      "Revisar los requisitos de visa antes de viajar."
    ]
  },

  Italia: {
    bandera: "🇮🇹",

    documentos: [
      "Se necesita pasaporte válido para ingresar.",
      "Italia forma parte del espacio Schengen.",
      "Dependiendo de la nacionalidad puede ser necesaria una visa."
    ],

    entrada: [
      "Pueden solicitar comprobante de alojamiento.",
      "Pueden solicitar pasaje de regreso o continuación del viaje.",
      "También pueden solicitar demostración de medios económicos."
    ],

    aduana: [
      "Existen restricciones para determinados alimentos y productos.",
      "El dinero y determinados bienes pueden estar sujetos a declaración.",
      "Los productos de origen animal o vegetal pueden tener restricciones."
    ],

    comportamiento: [
      "Respetar las leyes italianas.",
      "Respetar monumentos, iglesias y lugares históricos.",
      "Cumplir las normas de los espacios públicos."
    ],

    consejos: [
      "Llevar una copia del pasaporte.",
      "Revisar los requisitos del espacio Schengen.",
      "Tener documentación de viaje accesible."
    ]
  },

  España: {
    bandera: "🇪🇸",

    documentos: [
      "Se necesita pasaporte válido para ingresar.",
      "España forma parte del espacio Schengen.",
      "Dependiendo de la nacionalidad puede ser necesaria una visa."
    ],

    entrada: [
      "Pueden solicitar comprobante de alojamiento.",
      "Pueden solicitar pasaje de regreso o continuación del viaje.",
      "Pueden solicitar demostración de medios económicos suficientes."
    ],

    aduana: [
      "Existen límites para el ingreso de dinero y determinados productos.",
      "Los alimentos y productos de origen animal pueden estar sujetos a restricciones.",
      "Los bienes que correspondan deben ser declarados."
    ],

    comportamiento: [
      "Respetar las leyes españolas.",
      "Respetar monumentos y lugares históricos.",
      "Cumplir las normas de los espacios públicos."
    ],

    consejos: [
      "Llevar una copia digital del pasaporte.",
      "Revisar los requisitos de entrada antes de viajar.",
      "Considerar contratar un seguro de viaje."
    ]
  },

  Chile: {
    bandera: "🇨🇱",

    documentos: [
      "Los ciudadanos de países del Mercosur pueden ingresar con documento de identidad válido.",
      "También se puede ingresar con pasaporte vigente.",
      "El documento debe estar en buen estado."
    ],

    entrada: [
      "Los requisitos pueden variar según la nacionalidad.",
      "Pueden solicitar información sobre alojamiento y motivo del viaje.",
      "Es importante contar con documentación de viaje válida."
    ],

    aduana: [
      "Chile posee controles estrictos para productos de origen vegetal y animal.",
      "Los productos que ingresen deben declararse cuando corresponda.",
      "No ingresar productos prohibidos sin autorización."
    ],

    comportamiento: [
      "Respetar las leyes y normas locales.",
      "Cuidar los espacios naturales y patrimoniales.",
      "Respetar las indicaciones de las autoridades."
    ],

    consejos: [
      "Declarar los productos de origen vegetal o animal.",
      "Guardar copias digitales de los documentos.",
      "Revisar los requisitos de ingreso antes de viajar."
    ]
  }
};

export default reglasPaises;