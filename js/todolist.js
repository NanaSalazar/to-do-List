//Primeiro passo será adicionar novos itens de forma dinâmica usando o javascript
//É uma boa prática usar ; antes da função auto invocável

;(function(){
    'use strict'
    //Armazenar o DOM em variáveis
    const itemInput = document.getElementById('item-input')
    const todoAddForm = document.getElementById('todo-add')
    const ul = document.getElementById('todo-list')
    const lis = ul.getElementsByTagName('li')

    //A variável recupera os dados salvos no storage

    let arrTasks = getSavedData()

    function getSavedData() {
        let tasksData =  localStorage.getItem("tasks")
            tasksData = JSON.parse(tasksData)

        return tasksData.length ? tasksData : [
            {
                name: 'task 1',
                createAt: Date.now(),
                completed: false
            },
            {
                name: 'task 2',
                createAt: Date.now(),
                completed: true
            }
        
        ]

        
    }

    // A função envia para local storage os dados em string no formato JSON
    
    function setNewData() {
        localStorage.setItem('tasks', JSON.stringify(arrTasks))
    }

    setNewData()
    
    function generateLiTask(obj) {
        const li = document.createElement('li')
        const p = document.createElement('p')
        const checkButton = document.createElement('button')
        const editButton = document.createElement('i')
        const deleteButton = document.createElement('i')

        li.className = 'todo-item'
        checkButton.className = 'button-check'
        checkButton.innerHTML = `<i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`
        checkButton.setAttribute('data-action', 'checkButton')
        li.appendChild(checkButton)
        
        p.className = 'task-name'
        p.textContent = obj.name
        li.appendChild(p)

        editButton.className = 'fas fa-edit'
        editButton.setAttribute('data-action', 'editButton')
        li.appendChild(editButton)

        const containerEdit = document.createElement('div')
        containerEdit.className = 'editContainer'
        const inputEdit = document.createElement('input')
        inputEdit.setAttribute('type', 'text')
        inputEdit.className = 'editInput'
        inputEdit.value = obj.name

        containerEdit.appendChild(inputEdit)
        const containerEditButton = document.createElement('button')
        containerEditButton.className = 'editButton'
        containerEditButton.textContent = 'Edit'
        containerEditButton.setAttribute('data-action', 'containerEditButton')
        containerEdit.appendChild(containerEditButton)
        const containerCancelButton = document.createElement('button')
        containerCancelButton.className = 'cancelButton'
        containerCancelButton.textContent = 'Cancel'
        containerCancelButton.setAttribute('data-action', 'containerCancelButton')
        containerEdit.appendChild(containerCancelButton)

        li.appendChild(containerEdit)


        deleteButton.className = 'fas fa-trash-alt'
        deleteButton.setAttribute('data-action', 'deleteButton')
        li.appendChild(deleteButton)

       // addEventLi(li)

        return li

    }

    // A função limpa a ul e acrescenta as li novamente

    function renderTasks() {
        ul.innerHTML = ''
        arrTasks.forEach(task => {
            ul.appendChild(generateLiTask(task))
        });
    }

    //Adiciona o objeto li dentro da estrutura de dados

    function addTask(task) {
        arrTasks.push({
            name: task,
            createAt: Date.now(),
            completed: false
        })

        setNewData()

    }

    function clickedUl(e) {
        const dataAction = e.target.getAttribute('data-action')
        if(!dataAction) return

        let currentLi = e.target
        while(currentLi.nodeName !== 'LI'){
            currentLi = currentLi.parentElement
        }

        const currentLiIndex = [...lis].indexOf(currentLi)
    
        const actions = {
            editButton: function() {
                const editContainer = currentLi.querySelector('.editContainer');

                [...ul.querySelectorAll('.editContainer')].forEach(container => {
                    container.removeAttribute('style')
                })

                editContainer.style.display = 'flex';

                
            },
            deleteButton: function() {
                arrTasks.splice(currentLiIndex, 1)
                console.log(arrTasks)
                renderTasks()
                setNewData()
            },
            
            containerEditButton: function() {
                const val = currentLi.querySelector('.editInput').value
                arrTasks[currentLiIndex].name = val
                renderTasks()
                setNewData()
            },
            containerCancelButton: function () {
                currentLi.querySelector('.editContainer').removeAttribute('style')

                currentLi.querySelector('.editInput').value = arrTasks[currentLiIndex].name
            },
            checkButton: function() {
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed
            
                setNewData()
                renderTasks()
            }
        }
        
        if (actions[dataAction]) {
            actions[dataAction]()
        }
    }

    //Em caso de formulários, é recomendável adicionar o evento ao formulário, com tipo de evento 'submit'. No segundo parâmetro é recomendável adicionar o objeto 'e' como parâmetro na função anônima, para que não haja a ocorrência do evento padrão de envio. Usa-se o método preventDefault() do objeto e

    todoAddForm.addEventListener('submit', function(e) {
        e.preventDefault()
        console.log(itemInput.value)

        addTask(itemInput.value)
        renderTasks()
        itemInput.value = ''
        itemInput.focus()
    } );

    ul.addEventListener('click', clickedUl)
    renderTasks()
    
})()