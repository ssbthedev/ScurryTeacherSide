import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js';
import {getDatabase, ref, set, push, onValue , get, child, remove, update} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAiIKZHUOVT3Mx8fYqyy-esU6kCPfmaYQA",
    authDomain: "scurry-4e55a.firebaseapp.com",
    projectId: "scurry-4e55a",
    storageBucket: "scurry-4e55a.appspot.com",
    messagingSenderId: "881979709277",
    appId: "1:881979709277:web:1da56957b42ed4e9683ab4",
    measurementId: "G-S84JRGMZ2J"
};

const firebaseConfigStudent = {
    apiKey: "AIzaSyBiZx6wsuPbCPyYMQbZF3v9IjrVMHgOZ-I",
    authDomain: "scurry-student-4f9ef.firebaseapp.com",
    projectId: "scurry-student-4f9ef",
    storageBucket: "scurry-student-4f9ef.appspot.com",
    messagingSenderId: "670194936593",
    appId: "1:670194936593:web:b094bdedf8768e2014fab0",
    measurementId: "G-1RY21PQYJN"
  };
   
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const appStudent = initializeApp(firebaseConfigStudent, 'Student');

document.getElementById("newtask").addEventListener("click", newAssignment);
document.getElementById("submitNewTask").addEventListener('click', saveAndMakeTask);
document.getElementById("cancelNewTask").addEventListener('click', cancelSubmit);
document.getElementById("saveGrades").addEventListener("click", saveStudentGrades);
document.getElementById("cancelGrades").addEventListener("click", cancelStudentGrades); 

var flag = true;
var text = [];
var element = [];
var classColor = "";
var classCode = "";
var main = document.createElement("DIV");
main.setAttribute("class","tasks");
document.body.appendChild(main);

//onclick to get back to home page
document.getElementById("scurryLogo").addEventListener("click", function(event){
    location.href = "/./index.html"; 
});

//current user that is signed in
var userUID = localStorage.getItem("currentUser");

//fill page on refresh (reconstruct cards)
window.onload = function(){
    fill();
}   

//reconstruct all cards 
function fill(){
    //reconstruct welcome message
    document.getElementById("welcomeClassMessage").innerHTML = localStorage.getItem('classNameTeacher');

    //reconstruct color
    classColor = localStorage.getItem('currentColor');
    document.getElementById("header-area").style.background = classColor;

    document.getElementById("newAssignmentForm").style.border = "10px solid #ff3131";
    document.getElementById("gradeStudentWorkForm").style.border = "10px solid #ff3131";
    document.getElementById("submitNewTask").style.backgroundColor = classColor;
    document.getElementById("cancelNewTask").style.backgroundColor = classColor;
    document.getElementById("saveGrades").style.backgroundColor = classColor;
    document.getElementById("cancelGrades").style.backgroundColor = classColor;
    
    if(classColor == "rgb(255, 49, 49)"){
        document.getElementById("newAssignmentForm").style.border = "10px solid #ff3131";
        document.getElementById("gradeStudentWorkForm").style.border = "10px solid #ff3131";
    }else if(classColor == "rgb(255, 145, 77)"){
        document.getElementById("newAssignmentForm").style.border = "10px solid #ff914d";
        document.getElementById("gradeStudentWorkForm").style.border = "10px solid #ff914d";
    }else if(classColor == "rgb(245, 211, 90)"){
        document.getElementById("newAssignmentForm").style.border = "10px solid #f5d35a";
        document.getElementById("gradeStudentWorkForm").style.border = "10px solid #f5d35a";
    }else if(classColor == "rgb(154, 212, 134)"){
        document.getElementById("newAssignmentForm").style.border = "10px solid #9ad486"
        document.getElementById("gradeStudentWorkForm").style.border = "10px solid #9ad486";
    }else{
        document.getElementById("newAssignmentForm").style.border = "10px solid #a4ddff";
        document.getElementById("gradeStudentWorkForm").style.border = "10px solid #a4ddff";
    }

    classCode = localStorage.getItem('classCode')

    //construct class code in bottom left
    //NEEDS CSS!!!
    var codeBlock = document.createElement("P");
    codeBlock.innerHTML = "class code: "+ classCode;
    codeBlock.style.zIndex = "4";
    codeBlock.style.position = "absolute";
    codeBlock.style.bottom = "10px";
    codeBlock.style.left = "10px";
    codeBlock.style.color = "white";
    codeBlock.style.fontSize = "18px";
    codeBlock.style.height = "30px";
    codeBlock.style.width = "145px";
    codeBlock.style.borderRadius = "10px";
    codeBlock.style.paddingLeft = "10px";

    codeBlock.style.backgroundColor = classColor;
    
    main.appendChild(codeBlock);
    
    const db = getDatabase();

    //read in all current assignments to dedisplay
    const pathRef = ref(db, '/'+userUID+'/Details/'+localStorage.getItem("classNameNoTeacher")+'/Assignments/');
    onValue(pathRef, (snapshot) => {    
        snapshot.forEach((childSnapshot) => {
            // console.log(childSnapshot.key);
            var headerText = childSnapshot.key;
            var date = childSnapshot.val().dueDate;
            var category = childSnapshot.val().category;
            var description = childSnapshot.val().description;
            var early = childSnapshot.val().earlyAcorns;
            var ontime = childSnapshot.val().onTimeAcorns;
            
            createTaskCard(headerText, date, category, description, early, ontime);
        });
    }, {
        onlyOnce: true
    });
}

