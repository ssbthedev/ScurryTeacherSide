// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
// // import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js';
// import {getDatabase, ref, set, push, onValue , get, child, remove, update} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAiIKZHUOVT3Mx8fYqyy-esU6kCPfmaYQA",
//   authDomain: "scurry-4e55a.firebaseapp.com",
//   projectId: "scurry-4e55a",
//   storageBucket: "scurry-4e55a.appspot.com",
//   messagingSenderId: "881979709277",
//   appId: "1:881979709277:web:1da56957b42ed4e9683ab4",
//   measurementId: "G-S84JRGMZ2J"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// var uid;



// /**
//  * When the sign Up button is clicked: 
//   * Checks if the signUpMore has already been opeened otherwise opens it
//   * Gets email, password, name and prefix
//   * Uses firebase authentication method createUserWithEmailAndPassword to signup using email and password
//   * After signed in get rids of signup modal and writes Name and Prefix into the RealtimeDatabase
//   * Realtime Database
//   * UID
//   *  Name
//   *    Prefix
//  */
// document.getElementById("signUp-submit").addEventListener("click", signUp);
// function signUp() {
//   if(window.getComputedStyle(document.getElementById("signUpMore")).display == "none"){
//     document.getElementById("signUpMore").style.display = "block";
//   }else{
//     var email = document.getElementById("email").value;
//     var password = document.getElementById("password").value;
//     var name = document.getElementById("signUp-Name").value;
//     var prefix = document.getElementById("signUp-Prefix").value;
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//       // Signed in 
//         uid = auth.currentUser.uid;
//         document.getElementById("signUpMore").style.display = "none";
//         document.getElementById("logInForm").style.display = "none";
//         // console.log(uid);
//         writeUserData(uid, name, prefix);
//       })
//       .catch((error) =>{
//         document.getElementById("errorMessageLogin").style.display = "block";
//         document.getElementById("errorMessageLogin").innerHTML = "Please enter a valid email that DOES NOT already have an account created and/or a password with at least 6 characters";
//         // alert("not working");
//       });
//   }
// }

// /**
//  * When the log In button is clicked: 
//   * Gets email, password for log in
//   * Uses firebase authentication method signInWithEmailAndPassword to signup using email and password
//   * After Log in get rids of logIn modal and writes Name and through an alert telling the user that they have been able to login into the classroom
//   * else gives error message
//  */
// document.getElementById("logIn-submit").addEventListener("click", logIn);

// function logIn() {
//   var email = document.getElementById("email").value;
//   var password = document.getElementById("password").value;
//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in 
//       // const user = userCredential.user;
//       // ...
//       // console.log(user);
//       alert("Signed in " + email + " " + auth.currentUser.uid);
//       document.getElementById("logInForm").style.display = "none";
//       script.fill();
//     })
//     .catch((error) => {
//       document.getElementById("errorMessageLogin").style.display = "block";
//       document.getElementById("errorMessageLogin").innerHTML = "Please enter a valid email that DOES NOT already have an account created and/or a password with at least 6 characters";
//        // alert("Not Logged In");  
//       const message = error.code;
//       const errorMessage = error.message;
//     });

// }

// function writeUserData(uid1, name, prefix) {

//   // Important - remember the / is to nest it into the child
//   const db = getDatabase();
//   const reference = ref(db, uid1 + '/' + name)

//     set(reference, {
//       Prefix: prefix
//     })
//     .then(() => {
//       alert("Signed Up " + name + "\n Uid:" + uid1)
//     })
//     .catch((error) => {
//       // The write failed...
//       alert("error");
//     });

// } 

// function getData(){
//   const dbRef = ref(getDatabase()); // getting the databse
//   get(child(dbRef, '/'+auth.currentUser.uid+'/')).then((snapshot) => { // getting the current user id from the databse
//     if (snapshot.exists()) { // checking if the user exists in the databse
//       console.log(snapshot.val());
//       console.log(snapshot.val().Name); 
//     } else {
//       console.log("No data available");
//     }
//   }).catch((error) => {
//     console.error(error);
//   });

// }



