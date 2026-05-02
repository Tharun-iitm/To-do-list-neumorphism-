let taskCounter =1;

const addbtn = document.getElementById('addTaskBtn');
const container = document.getElementById('taskContainer');


/* ── Theme toggle ── */
const themeToggle = document.getElementById('themeToggle');
const savedTheme  = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}
 
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

function saveTask(){
    const tasks=[];
    const allTaskItems = document.querySelectorAll ('.task-items');
    
    allTaskItems.forEach(item => {
        const text = item.querySelector('.task-text').innerText;
        const isCompleted = item.querySelector('.task-check').checked;

        tasks.push({
             text: text, completed: isCompleted 
            });
    });


    localStorage.setItem('tasks' , JSON.stringify(tasks));
}


function updateCounts(){
    const allTasksCounter = document.querySelectorAll('.task-items');
    let total = allTasksCounter.length;
    let pending = 0;
    let completed =0;

    allTasksCounter.forEach(task =>{
        const isDone = task.querySelector('.task-check').checked;

        if (isDone){
            completed++;
        }
        else{
            pending++;
        }
    });

    const clrBtn =document.getElementById('delAllCompleted');
     if(completed>0){
        clrBtn.style.display='flex';
     }
     else{clrBtn.style.display='none';

     }

    document.getElementById('all-count').innerText = total;
    document.getElementById('pending-count').innerText= pending;
    document.getElementById('completed-count').innerText= completed;
}



function createTask(text="" , completed= false) {
    //const uniqueId = `task-${taskCounter}`;
    const uniqueId = Date.now();
    const newTask = document.createElement('div');

    newTask.id = uniqueId;
    newTask.classList.add('task-items');

    newTask.innerHTML = `
    <div class="checkbox-wrapper">
        <label>
        <input type="checkbox" id="check-${taskCounter}" class="task-check" ${completed ? 'checked' : ''}>
        <div class="checkbox"></div>
        </label>
     </div>  
     
     <div class="task-container">
        <span class="task-text ${completed ? 'striked' : ''} " contentEditable="true" data-placeholder="new task here...">${text}</span>

        <div class="task-actions">
            <i id="redo-${taskCounter}"   class="fa-solid fa-rotate-left redo-icon"></i>
            <i id="delete-${taskCounter}"  class="fa-solid fa-trash bin-icon"></i>
        </div>
    </div>`;

    const binIcon =  newTask.querySelector('.bin-icon');
    const taskText = newTask.querySelector('.task-text');
    const checkbox = newTask.querySelector('.task-check');
    const redoBtn = newTask.querySelector('.redo-icon');

    binIcon.addEventListener('click' , () =>{
        const taskToDelete = binIcon.closest('.task-items');
        taskToDelete.remove();
        saveTask();
        updateCounts();
    });

    checkbox.addEventListener('change' , () => {
        if (checkbox.checked){
        taskText.classList.add('striked');
        }
        else{
        taskText.classList.remove('striked');
        }
        saveTask();
        updateCounts();

        document.querySelector('.active-filter').click();
    });

    redoBtn.addEventListener('click' , () =>{
        taskText.classList.remove('striked');
        checkbox.checked = false;
        saveTask();
        updateCounts();
    });

    taskText.addEventListener('input' , () =>{
        saveTask();
        updateCounts()
    });

    container.appendChild(newTask);
    newTask.querySelector('.task-text').focus();
    taskCounter++;

    console.log(uniqueId);

    saveTask();
    updateCounts()

}

addbtn.addEventListener('click' , ()=>{
    createTask("" , false);
    const lastTask = container.lastElementChild;
    lastTask.querySelector('.task-text').focus();
});




const delAllComp = document.getElementById('delAllCompleted');
delAllComp.addEventListener('click' ,() =>{

    const allTaskItemsss = document.querySelectorAll('.task-items');

    allTaskItemsss.forEach( item =>{
        const isDone = item.querySelector('.task-check').checked;

        if (isDone) {
            item.remove();
        }
    });
    

    saveTask();
    updateCounts();
});




const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach( btn =>{
    btn.addEventListener('click' , ()=>{

        const currentActive =document.querySelector('.active-filter');

        if(currentActive){
            currentActive.classList.remove('active-filter');
        }

        btn.classList.add('active-filter');

        const filterValue = btn.getAttribute('data-filter');
        const allTasks = document.querySelectorAll('.task-items');
        //
        console.log("Button clicked:", filterValue);
        //

        allTasks.forEach(task=>{
            const isDone = task.querySelector('.task-check').checked;

            switch (filterValue){

                case 'all':
                    task.style.display='flex';
                    break;
                case 'pending':
                    task.style.display = isDone ?'none' : 'flex';
                    break;
                case 'completed':
                    task.style.display = isDone ?'flex': 'none';
                    break;
            }
        });
    });
});

const filtersEl = document.querySelector('.filters');
const slider = document.createElement('div');
slider.classList.add('filter-slider');
filtersEl.prepend(slider);
 
function moveSlider(btn) {
    slider.style.width = btn.offsetWidth + 'px';
    slider.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
}
 
requestAnimationFrame(() => {
    const initial = document.querySelector('.filter-btn.active-filter');
    if (initial) moveSlider(initial);
});
 
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.active-filter')?.classList.remove('active-filter');
        btn.classList.add('active-filter');
        moveSlider(btn);
 
        const filterValue = btn.getAttribute('data-filter');
        document.querySelectorAll('.task-items').forEach(task => {
            const isDone = task.querySelector('.task-check').checked;
            switch (filterValue) {
                case 'all':       task.style.display = 'flex'; break;
                case 'pending':   task.style.display = isDone ? 'none' : 'flex'; break;
                case 'completed': task.style.display = isDone ? 'flex' : 'none'; break;
            }
        });
    });
});

function loadTasks(){
    const data = localStorage.getItem('tasks');
    if (data){
        const tasks =JSON.parse(data);
        tasks.forEach(task =>{
            createTask(task.text , task.completed);
        });
    }
}

loadTasks();
updateCounts();



