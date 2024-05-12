// CURRENT ISSUE:
// duplicate name can override for the first entered value
// get rid of punctuation in prefix 

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js';
import {getDatabase, ref, set, push, onValue , get, child, remove, update} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiIKZHUOVT3Mx8fYqyy-esU6kCPfmaYQA",
  authDomain: "scurry-4e55a.firebaseapp.com",
  projectId: "scurry-4e55a",
  storageBucket: "scurry-4e55a.appspot.com",
  messagingSenderId: "881979709277",
  appId: "1:881979709277:web:1da56957b42ed4e9683ab4",
  measurementId: "G-S84JRGMZ2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if(user){
        fill();
    }else{
        console.log("not signed in");
    }
});

/**
 * When the sign Up button is clicked: 
  * Checks if the signUpMore has already been opeened otherwise opens it
  * Gets email, password, name and prefix
  * Uses firebase authentication method createUserWithEmailAndPassword to signup using email and password
  * After signed in get rids of signup modal and writes Name and Prefix into the RealtimeDatabase
  * Realtime Database
  * UID
  *  Name
  *    Prefix
 */
document.getElementById("signUp-submit").addEventListener("click", signUp);
function signUp() {
  if(window.getComputedStyle(document.getElementById("signUpMore")).display == "none"){
    document.getElementById("signUpMore").style.display = "block";
  }else{
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var name = document.getElementById("signUp-Name").value;
    var prefix = document.getElementById("signUp-Prefix").value;
    var uid;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      // Signed in 
        uid = auth.currentUser.uid;
        document.getElementById("signUpMore").style.display = "none";
        document.getElementById("logInForm").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("welcomeMessage").style.visibility = "visible";
        document.getElementById("navPlusButton").style.visibility = "visible";
        document.getElementById("navSignOutButton").style.visibility = "visible";
        // console.log(uid);
        writeUserData(uid, name, prefix);
      })
      .catch((error) =>{
        console.log(error);
        document.getElementById("errorMessageLogin").style.display = "block";
        document.getElementById("errorMessageLogin").innerHTML = "Please enter a valid email that DOES NOT already have an account created and/or a password with at least 6 characters";
        // alert("not working");
      });
  }
}

/**
 * When the log In button is clicked: 
  * Gets email, password for log in
  * Uses firebase authentication method signInWithEmailAndPassword to signup using email and password
  * After Log in get rids of logIn modal and writes Name and through an alert telling the user that they have been able to login into the classroom
  * else gives error message
 */
document.getElementById("logIn-submit").addEventListener("click", logIn);

function logIn() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("logInForm").style.display = "none";
      localStorage.setItem("currentUser", auth.currentUser.uid);
      document.getElementById("overlay").style.display = "none";
      displayWelcome();
      document.getElementById("welcomeMessage").style.visibility = "visible";
      document.getElementById("navPlusButton").style.visibility = "visible";
      document.getElementById("navSignOutButton").style.visibility = "visible";

    })
    .catch((error) => {
      document.getElementById("errorMessageLogin").style.display = "block";
      document.getElementById("errorMessageLogin").innerHTML = "Please enter a valid email that DOES NOT already have an account created and/or a password with at least 6 characters";
       // alert("Not Logged In");  
      const message = error.code;
      const errorMessage = error.message;
    });

}

document.getElementById("navSignOutButton").addEventListener("click", logOut);

function logOut(){
    console.log("signing out");
    auth.signOut().then(() => {
        clearScreen();
        localStorage.setItem("currentUser","");
        location.reload(true);
        displayWelcome();
        document.getElementById("welcomeMessage").style.visibility = "hidden";
        document.getElementById("navPlusButton").style.visibility = "hidden";
        document.getElementById("navSignOutButton").style.visibility = "hidden";        
        console.log('Signed out');

    }).catch(e => {
        console.error('Sign out Error', e);
    });
}

function clearScreen(){
    //burrow cards
    document.getElementById("welcomeMessage").innerText = "";
    document.querySelectorAll('.burrowCards').forEach(e => e.remove());
}

