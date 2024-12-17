let tasks = [];
let updatingTaskId = null;
let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [
  {
    id: 1,
    image: '/images/motivation_monday.jpg',
    title: 'hello',
  },
];

const cardsGroup = document.getElementById('card-container');
const submitButton = document.getElementById('add_btn');
// const editButton = document.getElementById('edit_btn');

// add an click event on submit button
submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  // get the input values
  const titleInput = document.getElementById('title');
  const imageInput = document.getElementById('image');

  // add if both fields have values
  if (titleInput.value && imageInput.files[0].name) {
    // if we're updating
    if (updatingTaskId) {
      console.log('updating');

      const task = {
        id: updatingTaskId,
        title: titleInput.value,
        image: '/images/' + imageInput.files[0].name,
      };

      tasks = tasks.map((t) => {
        console.log(t.id, updatingTaskId);
        if (t.id === updatingTaskId) {
          console.log('changing...');
          return task;
        }
        return t;
      });

      // change the button text after editing
      submitButton.textContent = 'Add';
    } else {
      // prepare new task
      const newTask = {
        id: tasks.length + 1,
        title: titleInput.value,
        image: '/images/' + imageInput.files[0].name,
      };

      // add new task item into array
      tasks = [...tasks, newTask];
    }

    // store in localstorage
    storeTaksToLocalStorage(tasks);

    // clear inputs
    clearInputs();

    // view tasks
    showCards();
    updatingTaskId = null;
  } else {
    alert('Both fields are required');
  }
});

// remove task
function removeTask(removedTaskId) {
  tasks = tasks.filter((task) => task.id !== removedTaskId);

  storeTaksToLocalStorage(tasks);

  showCards();
}

// edit task
function editTask(updateTaskId) {
  let updateTask = tasks.find((task) => task.id === updateTaskId);

  // store the id of the task we're updating
  updatingTaskId = updateTask.id;
  submitButton.textContent = 'Edit';
  document.getElementById('title').value = updateTask.title;
}

// clear form after submission
function clearInputs() {
  document.getElementById('title').value = '';
  document.getElementById('image').value = null;
}

// show cards on UI
function showCards() {
  // clear cards
  cardsGroup.innerHTML = '';

  // append cards
  tasks.forEach((task) => {
    cardsGroup.innerHTML += `
      <div class="col col-sm-6 col-md-3" id=${task.id}>
        <div class="card w-full">
          <img
            src=${task.image}
            class="card-img-top"
            alt="Monday_Motivation"
          />
          <div class="card-body">
            <p class="card-text">${task.title}</p>
          </div>
         <div class="container d-flex justify-content-center p-4">
            <button class="btn btn-warning mx-2" onclick="editTask(${task.id})">
              Edit
            </button>
            <button class="btn btn-danger" onclick="removeTask(${task.id})">
              Delete
            </button>
          </div>
        </div>
      </div>
      `;
  });
}

function storeTaksToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

window.addEventListener('load', () => {
  // store the localstorage's data in the tasks array
  tasks = [...tasks, ...storedTasks];
  showCards();
});