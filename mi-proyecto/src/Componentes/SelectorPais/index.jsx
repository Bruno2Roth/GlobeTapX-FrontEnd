import "./index.css";


function SelectorPais({
    paises,
    paisSeleccionado,
    cambiarPais
}) {


    return (

        <div className="selector-card">

            <label>
                Seleccionar país
            </label>


            <select
                value={paisSeleccionado}
                onChange={(e)=>cambiarPais(e.target.value)}
            >

                <option value="">
                    Seleccionar
                </option>


                {
                    paises.map((pais,index)=>(

                        <option
                            key={index}
                            value={pais}
                        >

                            {pais}

                        </option>

                    ))
                }

            </select>


        </div>

    );

}


export default SelectorPais;