function writeUserData(uid1, name, prefix) {
    console.log("Inside");
  // Important - remember the / is to nest it into the child
  const db = getDatabase();
  const reference = ref(db, uid1 + '/' + name)
  console.log("Inside2");

    set(reference, {
      Prefix: prefix
    })
    .then(() => {
    //   alert("Signed Up " + name + "\n Uid:" + uid1);
      displayWelcome();
      console.log("Inside3");
    })
    .catch((error) => {
      // The write failed...
      console.log("Inside56");
    //   alert("error");
    });

} 

// '.', '$', '#', '[]' error in string 

function updateUserData(className ,colorName, squirrelType, burrowCode) {
  // Important - remember the / is to nest it into the child
  const db = getDatabase();
  //  const reference = ref(db, auth.currentUser.uid + '/' + userName + '/Details/' + className)
  const reference = ref(db, auth.currentUser.uid + '/Details/' + className)

    update(reference, {
      color: colorName,
      squirrel: squirrelType,
      code: burrowCode 
    }).then(() => {
      // Data saved successfully!
    //   alert('data updated');
    })
      .catch((error) => {
          // The write failed...
          alert(error);
    });
}

/////////////////////////////////////////////////////////////////////////

var login = false;

window.onload = function(){
    if(localStorage.getItem("currentUser")==null || localStorage.getItem("currentUser")==""){
        document.getElementById("overlay").style.display = "block";
        document.getElementById("welcomeMessage").style.visibility = "hidden";
        document.getElementById("navPlusButton").style.visibility = "hidden";
        document.getElementById("navSignOutButton").style.visibility = "hidden";
        logInFormPopup();
      }
      else{
        document.getElementById("overlay").style.display = "none";
        document.getElementById("navPlusButton").style.visibility = "visible";
        document.getElementById("navSignOutButton").style.visibility = "visible";
      }
}   

document.getElementById("navPlusButton").addEventListener("click", newClass);
document.getElementById("red").addEventListener("click", function(event){
    chooseBurrowColor("red");
});
document.getElementById("orange").addEventListener("click", 
function(event){
    chooseBurrowColor("orange");
});

document.getElementById("yellow").addEventListener('click', 
function(event){
    chooseBurrowColor("yellow");
});
document.getElementById("green").addEventListener('click', 
function(event){
    chooseBurrowColor("green");
});
document.getElementById("blue").addEventListener('click', 
function(event){
    chooseBurrowColor("blue");
});
document.getElementById("squirrel1").addEventListener('click', 
function(event){
    chooseSquirrelImg("squirrel1");
});
document.getElementById("squirrel2").addEventListener('click', 
function(event){
    chooseSquirrelImg("squirrel2");
});

document.getElementById("squirrel3").addEventListener('click', 
function(event){
    chooseSquirrelImg("squirrel3");
});

document.getElementById("squirrel4").addEventListener('click', 
function(event){
    chooseSquirrelImg("squirrel4");
});

document.getElementById("submitNewClass").addEventListener('click', saveAndMakeClass);
document.getElementById("cancelNewClass").addEventListener('click', cancelSubmitNewClass);

var main = document.createElement("DIV");
main.setAttribute("class","class");
document.body.appendChild(main);

var text;
var classCode;
var currentColor = "red";
var currentSquirrel = "squirrel1";


function newClass(){
    document.getElementById("newClassForm").style.display = "block";
    document.getElementById('enterBurrowName').placeholder = "";
}

function cancelSubmitNewClass(){
    document.getElementById("newClassForm").style.display = "none";
    document.getElementById('enterBurrowName').placeholder = "";
    document.getElementById("enterBurrowName").value = "";
}

function resetColorAndImg(){
    chooseBurrowColor("red");
    chooseSquirrelImg("squirrel1");
}

function chooseBurrowColor(chosenColor){
    if(chosenColor != currentColor){
        document.getElementById(currentColor).style.textShadow = "0 0 0px white";
        currentColor = chosenColor;
        document.getElementById(chosenColor).style.textShadow = "0 0 10px black";
    }
}

