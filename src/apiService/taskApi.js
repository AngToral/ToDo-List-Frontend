const baseUrl = 'http://localhost:3000'

const getAllTasks = async () => {
    const response = await fetch(`${baseUrl}/tasks`)
    const tareas = await response.json();
    return tareas
}

const getOneTask = async (id) => {
    const response = await fetch(`${baseUrl}/tasks/${id}`)
    const tarea = await response.json();
    return tarea
}

const addTask = async (taskData) => {
    const response = await fetch(`${baseUrl}/tasks`, {
        method: 'POST', 
        body: JSON.stringify(taskData), 
        headers: {"Content-Type": "application/json"}
    })
    const newTarea = await response.json();
    return newTarea
}

const deleteTask = async (id) => {
    const response = await fetch(`${baseUrl}/tasks/${id}`, {method: 'DELETE'})
    const tareaEliminada = await response.json();
    return tareaEliminada
}

const updateTask = async (id, taskData) => {
    const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: 'PUT', 
        body: JSON.stringify(taskData), 
        headers: {"Content-Type": "application/json"}
    })
    const tareaCambiada = await response.json();
    return tareaCambiada
}

const okTask = async (id) => {
    const response = await fetch(`${baseUrl}/tasks/ok/${id}`, {method: 'PATCH'})
    const tareaLista = await response.json();
    return tareaLista
}

const progTask = async (id) => {
    const response = await fetch(`${baseUrl}/tasks/prog/${id}`, {method: 'PATCH'})
    const tareaLista = await response.json();
    return tareaLista
}

const pendTask = async (id) => {
    const response = await fetch(`${baseUrl}/tasks/pending/${id}`, {method: 'PATCH'})
    const tareaLista = await response.json();
    return tareaLista
}

export default {
    getAllTasks, 
    addTask,
    deleteTask,
    getOneTask,
    updateTask,
    okTask,
    progTask,
    pendTask
}