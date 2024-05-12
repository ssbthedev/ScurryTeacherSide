// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js';
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js';
// import {getDatabase, ref, update} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

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

// // Input class name, color, squirrel and burrow code into firebase when submit button is pressed
// var nameOfClass = publicVariables.classNames;
// var colorChosen = publicVariables.classColors;
// var imageChosen = publicVariables.classImages;
// var burrowCode = publicVariables.classCodes;

// document.getElementById('submitNewClass').addEventListener('click',(e) => {

//   updateUserData(nameOfClass[nameOfClass.length-1], colorChosen[colorChosen.length-1], imageChosen[imageChosen.length-1], burrowCode[burrowCode.length-1]);

// });

// // '.', '$', '#', '[]' error in string 

// function updateUserData(className ,colorName, squirrelType, burrowCode) {
//   // Important - remember the / is to nest it into the child
//   const db = getDatabase();
//   //  const reference = ref(db, auth.currentUser.uid + '/' + userName + '/Details/' + className)
//   const reference = ref(db, auth.currentUser.uid + '/Details/' + className)

//     update(reference, {
//       color: colorName,
//       squirrel: squirrelType,
//       code: burrowCode 
//     }).then(() => {
//       // Data saved successfully!
//       alert('data updated');
//     })
//       .catch((error) => {
//           // The write failed...
//           alert(error);
//     });
// }

