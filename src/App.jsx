import { useEffect, useState } from 'react'
import './App.css'
import { Card } from './Components/Card'
import './Form.css'
import { Welcome } from './Components/Welcome'
import Swal from 'sweetalert2'
import taskApi from './apiService/taskApi'

function App() {

  const [cards, setCards] = useState([])
  const [title, setTitle] = useState("")
  const [due, setDue] = useState("")
  const [hash, setHash] = useState("")
  const [editId, setEditId] = useState(null)
  const [open, setOpen] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const [filteringCards, setFilteringCards] = useState(null)

  const [dummy, refresh] = useState(false)
  
  const getTasks = async () => {
    const tareas = await taskApi.getAllTasks();
    setCards(tareas)
  }

  useEffect(() => {
    getTasks()
  }, [dummy])

  const addTask = async () => {
    if (editId !== null) {
      await taskApi.updateTask(editId,{title, due, hash})
      refresh(!dummy)
      setTitle("")
      setDue("")
      setHash("")
      setEditId(null)
      setOpen(false)
    }
    else {
    if (title === "" || due ==="" || hash === "" ) return;
    await taskApi.addTask({title, due, hash})
    refresh(!dummy)
    setTitle("")
    setDue("")
    setHash("")
    setOpen(false)
    }
  };

  const editarTask = async (idCard) => {
    const tarea = await taskApi.getOneTask(idCard);
    setOpen(!open)
    setTitle(tarea.title)
    setDue(tarea.due)
    setHash(tarea.hash)
    setEditId(idCard)
  }

  const eliminarForm = () => {
    setTitle("")
    setDue("")
    setHash("")
  }

const eliminarTask = async (idCard) => {
  const tarea = await taskApi.getOneTask(idCard);
  const taskToRemoveTitle = tarea.title
  console.log(tarea)
  Swal.fire({
    title: "¿Seguro que deseas eliminar la tarea?",
    text: `${taskToRemoveTitle}`,
    icon: "warning",
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: `No`
  }).then( async respuesta=>{
    if(respuesta.isConfirmed) {
      Swal.fire({
        title: "Haz eliminado corretamente la tarea",
        icon: "success"})
        await taskApi.deleteTask(idCard)
        refresh(!dummy)
    }
  })
}

const cambiarEstado = async (idCard, estado) => {
    if (estado === "¡Completada!") {
      await taskApi.okTask(idCard)
      refresh(!dummy)
    }
    if (estado === "En Proceso...") {
      await taskApi.progTask(idCard)
      refresh(!dummy)
    }
    if (estado === "Pendiente") {
      await taskApi.pendTask(idCard)
      refresh(!dummy)
    }
}

const filteredCards = (e) => {
  setFiltering(true)
  const newList = [...cards]
  
  if(e.target.value === "All") {
    setFiltering(false)
  }
  if (e.target.value === "Vencida") {
    const vencida = newList.filter(element => new Date(element.due) <= new Date())
    setFilteringCards(vencida)
  }
  if (e.target.value === "Pendiente") {
    const vencida = newList.filter(element => element.status === "Pendiente")
    setFilteringCards(vencida)
  }
  if (e.target.value === "Proceso") {
    const vencida = newList.filter(element => element.status === "En Proceso...")
    setFilteringCards(vencida)
  }
  if (e.target.value === "Completada") {
    const vencida = newList.filter(element => element.status === "¡Completada!")
    setFilteringCards(vencida)
  }
};

const sortList = (e) => {
  const sortedCards = [...cards];
  
  if(e.target.value === "due") {
      sortedCards.sort((a, b) => (new Date(a.due)) - (new Date(b.due)))
      setCards(sortedCards)
  } else if (e.target.value === "creation") {
      sortedCards.sort((a, b) => (new Date(b.due)) - (new Date(a.due)))
      setCards(sortedCards)
  }
}

const vencidas = cards.filter((element) => (new Date(element.due) <= new Date())).length
const pendientes = cards.filter((element) => ((element.status) === "Pendiente")).length
const procesos = cards.filter((element) => ((element.status) === "En Proceso...")).length
const completas = cards.filter((element) => ((element.status) === "¡Completada!")).length

  return (
    <>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    <div className='sidebar'>
      <button className="createtask" onClick={() => {setOpen(!open)}}>Nueva Tarea<span className="material-symbols-outlined">add_task</span></button>
      <div className='cajafilter'>
        <p className='filtro'>Filtro<span className="material-symbols-outlined">filter_list</span></p>
        <button className='botonfilter' value="All" onClick={filteredCards}>Todas</button>
        <button className='botonfilter' value="Pendiente" onClick={filteredCards}>Pendientes</button>
        <button className='botonfilter' value="Proceso" onClick={filteredCards}>En Proceso</button>
        <button className='botonfilter' value="Completada" onClick={filteredCards}>Completadas</button>
        <button className='botonfilter' value="Vencida" onClick={filteredCards}>Vencidas</button>
      </div>
      <div className='cajasort'>
        <p className='ordenar'>Ordenar <span className="material-symbols-outlined">sort</span></p>
        <button className='botonfilter' value="due" onClick={sortList}>Vencimiento</button>
        <button className='botonfilter' value="creation" onClick={sortList}>Creación</button>
      </div>
      <div className='stats'>
        <p>Pendientes: {pendientes}</p>
        <p>En Proceso: {procesos}</p>
        <p>Completadas: {completas}</p>
        <p>Vencidas: {vencidas}</p>
      </div>
    </div>
    <div className='dashboard'>
        { open ?     <>
    <div className='cajaForm'>
        <div className="form">
            <label>Título: </label><input value={title} onChange={e => setTitle(e.target.value)} /> <br />
            <label>Vence el: </label><input value={due} type='date' onChange={e => setDue(e.target.value)} /> <br />
            <label>Tarea: </label><textarea value={hash} onChange={e => setHash(e.target.value)}/>
        </div>
        <div>
            <button className="botonConf" onClick={addTask}><span className="material-symbols-outlined">task</span></button>
            <button className="botonConf" onClick={eliminarForm}><span className="material-symbols-outlined">backspace</span></button>
        </div>
    </div>
    </> : <Welcome></Welcome> } 

      <div className='list'>
        {cards.length === 0 && <p className='noTask'>¡No hay tareas!</p>}
        {filtering && filteringCards.length === 0 && <p className='noTask'>¡No hay tareas para ese filtro!</p>}
        {filtering ? 
        <>
        {filteringCards.map((tarea) =>
          <Card
          onDelete={eliminarTask}
          onEdit={editarTask}
          onChangeStatus={cambiarEstado}
          key={tarea._id}
          id={tarea._id}
          status={tarea.status}
          date={tarea.date}
          title={tarea.title}
          hash={tarea.hash}
          due={tarea.due}
          ></Card>
        )}
        </> :
        <>
        {cards.map((tarea) =>
          <Card
          onDelete={eliminarTask}
          onEdit={editarTask}
          onChangeStatus={cambiarEstado}
          key={tarea._id}
          id={tarea._id}
          status={tarea.status}
          date={tarea.date}
          title={tarea.title}
          hash={tarea.hash}
          due={tarea.due}
          ></Card>
          )}
        </>}
      </div>
    </div>
    </>
  )
}

export default App
