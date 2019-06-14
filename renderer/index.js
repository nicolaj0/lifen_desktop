'use strict'

const { ipcRenderer } = require('electron')

var holder = document.getElementById('drag-file');

/* older.ondragover = () => {
  return false;
};

holder.ondragleave = () => {
  return false;
};

holder.ondragend = () => {
  return false;
};

holder.ondrop = (e) => {
  e.preventDefault();

  for (let f of e.dataTransfer.files) {
    console.log('File(s) you dragged here: ', f.path)
    ipcRenderer.send('on-file-dropped', f.path)


  }

  return false;
};

 */


  ipcRenderer.on('ping', (event, message) => {
    var init = $('#text-input').val()
    var newVal =  `${init} '\r\n'  File ${message} has been added `
    $('#text-input').text(newVal)
    $('#text-input').focus()
  })



















/*

// delete todo by its text value ( used below in event listener)
const deleteTodo = (e) => {
  ipcRenderer.send('delete-todo', e.target.textContent)
}

// create add todo window button
document.getElementById('createTodoBtn').addEventListener('click', () => {
  ipcRenderer.send('add-todo-window')
})

// on receive todos
ipcRenderer.on('todos', (event, todos) => {
  // get the todoList ul
  const todoList = document.getElementById('todoList')

  // create html string
  const todoItems = todos.reduce((html, todo) => {
    html += `<li class="todo-item">${todo}</li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.todo-item').forEach(item => {
    item.addEventListener('click', deleteTodo)
  })
})*/
