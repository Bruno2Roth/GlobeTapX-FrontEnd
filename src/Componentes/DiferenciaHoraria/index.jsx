import "./index.css";


function DiferenciaHoraria({ diferencia }) {

    return (

        <div className="diferencia-card">

            <div className="diferencia-icono">
                🌎
            </div>

            <div>

                <h3>
                    Diferencia horaria
                </h3>

                <p>
                    {diferencia}
                </p>

            </div>

        </div>

    );

}


export default DiferenciaHoraria;