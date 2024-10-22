const addButton = document.querySelector("#addTaskButton")
const searchInput = document.querySelector("#search")
const tasks = document.querySelector(".tasks")

//localStorage.clear()

window.addEventListener("load", (event) => {
    showToDoList()
})

addButton.addEventListener("click", () => {
    const taskDate = document.querySelector("#date").value
    const taskContent = document.querySelector("#content").value

    document.querySelector("#date").value = ""
    document.querySelector("#content").value = ""

    console.log(taskDate)
    console.log(new Date().getTime())
    if( 
        taskContent.length >= 2 && 
        taskContent.length <= 255 && 
        (
            taskDate === "" || 
            new Date(taskDate).getTime() > new Date().getTime() 
        )
    ){
        setLocalStorage(taskContent, taskDate)
        window.focus()
    }
})

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase()
    if (searchTerm.length >= 2) {
        filterTasks(searchTerm)
    } else {
        showToDoList() 
    }
})

function filterTasks(searchTerm) {
    tasks.innerHTML = "" 
    Object.keys(localStorage).forEach((key) => {
        const newTask = JSON.parse(localStorage.getItem(key))[0]
        if (newTask && newTask.taskContent.toLowerCase().includes(searchTerm)) {
            createTaskElement(
                highlightText(newTask.taskContent, searchTerm), 
                newTask.taskDate,
                newTask.taskIndex
            )
        }
    })
}

function highlightText(taskContent, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return taskContent.replace(regex, '<strong>$1</strong>')
}

function setLocalStorage(taskContent, taskDate) {
    let taskIndex = new Date().getTime()

    const taskData = { taskContent, taskDate, taskIndex }

    localStorage.setItem(taskIndex, JSON.stringify([taskData]))
    showToDoList()
}

function showToDoList() {
    tasks.innerHTML = ""
    Object.keys(localStorage).forEach((key) => {
        const newTask = JSON.parse(localStorage.getItem(key))[0]
        if (newTask) {
            createTaskElement(
                newTask.taskContent,
                newTask.taskDate,
                newTask.taskIndex
            )
        }
    })
}
bIsEditing = false
function createTaskElement(taskContent, taskDate, index) {
    const contentElement = document.createElement("p")
    contentElement.innerHTML = taskContent + " " + taskDate 

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Usuń"
    deleteButton.setAttribute("data-index", index)
    deleteButton.addEventListener("click", () => {
        localStorage.removeItem(index)
        deleteButton.parentElement.remove()
    })

    const taskElement = document.createElement("div")
    taskElement.setAttribute("data-index", index)
    taskElement.addEventListener("click", () => {
        if(bIsEditing === false){
            bIsEditing = true
            editTask(contentElement, taskContent, index)
        }
    })
    taskElement.appendChild(contentElement)
    taskElement.appendChild(deleteButton)

    tasks.appendChild(taskElement)
}

function editTask(contentElement, text, index) {
    const currentContent = text


    const inputElement = document.createElement("input")
    inputElement.type = "text"
    inputElement.value = currentContent

    const dateElement = document.createElement("input")
    dateElement.type = "date"

    contentElement.innerHTML = "" 
    contentElement.appendChild(inputElement)
    contentElement.appendChild(dateElement)

    inputElement.addEventListener("blur", () => {
        bIsEditing = false
        updateTaskInLocalStorage(index, inputElement.value, dateElement.value)
        contentElement.innerHTML = inputElement.value + " " + dateElement.value
    })

    dateElement.addEventListener("blur", () => {
        bIsEditing = false
        updateTaskInLocalStorage(index, inputElement.value, dateElement.value)
        contentElement.innerHTML = inputElement.value + " " + dateElement.value
    })
}

function updateTaskInLocalStorage(index, updatedContent, updatedDate) {
    const taskData = JSON.parse(localStorage.getItem(index))[0]
    taskData.taskContent = updatedContent
    taskData.taskDate = updatedDate
    localStorage.setItem(index, JSON.stringify([taskData]))
}

console.log(localStorage)