//opens the form
function newAssignment(){
    document.getElementById("newAssignmentForm").style.display = "block";
}

//when a new task is submitted...
function saveAndMakeTask(){
    // gets the users inputted task into an array
    element[0] = document.getElementById("enterTaskName");
    element[1] = document.getElementById("enterTaskCategory"); //2
    element[2] = document.getElementById("enterTaskDesc"); //3
    element[3] = document.getElementById("enterBurrowDue"); //1
    element[4] = document.getElementById("enterBurrowEarly"); //4
    element[5] = document.getElementById("enterBurrowOnTime"); //5

    // inputs all the inputted tasks into firebase
    updateUserData(element[0].value, element[1].value, element[2].value, element[3].value, element[4].value, element[5].value);

    text[0] = element[0].value;
    text[1] = element[3].value;
    text[2] = element[1].value;
    text[3] = element[2].value;
    text[4] = element[4].value;
    text[5] = element[5].value;


    for(let i = 0; i < 6; i++){
        if(text[i] == "" || text[i] == " "){
            flag = false;
            element[i].placeholder = "Please enter a valid input";
        }
        if(i == 5 && flag && !(text[i] == "" || text[i] == " ")){ //get rid of ".", "#", "$", "[", or "]"
            element[0].value = "";
            element[1].value = "";
            element[2].value = "";
            element[3].value = "";
            element[4].value = "";
            element[5].value = "";
            //creates card from values 
            createTaskCard(text[0], text[1], text[2], text[3], text[4], text[5]);
            cancelSubmit();
        }
    }
    flag = true;
    //TEMPORARY - refresh so that there are no duplicates
    // location.reload(); 
}

// Creates a Task Card on the burrow.html page, like each class. 
function createTaskCard(headerText, date, category, description, early, ontime){
    //adding extra things to blank element if applicable
    date = "Due: " + date;      
    early = "+" + early + " acorns if early";
    ontime = "+" + ontime + " acorns if on time";

    //container
    var newTask = document.createElement("DIV");
    newTask.setAttribute("class", "task");
    newTask.setAttribute("id", headerText);
    newTask.style.position = "relative";
    main.appendChild(newTask);

    //hover decsription feature
    document.getElementById(headerText).title = description;

    //header of task
    var header = document.createElement("P");
    header.setAttribute("class", "taskHead");
    header.innerText = headerText;
    header.style.paddingBottom = "5px";
    newTask.appendChild(header);

    header.addEventListener("click", gradeStudentWork, false);
    header.style.cursor = "pointer";
    header.globalTaskNameDupe = headerText;

    //bolded inner details
    var detailsBold = document.createElement("P");
    detailsBold.setAttribute("class", "taskDetails");
    detailsBold.innerText =  date + "\n" + category;
    detailsBold.style.fontWeight = 'bold';
    newTask.appendChild(detailsBold);
    
    var detailsReg = document.createElement("P");
    detailsReg.setAttribute("class", "taskDetails");
    detailsReg.innerHTML = early + "<br>" + ontime;
    newTask.appendChild(detailsReg);

    //style elements
    newTask.style.border = "10px solid";
    newTask.style.borderColor = classColor;
    header.style.backgroundColor = classColor;

    //trash icon
    var trashIconP = document.createElement("P");
    var trashIconI = document.createElement("I");
    trashIconI.setAttribute("class", "fa-solid fa-trash fa-2xl");

    //Putting them into the class card
    newTask.appendChild(trashIconP);
    trashIconP.appendChild(trashIconI);

    //Trash css
    trashIconP.style.position = "absolute";
    trashIconP.style.bottom = "0px";
    trashIconP.style.right = "10px";
    trashIconP.style.cursor = "pointer";

    //What happens when you click the trash lol
    trashIconI.addEventListener("click", function(event){
        deleteTask(headerText);
    });

    trashIconI.style.color = classColor;
}

