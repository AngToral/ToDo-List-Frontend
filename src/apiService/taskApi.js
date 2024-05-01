const baseUrl = 'http://localhost:3000'

const getAllTasks = async () => {
    const response = await fetch(`${baseUrl}/tasks`)
    const tareas = await response.json();
    return tareas
}

const addTask = async (taskData) => {
    const response = await fetch(`${baseUrl}/tasks`, {method: 'POST', body: JSON.stringify(taskData), headers: {"Content-Type": "application/json"}})
    const newTarea = await response.json();
    return newTarea
}

export default {
    getAllTasks, 
    addTask
}