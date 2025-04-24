var taskListArray = [];
var isLocalDataPresent  = localStorage.getItem("todoTaskList");
if(isLocalDataPresent !== null) {
    taskListArray = JSON.parse(isLocalDataPresent);
    renderTaskList()
}

var currentFilter = "all";

document.addEventListener("DOMContentLoaded", function() {
    
    document.getElementById("all").addEventListener("click", function() { setFilter("all"); });
    document.getElementById("todo").addEventListener("click", function() { setFilter("todo"); });
    document.getElementById("inprogress").addEventListener("click", function() { setFilter("inprogress"); });
    document.getElementById("closed").addEventListener("click", function() { setFilter("closed"); });
});

function setFilter(filter) {
    currentFilter = filter;
    updateFilterUI();
    renderTaskList();
}

function updateFilterUI() {
    var filters = ["all", "todo", "inprogress", "closed"];
    filters.forEach(function(f) {
        var el = document.getElementById(f);
        if(el) {
            if(f === currentFilter) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        }
    });
}

function saveTask() {
    var taskName = document.getElementById("txtItem").value.trim();
    if(taskName === "") return;
    var todoObject = {
        taskId: taskListArray.length > 0 ? taskListArray[taskListArray.length - 1].taskId + 1 : 1,
        taskName:  taskName,
        status: "todo"
    };
    taskListArray.push(todoObject); 
    localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
    document.getElementById("txtItem").value = "";
    renderTaskList();
}

function renderTaskList() {
    var taskListContainer = document.getElementById("myTaskList");
    taskListContainer.innerHTML = "";
    for(var index= 0; index < taskListArray.length; index++) {
        var task = taskListArray[index];
        if(currentFilter !== "all" && task.status !== currentFilter) {
            continue;
        }
        var dynamicLi = document.createElement("li");
        dynamicLi.classList.add("task");
        dynamicLi.classList.add(task.status); // Add status class for styling

        var myLabel = document.createElement("label");
        var myPara = document.createElement("p");
        myPara.textContent = task.taskName;
        myLabel.appendChild(myPara);
        dynamicLi.appendChild(myLabel);

        
        var statusSelect = document.createElement("select");
        statusSelect.classList.add("status-select");
        var statuses = [
            {value: "todo", text: "To-Do"},
            {value: "inprogress", text: "In-Progress"},
            {value: "closed", text: "Closed"}
        ];
        statuses.forEach(function(s) {
            var option = document.createElement("option");
            option.value = s.value;
            option.text = s.text;
            if(s.value === task.status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });
        statusSelect.addEventListener("change", function(event) {
            updateTaskStatus(task.taskId, event.target.value);
        });
        dynamicLi.appendChild(statusSelect);

        var myDiv = document.createElement("div");
        myDiv.classList.add("settings");
        var editIcon = document.createElement("i");
        editIcon.classList.add("fa");
        editIcon.classList.add("fa-pencil-square");

        editIcon.addEventListener("click", editTask);
        editIcon.taskId = task.taskId;
        var deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa");
        deleteIcon.classList.add("fa-trash"); 
        deleteIcon.addEventListener("click", deleteTask);
        deleteIcon.taskId = task.taskId;
        myDiv.appendChild(editIcon);
        myDiv.appendChild(deleteIcon);
        dynamicLi.appendChild(myDiv);

        taskListContainer.appendChild(dynamicLi);
    }
}
function deleteTask(event) {
    var index =  taskListArray.findIndex(m=>m.taskId == event.target.taskId);
    taskListArray.splice(index,1);
    localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
    renderTaskList() 
}
function editTask(event) {
    var obj =  taskListArray.find(m=>m.taskId == event.target.taskId);
    document.getElementById("txtItem").value = obj.taskName;
}

function updateTaskStatus(taskId, newStatus) {
    var task = taskListArray.find(m => m.taskId === taskId);
    if(task) {
        task.status = newStatus;
        localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
        renderTaskList();
    }
}

function removeAll() {
    taskListArray.splice(0);
    localStorage.removeItem("todoTaskList");
    renderTaskList() 
}