function gradeStudentWork(evt){
    if(document.getElementById("gradeStudentWorkForm")){
        document.getElementById("gradeStudentWorkForm").style.display = "block";
        var taskName = evt.currentTarget.globalTaskNameDupe;

        if(document.getElementById("gradeHeader")){
            document.getElementById("gradeHeader").innerText = taskName;
            document.getElementById("gradeHeader").style.fontWeight = "bold";
        }else{
            console.log("buffer");
        }

        const dbRef = ref(getDatabase(appStudent));
        get(child(dbRef, "/")).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var uid = childSnapshot.key;
                get(child(dbRef, "/" + uid + "/")).then((snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        var studentName;
                        if(childSnapshot.key != "Codes"){
                            studentName = childSnapshot.key;
                            get(child(dbRef, "/" + uid + "/Codes/" + classCode + "/")).then((snapshot) => {
                                if(snapshot.exists()){
                                    console.log(studentName);
                                    var studentDiv = document.createElement("DIV");
                                    studentDiv.style.display = "flex";
                                    studentDiv.style.flexDirection = "row";

                                    get(child(dbRef, "/" + uid + "/Codes/" + classCode + "/Assignments/")).then((snapshot) => {
                                        if(snapshot.exists()){
                                            snapshot.forEach((childSnapshot) => {
                                                if(childSnapshot.key == taskName){
                                                    var studentStatus = childSnapshot.val().statusOfAssignment;
                                                    if(studentStatus == "NOT GRADED"){
                                                        var studentNameA = document.createElement("a");
                                                        studentNameA.innerText = studentName;
                                                        studentNameA.title = studentName;
                                                        studentNameA.style.marginTop = "20px";
                                                        studentNameA.href = "https://www.africau.edu/images/default/sample.pdf";
                                                        studentDiv.appendChild(studentNameA);
                                                        studentDiv.setAttribute('target', '_blank'); //open in new tab
                                                        document.getElementById("students").appendChild(studentDiv);

                                                        var gradingDiv = document.createElement("DIV");
                                                        var teacherGrade = document.createElement("input");
                                                        teacherGrade.setAttribute("class", "gradesClass");
                                                        teacherGrade.setAttribute("id", studentName+"status");
                                                        teacherGrade.setAttribute('type', 'number');
                                                        teacherGrade.setAttribute('min', '0');
                                                        teacherGrade.setAttribute('max', '100');
                                                        teacherGrade.style.width = "50px";
                                                        teacherGrade.style.height = "30px";
                                                        teacherGrade.style.marginTop = "10px";
                                                        var gradePlaceholder = document.createElement("P");
                                                        gradePlaceholder.innerText = "/100";
                                                        gradingDiv.appendChild(teacherGrade);
                                                        gradingDiv.appendChild(gradePlaceholder);
                                                        studentDiv.style.justifyContent = "space-between";

                                                        gradingDiv.style.display = "flex";
                                                        gradingDiv.style.flexDirection = "row";

                                                        studentDiv.appendChild(gradingDiv);
                                                    }else if(studentStatus == "NOT SUBMITTED"){
                                                        var studentNameP = document.createElement("P");
                                                        studentNameP.innerText = studentName; 
                                                        studentDiv.appendChild(studentNameP);
                                                        document.getElementById("students").appendChild(studentDiv);

                                                        var studentAssignmentStatusP = document.createElement("P");
                                                        studentAssignmentStatusP.innerText = studentStatus;
                                                        studentAssignmentStatusP.style.color = "red";
                                                        studentDiv.style.justifyContent = "space-between";
                                                        studentDiv.appendChild(studentAssignmentStatusP);
                                                    }else{
                                                        var studentNameA = document.createElement("a");
                                                        studentNameA.innerText = studentName;
                                                        studentNameA.title = studentName;
                                                        studentNameA.style.marginTop = "20px";
                                                        studentNameA.href = "https://www.africau.edu/images/default/sample.pdf";
                                                        studentDiv.appendChild(studentNameA);
                                                        studentDiv.setAttribute('target', '_blank'); //open in new tab
                                                        document.getElementById("students").appendChild(studentDiv);

                                                        var studentAssignmentStatusP = document.createElement("P");
                                                        studentAssignmentStatusP.innerText = studentStatus + "/100";
                                                        if(parseInt(studentStatus) >= 80){
                                                            studentAssignmentStatusP.style.color = "green";
                                                        }else if(parseInt(studentStatus) >= 60){
                                                            studentAssignmentStatusP.style.color = "orange";
                                                        }else{
                                                            studentAssignmentStatusP.style.color = "red";
                                                        }
                                                        studentDiv.style.justifyContent = "space-between";
                                                        studentDiv.appendChild(studentAssignmentStatusP);

                                                        studentDiv.appendChild(gradingDiv);
                                                    }                                                    
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    }else{
        console.log("buffer");
    }
}

//deleting a task from fb
function deleteTask(taskName){
    const db = getDatabase();
    const pathRef = ref(db, '/'+userUID+'/Details/'+localStorage.getItem("classNameNoTeacher")+'/Assignments/'+taskName);
    remove(pathRef);
    document.getElementById(taskName).remove(); //remove physical task from screen
}

//cancel form
function cancelSubmit(){
    document.getElementById("newAssignmentForm").style.display = "none";
}

function cancelStudentGrades(){
    document.getElementById("gradeStudentWorkForm").style.display = "none";
    document.getElementById("students").replaceChildren();
}

function saveStudentGrades(){
    var assignmentName = document.getElementById("gradeHeader").innerText;
    console.log(assignmentName);
    const dbRef = ref(getDatabase(appStudent));
    const db = getDatabase(appStudent);

    var studentElements = document.getElementsByClassName("gradesClass");
    for(var i = 0; i < studentElements.length; i++){
        var name = studentElements[i].id;
        name = name.substring(0, name.length-6);
        if(studentElements[i].value){
            console.log(name);
            console.log(studentElements[i].value);

            //keep as onvalue
            onValue(ref(db, "/"), (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    var uidDB = childSnapshot.key;
                    onValue(ref(db, "/" + uidDB + "/"), (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            if(childSnapshot.key == name){
                                onValue(ref(db, "/" + uidDB + "/Codes/" + classCode + "/Assignments/" + assignmentName + "/"), (snapshot) => {
                                    console.log(name + "\n" + assignmentName + "\n" + snapshot.val().statusOfAssignment);
                                    localStorage.setItem(name+"path", "/" + uidDB + "/Codes/" + classCode + "/Assignments/" + assignmentName + "/");
                                    // console.log(localStorage.getItem(name+"path"));
                                });
                            }
                        });
                    })
                });
            });
            console.log(name);
            console.log(localStorage.getItem(name + "path"));
            console.log(studentElements[i].value);

            update(ref(db, localStorage.getItem(name + "path")), {
                statusOfAssignment: studentElements[i].value
            });
        }
    }
}

//sending user data to fb
function updateUserData(taskName ,taskCategory, taskDescription, taskDueDate, acornsEarly, acornsOnTime) {
    // Important - remember the / is to nest it into the child
    const db = getDatabase();
    var className = localStorage.getItem("classNameNoTeacher")
  
    const reference = ref(db, '/'+userUID+'/Details/'+ className +'/Assignments/'+taskName);
 
    update(reference, {
    category: taskCategory,
    description: taskDescription,
    dueDate: taskDueDate,
    earlyAcorns: acornsEarly, 
    onTimeAcorns: acornsOnTime
    }).then(() => {
    // Data saved successfully!
    //   alert('data updated');
    })
    .catch((error) => {
        // The write failed...
        alert(error);
    });
}
