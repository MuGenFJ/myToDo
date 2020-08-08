const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')

const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')

const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')

const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

// -------------------End Selectors---------------------------------------

// ##### LOCALSTORAGE ##### 
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] ; // Go show if there is a key at the localStorage, if there exist one parse it into an object or if it doesn't exist give us an empty array
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// ##### EVENT LISTENER #####
clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId) //remain the list.id is not equal to our selectedlistId, give me just those they still not selected
    selectedListId = null
    saveAndRender()
})

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId // quand on clickera dessus il va prendre la id de cette list
        saveAndRender()
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') { // si on clique sur le input cad si on check notre checkbox
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id) //e.target.id est la checkbox.id que on a indiquer ci-dessous
        selectedTask.complete = e.target.checked //si le input cad dire la checkbox est checked il sera mis en true
        save()
        renderTaskCount(selectedList)
    }
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName) //va permettre de creer les specifications de la nouvelle list
    newListInput.value = null 
    lists.push(list)
    saveAndRender()// render() qui va creer li avec la classe, va chercher le name qui se trove dans le array lists et va la rajouter a ul
    // save() qui va le sauvgarder dans la localStorage
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName) 
    newTaskInput.value = null 
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task) //dans le array tasks de la list selected push task que on a mis dans notre user input value
    saveAndRender()
   
})

// ##### FUNCTIONS #####
function createList(name){
    return {id: Date.now().toString(), name: name, tasks: []
    }
}

function createTask(name){
    return {id: Date.now().toString(), name: name, complete: false
    }
}

function saveAndRender(){
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))//va enregistrer la lists dans le localStorage va la key LOCAL-KEY + la value de cette key qui est notre object lists
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)// il va enregistrer notre selectId dans une key et la value sera le id de celle qu'on clicker
}

function render(){
    clearElement(listsContainer)
    renderLists()

    const selectedList = lists.find(list => list.id === selectedListId) //va chercher la list dans le array qui a la meme id de celui qu'on a selectionner 
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true) // il va import le contenu du template creer 
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList){
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount <= 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId){ //si le id de la list correspond a celui que on a cliquer alors on ajoute la classe active
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element){
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()