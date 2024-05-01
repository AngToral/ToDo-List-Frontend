import { useState } from 'react'
import './App.css'
import { Card } from './Components/Card'
import './Form.css'
import { Welcome } from './Components/Welcome'
import Swal from 'sweetalert2'

// const tarea = [
//   {
//     id:"0bjh",
//     date: "2023-01-08", 
//     status: "¡Completada!",
//     title: 'Perros 1',
//     hash: 'Bañar a los perros',
//     due: "2023-05-08",
// }
// ]

function App() {

  const [cards, setCards] = useState([])
  const [title, setTitle] = useState("")
  const [due, setDue] = useState("")
  const [hash, setHash] = useState("")
  const [editId, setEditId] = useState(null)
  const [open, setOpen] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const [filteringCards, setFilteringCards] = useState(null)

  const editarTask = (id) => {
    const newList = cards.find(tarea => tarea.id === id);
    setOpen(!open)
    setTitle(newList.title)
    setDue(newList.due)
    setHash(newList.hash)
    setEditId(id)
  }

  const addTask = () => {
    if (editId !== null) {
      const newList = cards.find(tarea => tarea.id === editId);
      newList.title = title
      setTitle("")
      newList.due = due
      setDue("")
      newList.hash = hash
      setHash("")
      setEditId(null)
      setOpen(false)
    } else {
      const todayDate = new Date().toISOString().split("T")[0]
      const newTask = {id: crypto.randomUUID(), date: todayDate, title, hash, due, status: "Pendiente"}
      const newList = cards.concat(newTask);
      if (title === "" || due ==="" || hash === "" ) return;
      setCards(newList)
      setTitle("")
      setDue("")
      setHash("")
      setOpen(false)
    }
  }

  const eliminarForm = () => {
    setTitle("")
    setDue("")
    setHash("")
  }

const eliminarTask = (idCard) => {
  const taskToRemoveTitle = cards.find(tarea => tarea.id === idCard).title
  const newList = cards.filter(tarea => tarea.id !== idCard);
  Swal.fire({
    title: "¿Seguro que deseas eliminar la tarea?",
    text: `${taskToRemoveTitle}`,
    icon: "warning",
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: `No`
  }).then(respuesta=>{
    if(respuesta.isConfirmed) {
      Swal.fire({
        title: "Haz eliminado corretamente la tarea",
        icon: "success"})
        setCards(newList)
        setFilteringCards(newList)
    }
  })
}

const cambiarEstado = (idCard, estado) => {
  setCards(prevCards => {
    return prevCards.map(tarea => {
      if (tarea.id === idCard) {
        return {...tarea, status: estado};
      } else {
        return tarea;
      }
    });
  });
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
          key={tarea.id}
          id={tarea.id}
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
          key={tarea.id}
          id={tarea.id}
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
