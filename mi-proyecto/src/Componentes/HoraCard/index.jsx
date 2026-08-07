import "./index.css";


function HoraCard({
    pais,
    hora,
    fecha,
    icono = "🕒"
}) {


    return (

        <div className="hora-card">


            <div className="hora-icono">
                {icono}
            </div>


            <h2>
                {pais}
            </h2>


            <div className="hora-valor">

                {hora}

            </div>


            <p>
                {fecha}
            </p>


        </div>

    );

}


export default HoraCard;