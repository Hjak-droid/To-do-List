// Load tasks & dark mode on startup
function setBackgroundByTime() {
  const hour = new Date().getHours();
  let gradient = '';

  if (hour >= 6 && hour < 12) {
    gradient = 'linear-gradient(to right, #FFDEE9, #B5FFFC)'; // morning
  } else if (hour >= 12 && hour < 18) {
    gradient = 'linear-gradient(to right, #fbc2eb, #a6c1ee)'; // afternoon
  } else if (hour >= 18 && hour < 20) {
    gradient = 'linear-gradient(to right, #f6d365, #fda085)'; // evening
  } else {
    gradient = 'linear-gradient(to right, #141E30, #243B55)'; // night
  }

  document.body.style.background = gradient;
  document.body.style.backgroundSize = 'cover';
  document.body.style.transition = 'background 1s ease-in-out';
}

// Call it when page loads
window.onload = () => {
  setBackgroundByTime();
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => renderTask(task.text, task.completed));

  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark');
    document.getElementById('toggleDark').checked = true;
  }
};

window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => renderTask(task.text, task.completed));

  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark');
    document.getElementById('toggleDark').checked = true;
  }
};

document.getElementById('toggleDark').addEventListener('change', (e) => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  renderTask(taskText, false);
  taskInput.value = '';
  saveTasks();
}

function renderTask(text, completed) {
  const li = document.createElement('li');
  li.style.opacity = '0';
  setTimeout(() => li.style.opacity = '1', 10); // Fade-in

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add('task-text');
  if (completed) li.classList.add('completed');

  span.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
  });

  span.addEventListener('dblclick', () => {
    const input = document.createElement('input');
    input.value = span.textContent;
    input.className = 'edit-input';

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        li.remove();
      } else {
        span.textContent = input.value;
        li.replaceChild(span, input);
      }
      saveTasks();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') input.blur();
    });

    li.replaceChild(input, span);
    input.focus();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.style.opacity = '0';
    setTimeout(() => li.remove(), 200); // Fade-out
    saveTasks();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  document.getElementById('taskList').appendChild(li);
}

function clearTasks() {
  if (confirm('Clear all tasks?')) {
    document.getElementById('taskList').innerHTML = '';
    localStorage.removeItem('tasks');
  }
}

function saveTasks() {
  const items = [...document.querySelectorAll('#taskList li')];
  const tasks = items.map(li => ({
    text: li.querySelector('.task-text')?.textContent || '',
    completed: li.classList.contains('completed')
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
