document.getElementById("newtask").addEventListener("click", newAssignment);
document.getElementById("submitNewTask").addEventListener('click', saveAndMakeTask);
document.getElementById("cancelNewTask").addEventListener('click', cancelSubmit);

var flag = true;
var text = [];
var element = [];
var main = document.createElement("DIV");
main.setAttribute("class","tasks");
document.body.appendChild(main);

window.onload = function(){
    changeColor();
}   

function newAssignment(){
    document.getElementById("newAssignmentForm").style.display = "block";
}


function saveAndMakeTask(){
    element[0] = document.getElementById("enterTaskName");
    element[1] = document.getElementById("enterTaskCateg");
    element[2] = document.getElementById("enterTaskDesc");
    element[3] = document.getElementById("enterBurrowDue");
    element[4] = document.getElementById("enterBurrowEarly");
    element[5] = document.getElementById("enterBurrowOnTime");

    text[0] = element[0].value;
    text[1] = element[1].value;
    text[2] = element[2].value;
    text[3] = element[3].value;
    text[4] = element[4].value;
    text[5] = element[5].value;


    for(let i = 0; i < 6; i++){
        if(text[i] == "" || text[i] == " "){
            flag = false;
            element[i].placeholder = "Please enter a valid input";
        }
        if(i == 5 && flag){ //get rid of ".", "#", "$", "[", or "]"
            element[0].value = "";
            element[1].value = "";
            element[2].value = "";
            element[3].value = "";
            element[4].value = "";
            element[5].value = "";
            createTaskCard(text);
            cancelSubmit();
        }
    }
    flag = true;
}

function createTaskCard(text){
    var newTask = document.createElement("DIV");
    newTask.setAttribute("class", "task");
    newTask.style.color = "white";
    main.appendChild(newTask);

    var header = document.createElement("P");
    header.setAttribute("class", "taskHead");
    header.innerText = text[0];
    header.style.color = "black";
    newTask.appendChild(header);

    var details = document.createElement("P");
    details.setAttribute("class", "taskDetails");
    details.innerText =  text[1] + `\n` + text[2] + `\n` + text[3] + `\n` + text[4] + `\n` + text[5];
    details.style.color = "black";
    newTask.appendChild(details);

}

function cancelSubmit(){
    document.getElementById("newAssignmentForm").style.display = "none";
}

function changeColor(color){

    var newClass = document.getElementById("header-area");
    if(color == "red"){
        newClass.style.backgroundColor = "#ff3131";
    }else if(color == "orange"){
        newClass.style.backgroundColor = "#ff914d";
    }else if(color == "yellow"){
        newClass.style.backgroundColor = "#f5d35a";
    }else if(color == "green"){
        newClass.style.backgroundColor = "#9ad486";
    }else{
        newClass.style.backgroundColor = "#a4ddff";
    }
}