function chooseSquirrelImg(choosenSquirrel){
    if(choosenSquirrel != currentSquirrel){
        document.getElementById(currentSquirrel).style.border = "0px";
        currentSquirrel = choosenSquirrel;
        document.getElementById(choosenSquirrel).style.border = "5px groove black";
    }
}

var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
var text;
function saveAndMakeClass(){ //submit button
    text = document.getElementById('enterBurrowName').value;
    // console.log("RESULT OF DOESCLASSEXIST(TEXT): " + doesClassExist());
    if(text == "" || text == " "){
        document.getElementById('enterBurrowName').placeholder = "Please enter a valid name";
        resetColorAndImg();
    }else if(format.test(text)){ //special characters   check
        document.getElementById('enterBurrowName').value = "";
        document.getElementById('enterBurrowName').placeholder = "Do not use special characters";
        resetColorAndImg();
    }else if(doesClassExist()){
        document.getElementById('enterBurrowName').value = "";
        document.getElementById('enterBurrowName').placeholder = "Please enter a unique name";
        resetColorAndImg();
    }
    else{ //get rid of ".", "#", "$", "[", or "]"
        document.getElementById('enterBurrowName').value = "";
        classCode = createClassCode();
        updateUserData(text, currentColor, currentSquirrel, classCode); // 1st Time use
        createClassCard(text, currentColor, currentSquirrel, classCode, 0);
        cancelSubmitNewClass();
        resetColorAndImg();
    }
}

function displayWelcome(){
    const dbRef = ref(getDatabase());

    get(child(dbRef, '/'+ auth.currentUser.uid + '/')).then((snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((childSnapshot) => {
                if(childSnapshot.key != "Details"){
                    var userFullName = childSnapshot.key;
                    var userFirstName;
                    if(userFullName.indexOf(' ')==-1){
                        userFirstName = userFullName;
                    }
                    else{
                        userFirstName = userFullName.substring(0, userFullName.indexOf(' '));
                    } 
                    document.getElementById("welcomeMessage").innerText = "Welcome " + userFirstName + "!";
                }
            });
        }else{
            console.log("no data");
        }
    }).catch((error) => {
        console.log(error);
    });
}

function fill(){
    console.log("FILL IS BEING CALLED");
    const db = getDatabase();

    displayWelcome();

    const pathRef = ref(db, '/'+auth.currentUser.uid+'/Details/');
    onValue(pathRef, (snapshot) => {    
        login = true;
        snapshot.forEach((childSnapshot) => {
            var classNameFB = childSnapshot.key;
            var classCodeFB = childSnapshot.val().code;
            var classColorFB = childSnapshot.val().color;
            var classSquirrelFB = childSnapshot.val().squirrel;
            console.log("CREATING CLASS");

            const assignmentPath = ref(db, '/'+auth.currentUser.uid+'/Details/'+classNameFB+'/Assignments/');
            findLatest(classNameFB, assignmentPath);
            var latestAssignment = localStorage.getItem(classNameFB);
            console.log("CHECK:" + latestAssignment); //it's reading undefined from local storage when assignment is first created and the user navigates back to home page

            createClassCard(classNameFB, classColorFB, classSquirrelFB, classCodeFB, latestAssignment);
        });
    }, {
        onlyOnce: true
    });
}

