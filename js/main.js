// Объявляю константы по поиску в html верстке нужных мне полей
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
// объявляю массив данных для local storage
let tasks = [];
// проверка были ли ранее задачи а так же рендер их на странице
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

// объявляю обработчки событий ( отправку новой задачи, и клики  по кнопкам удалить и выполненной задачи)
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// функция по добавлению новой задачи
function addTask(event) {
	event.preventDefault();
	const taskText = taskInput.value;
	// конструктор новой задачи
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	tasks.push(newTask);
	saveToLocalStorage();
	renderTask(newTask);
	// новые правила после отправки события(так как мы отменили скрипт по умолчанию на 20 строчке
	taskInput.value = '';
	taskInput.focus();
}

function deleteTask(event) {if (event.target.dataset.action !== 'delete') return;

	const parenNode = event.target.closest('.list-group-item');
	const id = Number(parenNode.id);
	tasks = tasks.filter((task) => task.id !== id);
	saveToLocalStorage();
	parenNode.remove();
}

function doneTask(event) {
	if (event.target.dataset.action !== 'done') return;
	const parentNode = event.target.closest('.list-group-item');
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;
	saveToLocalStorage();
	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}
function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {

	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/done.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/trash.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
