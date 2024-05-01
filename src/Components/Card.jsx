import './Card.css'

export const Card = ({id, title, hash, due, onDelete, onEdit, onChangeStatus, status}) => {


    return (
        <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <div className="taskCreada">
            <div className='cajaEstado'>
                <button className="botonStatus boton green" onClick={() => onChangeStatus(id, "¡Completada!")}><span className="material-symbols-outlined">check</span></button>
                <button className="botonStatus boton yellow" onClick={() => onChangeStatus(id, "En Proceso...")}><span className="material-symbols-outlined">pending</span></button>
                <button className="botonStatus boton red" onClick={() => onChangeStatus(id, "Pendiente")}><span className="material-symbols-outlined">close</span></button>
                <p className='estado'>{status}</p>
            </div>

            <div className="card">
                <p className='titulo'>{title}</p>
                <p className='tarea' >{hash}</p>
                <p className='due'>{new Date (due).toISOString().split("T")[0]}</p> <p className='vencida'>{new Date(due) <= new Date() ? "¡Vencida!" : null}</p>
            </div>

            <div className='cajaAction'>
                <button className="botonAction boton" onClick={() => onEdit(id)}><span className="material-symbols-outlined">edit</span></button>
                <button className='botonAction boton' onClick={() => onDelete(id)}><span className="material-symbols-outlined">delete</span></button>
            </div>
        </div>
        </>
    )
}