//overlays if the dates are the same
function findLatest(classNameLatest, assignmentPath){
    const date = new Date();

    var day = date.getDate();
    if(day.toString().length == 1){
        day = "0" + day;
    }
    var month = date.getMonth() + 1;
    if(month.toString().length == 1){
        month = "0" + month;
    }
    var year = date.getFullYear();

    var currentDate = `${year}-${month}-${day}`;
    var currentDateCompare = currentDate.replaceAll('-','');

    var dateArray = [];
    onValue(assignmentPath, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            var date = childSnapshot.val().dueDate;
           if(date != ""){
            var dueDateCompare = date.replaceAll('-','');
            if(dueDateCompare.substring(0,4) > currentDateCompare.substring(0,4)){ //if in a later year 
              dateArray.push(date);
            }else if(dueDateCompare.substring(0,4) == currentDateCompare.substring(0,4)){
              if(dueDateCompare.substring(4,6) > currentDateCompare.substring(4,6)){ //if same year and due date is in a later month
                dateArray.push(date);
              }else if(dueDateCompare.substring(4,6) == currentDateCompare.substring(4,6)){ //if in the same year and month, move on to comparing the day
                  if(dueDateCompare.substring(6) > currentDateCompare.substring(6)){ //later in the same month (early)
                    dateArray.push(date);
                  }else if(dueDateCompare.substring(6) == currentDateCompare.substring(6)){ //ontime
                    dateArray.push(date);
                  }else{ //already passed in the month
                    console.log("past date");
                  }
              }else{ //if in the same year, but an earlier month
                console.log("past date");
              }
            }else{ //if in a previous year
              console.log("past date");
            }
          }
        });

        var years = [];
        for(var i = 0; i < dateArray.length; i++){
            years.push(dateArray[i].substring(0, 4));
        }

        var leastYearsArray = [];

        var leastYear = years[0];
        for(var i = 0; i < years.length; i++){ //finding minimum year
            if(years[i] < leastYear){
                leastYear = years[i];
            }
        }
        for(var i = 0; i < years.length; i++){ //finding equivalent years
            if(years[i] == leastYear){
                leastYearsArray.push(years[i]);
            }else{
                leastYearsArray.push(0);
            }
        }

        var months = [];
        for(var i = 0; i < leastYearsArray.length; i++){
            if(leastYearsArray[i] != 0){
                months.push(dateArray[i].substring(5, 7));
            }else{
                months.push(0);
            }
        }

        var monthsNoZeros = [];
        for(var i = 0; i < months.length; i++){
            if(months[i] != 0){
                monthsNoZeros.push(months[i]);
            }
        }

        var leastMonthsArray = [];

        var leastMonth = monthsNoZeros[0];
        for(var i = 0; i < months.length; i++){ 
            if((months[i] < leastMonth) && months[i] != 0){
                leastMonth = months[i];
            }
        }
        for(var i = 0; i < months.length; i++){ 
            if(months[i] == leastMonth){
                leastMonthsArray.push(months[i]);
            }else{
                leastMonthsArray.push(0);
            }
        }

        var days = [];
        for(var i = 0; i < leastMonthsArray.length; i++){
            if(leastMonthsArray[i] != 0){
                days.push(dateArray[i].substring(8));
            }else{
                days.push(0);
            }
        }

        var daysNoZeros = [];
        for(var i = 0; i < days.length; i++){
            if(days[i] != 0 ){
                daysNoZeros.push(days[i]);
            }
        }

        var leastDay = daysNoZeros[0];
        for(var i = 0; i < days.length; i++){ //finding minimum year
            if((days[i] < leastDay) && days[i] != 0){
                leastDay = days[i];
            }
        }
        console.log(dateArray[days.indexOf(leastDay)]);
        localStorage.setItem(classNameLatest, dateArray[days.indexOf(leastDay)]);
        // localStorage.setItem(dateArray[days.indexOf(leastDay)], dateArray[days.indexOf(leastDay)]);

        // dateArray[days.indexOf(leastDay)];
    });    
}

function createClassCode(){
    var classCodes = [];
    var flag = true;

    const db = getDatabase();
    const pathRef = ref(db, '/');
    onValue(pathRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            //console.log(childSnapshot.key); //userID
            const secondPathRef = ref(db, '/'+childSnapshot.key+'/Details/');
            onValue(secondPathRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    //console.log(childSnapshot.val().code);
                    classCodes.push(childSnapshot.val().code);
                });
            });
        });
    });

    while(flag){
        var tempCode = "";
        for(var i = 0; i < 4; i++){
            var digit = Math.floor(Math.random() * 10);
            tempCode += digit;
        }
        if(!classCodes.includes(tempCode)){
            flag = false;
            return tempCode;
        }
    }
}

