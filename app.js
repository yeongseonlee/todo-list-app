const STORAGE_KEY = 'todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dueInput = document.getElementById('todo-due');
const priorityInput = document.getElementById('todo-priority');
const list = document.getElementById('todo-list');

const PRIORITY_LABELS = { high: '높음', medium: '중간', low: '낮음' };

function loadTodos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  const todos = loadTodos();
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');
    li.classList.add(`priority-${todo.priority}`);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(index));

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    const meta = document.createElement('span');
    meta.className = 'todo-meta';
    const dueText = todo.dueDate ? `마감 ${todo.dueDate}` : '';
    const priorityText = PRIORITY_LABELS[todo.priority] || '';
    meta.textContent = [dueText, priorityText].filter(Boolean).join(' · ');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTodo(index));

    li.append(checkbox, span, meta, deleteBtn);
    list.appendChild(li);
  });
}

function addTodo(text, dueDate, priority) {
  const todos = loadTodos();
  todos.push({ text, dueDate, priority, completed: false });
  saveTodos(todos);
  render();
}

function toggleTodo(index) {
  const todos = loadTodos();
  todos[index].completed = !todos[index].completed;
  saveTodos(todos);
  render();
}

function deleteTodo(index) {
  const todos = loadTodos();
  todos.splice(index, 1);
  saveTodos(todos);
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text, dueInput.value, priorityInput.value);
  input.value = '';
  dueInput.value = '';
  priorityInput.value = 'medium';
});

render();
