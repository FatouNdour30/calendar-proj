document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const modalDate = document.getElementById("modal-date");
    const taskForm = document.getElementById("task-form");
    const taskTitle = document.getElementById("task-title");
    const taskDescription = document.getElementById("task-description");
    const taskList = document.getElementById("task-list");

    // Afficher le modal avec la date
    function showModal(date) {
        modalDate.textContent = formatDate(date);
        modal.style.display = "flex";
    }

    // Formater la date en format "jour mois année"
    function formatDate(date) {
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }

    // Ajouter une tâche
    function addTask(date) {
        const title = taskTitle.value;
        const description = taskDescription.value;

        const task = { titre: title, description: description, date: formatDate(date), id: Date.now() };

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        displayTasks(date);

        taskTitle.value = "";
        taskDescription.value = "";
    }

    // Afficher les tâches
    function displayTasks(date) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const filteredTasks = tasks.filter(task => task.date === formatDate(date));
        taskList.innerHTML = "";

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${task.titre}</span>
                <p>${task.description}</p>
                <button class="edit-btn" data-id="${task.id}">Modifier</button>
                <button class="delete-btn" data-id="${task.id}">Supprimer</button>`;
            taskList.appendChild(li);
        });
    }

    // Ouvrir le modal lorsqu'une date est cliquée
    const dates = document.querySelectorAll(".date"); 
    dates.forEach(date => {
        date.addEventListener("click", function () {
            showModal(new Date(date.dataset.date));
            displayTasks(date.dataset.date);
        });
    });

    // Ajouter une tâche
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const selectedDate = modalDate.textContent;
        addTask(new Date(selectedDate));
    });

    // Fermer le modal
    const closeModal = document.getElementById("close");
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Supprimer une tâche
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            const taskId = e.target.dataset.id;
            deleteTask(taskId);
        }
    });

    // Supprimer une tâche
    function deleteTask(id) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        const selectedDate = modalDate.textContent;
        displayTasks(selectedDate);
    }

    // Charger les tâches au chargement de la page
    window.addEventListener("load", function () {
        const datesWithTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        datesWithTasks.forEach(task => {
            const taskDate = new Date(task.date);
            const dateElement = document.querySelector(`[data-date="${task.date}"]`);
            if (dateElement) {
                dateElement.classList.add("has-task");
            }
        });
    });
});
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const monthYear = document.getElementById('monthYear');
const datesContainer = document.getElementById('dates');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function updateCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthYear.textContent = new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long' }).format(currentDate);

  datesContainer.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const emptyDate = document.createElement('div');
    emptyDate.classList.add('date');
    datesContainer.appendChild(emptyDate);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = document.createElement('div');
    date.classList.add('date');
    date.textContent = i;
    datesContainer.appendChild(date);
  }
}

updateCalendar();
prevButton.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  currentDate = new Date(currentYear, currentMonth);
  updateCalendar();
});

nextButton.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  currentDate = new Date(currentYear, currentMonth);
  updateCalendar();
});