function createClassCard(classNameText, color, squirrel, code, latestAssignment){
    //Creating a newwburrow card like basic box

    var newClass = document.createElement("DIV");
    newClass.setAttribute("id", classNameText);
    newClass.setAttribute("class", "burrowCards");
    newClass.style.position = "relative";
    main.appendChild(newClass);

    //create the header for the burrow card (the colored area)
    var header = document.createElement("P");
    header.setAttribute("class", "classHeaders");
    header.setAttribute("id", code);

    var userFullName;
    var userLastName;
    var userPrefix;
    
    const dbRef = ref(getDatabase());
    get(child(dbRef, '/'+auth.currentUser.uid+'/')).then((snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((childSnapshot) => {
                if(childSnapshot.key != "Details"){
                    // console.log(childSnapshot.key);
                    // console.log(childSnapshot.val().Prefix);
                    userFullName = childSnapshot.key;
                    userPrefix = childSnapshot.val().Prefix;
                    userLastName = userFullName.substring(userFullName.indexOf(' '));
                    if(userPrefix == "Mr" || userPrefix == "Mrs" || userPrefix == "Mx" || userPrefix == "Dr" || userPrefix == "Ms"){
                        header.innerText = userPrefix + ". " + userLastName + "'s " + classNameText;
                        header.value = classNameText;
                    }else{
                        header.innerText = userPrefix + " " + userLastName + "'s " + classNameText;
                        header.value = classNameText;
                    }
                }
            });
        }else{
            console.log("no data");
        }
    }).catch((error) => {
        console.log(error);
    });

    header.style.cursor = "pointer";
    newClass.appendChild(header);

    var assignmentNameLatest;
    var earlyLatest;
    var onTimeLatest;

    if(latestAssignment == 0){
        const db = getDatabase();
        const assignmentPath = ref(db, '/'+auth.currentUser.uid+'/Details/'+classNameText+'/Assignments/');
        findLatest(classNameText, assignmentPath);
        latestAssignment = localStorage.getItem(classNameText);
    }
    
    const db = getDatabase();
    var detailsBold = document.createElement("P");
    detailsBold.innerText =  "UPCOMING:" + "\n" + "No upcoming assignments";
    detailsBold.style.fontWeight = 'bold';
    detailsBold.style.position = "absolute";
    detailsBold.style.bottom = "40px";
    detailsBold.style.paddingLeft = "10px";
    detailsBold.style.fontSize = "14px";
    newClass.appendChild(detailsBold);
    
    const assignmentPath = ref(db, '/'+auth.currentUser.uid+'/Details/'+classNameText+'/Assignments/');
    onValue(assignmentPath, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            if(childSnapshot.val().dueDate == latestAssignment){
                assignmentNameLatest = childSnapshot.key;
                console.log(assignmentNameLatest);
                earlyLatest = childSnapshot.val().earlyAcorns;
                onTimeLatest = childSnapshot.val().onTimeAcorns;

                detailsBold.innerText =  "UPCOMING:\nDue: " + latestAssignment + "\n" + assignmentNameLatest;
                detailsBold.style.fontWeight = 'bold';
                detailsBold.style.position = "absolute";
                detailsBold.style.bottom = "40px";
                detailsBold.style.paddingLeft = "10px";
                detailsBold.style.fontSize = "14px";
                newClass.appendChild(detailsBold);
                
                var detailsReg = document.createElement("P");
                detailsReg.innerHTML = "+"+earlyLatest+" acorns if early" + "<br>" + "+"+onTimeLatest+" acorns if on time";
                detailsReg.style.position = "absolute";
                detailsReg.style.paddingLeft = "10px";
                detailsReg.style.bottom = "0px";
                detailsReg.style.fontSize = "14px";
                newClass.appendChild(detailsReg);
            }            
        });
    });

    //handles the squirrel profile pic
    var squirrelTeacherImg = document.createElement("IMG");
    squirrelTeacherImg.style.objectFit = "cover";
    squirrelTeacherImg.style.borderRadius = "50%";
    squirrelTeacherImg.style.height = "60px";
    squirrelTeacherImg.style.width = "60px";
    squirrelTeacherImg.style.position = "relative";
    squirrelTeacherImg.style.left = "155px";
    squirrelTeacherImg.style.bottom = "50px";

    //Squirrel teacher image url path
    var tempPath = "images\\" + squirrel + ".jpg"; 
    squirrelTeacherImg.src = tempPath;
    newClass.appendChild(squirrelTeacherImg);
    
    var classCode = code;

    //trash icon in bottom right
    var trashIconP = document.createElement("P");
    var trashIconI = document.createElement("I");
    trashIconI.setAttribute("class", "fa-solid fa-trash fa-2xl");


    //Putting them into the class card
    newClass.appendChild(trashIconP);
    trashIconP.appendChild(trashIconI);

    //Trash css
    trashIconP.style.position = "absolute";
    trashIconP.style.bottom = "0px";
    trashIconP.style.right = "10px";
    trashIconP.style.cursor = "pointer";

    //What happens when you click the trash lol
    trashIconI.addEventListener("click", function(event){
        deleteClass(classNameText);
        console.log(classNameText);
    });
    
    //setting the color to match the chosen color
    if(color == "red"){
        newClass.style.border = "10px solid #ff3131";
        header.style.backgroundColor = "#ff3131";
        header.style.boxShadow = "0 15px 0 #ff3131";
        squirrelTeacherImg.style.border = "5px solid #bf1f1f";
        trashIconI.style.color = "#ff3131";
    }else if(color == "orange"){
        newClass.style.border = "10px solid #ff914d";
        header.style.backgroundColor = "#ff914d";
        header.style.boxShadow = "0 15px 0 #ff914d";
        squirrelTeacherImg.style.border = "5px solid #d67233";
        trashIconI.style.color = "#ff914d";
    }else if(color == "yellow"){
        newClass.style.border = "10px solid #f5d35a";
        header.style.backgroundColor = "#f5d35a";
        header.style.boxShadow = "0 15px 0 #f5d35a";
        squirrelTeacherImg.style.border = "5px solid #e8bf2e";
        trashIconI.style.color = "#f5d35a";
    }else if(color == "green"){
        newClass.style.border = "10px solid #9ad486";
        header.style.backgroundColor = "#9ad486";
        header.style.boxShadow = "0 15px 0 #9ad486";
        squirrelTeacherImg.style.border = "5px solid #69a655";
        trashIconI.style.color = "#9ad486";
    }else{
        newClass.style.border = "10px solid #a4ddff";
        header.style.backgroundColor = "#a4ddff";
        header.style.boxShadow = "0 15px 0 #a4ddff";
        squirrelTeacherImg.style.border = "5px solid #5aa5d1";
        trashIconI.style.color = "#a4ddff";
    }

    //When you click the class it goes to burrow page
    header.addEventListener("click", function(event){
        localStorage.setItem("classNameTeacher", header.innerHTML);
        localStorage.setItem("classNameNoTeacher", header.value);
        localStorage.setItem("currentColor", header.style.backgroundColor);
        localStorage.setItem("currentUser", auth.currentUser.uid);
        localStorage.setItem("classCode", header.id);
        
        location.href = "/burrowPage/burrow.html"; 
    }); 
}

function logInFormPopup(){
    document.getElementById("logInForm").style.display = "block";
}

function doesClassExist(){
    var names = []; 

    const db = getDatabase();
    const pathRef = ref(db, '/'+auth.currentUser.uid+'/Details/');
    onValue(pathRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            names.push(childSnapshot.key);
        });
    });

    return names.includes(text);
}

function deleteClass(className){
    console.log("Pls work");
    const db = getDatabase();
    const pathRef = ref(db, '/'+auth.currentUser.uid+'/Details/'+className);
    remove(pathRef);
    document.getElementById(className).remove();
    // document.cookie = "name=" + text + ";" + "expires=Thu, 01 Jan 1970 00:00:00";
}
  
    
