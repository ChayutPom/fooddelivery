// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC4hKEZk9upR5F6UJNzsPsBLxF4BlVKXgM",
  authDomain: "food247-64ccb.firebaseapp.com",
  databaseURL: "https://food247-64ccb.firebaseio.com",
  projectId: "food247-64ccb",
  storageBucket: "food247-64ccb.appspot.com",
  messagingSenderId: "42363145617",
  appId: "1:42363145617:web:ca2e9f8447112dde6f1e30"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var db = firebase.firestore();

// ดูสถานะการ login
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    //var displayName = user.displayName;
    var email = user.email;
    console.log(email + "signed in");
    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    // var uid = user.uid;
    // var providerData = user.providerData;
    // ...
  } else {
    console.log("sign out");
    // User is signed out.
    // ...
  }
});

document.addEventListener('init', function (event) {
  var page = event.target;


  if (page.id === 'page1') {
    db.collection("restaurant").get().then(function (querySnapshot)  {
      querySnapshot.forEach(function (doc)  {
        
        var item = `<ul class="list list--inset"  >
      <li id="selectRestaurant" onclick="myFunction('${doc.data().idRestaurant}')"  class="list-item list--inset__item list-item--chevron list-item--tappable" style="height: 100px">
      <div class="list-item__left" >
        <img class="list-item__thumbnail" src="${doc.data().picture}">
      </div>
      <div  class="list-item__center">
        <div class="list-item__title">${doc.data().nameRestaurant}</div>
        <div class="list-item__subtitle">${doc.data().type}</div>
      </div>
      <div class="list-item__right" style="margin-right: 20px">Menu</div>
    </li></ul>` 
        $("#res").append(item);    

        
      });
      
    });
    
    
  } else if (page.id === 'page2') {
    console.log(page.data.idMenu);
    
    db.collection("menu").where("idMenu", "==", page.data.idMenu )
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var item = `<ul class="list">
        <li class="list-item">
          <div class="list-item__left">
            <img class="list-item__thumbnail"  src="${doc.data().pic}" alt="Cute kitten">
          </div>
          <div class="list-item__center">
            <div class="list-item__title">${doc.data().nameMenu}</div>
            <div class="list-item__subtitle">${doc.data().price} ฿</div>
          </div>
          <div id="plus" class="list-item__right">
                <button  class="fab fab--mini"><i class="zmdi zmdi-plus"></i></button>
          </div>
        </li>
      </ul>`
        $("#select").append(item);
      });
      $("#select").click(function () {
        console.log('ddd');
        
        var x = document.getElementById("cart");
      x.style.display = "";
      });
    });
    // page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }




  if (page.id === 'homePage') {
    console.log("homePage");

    $("#menubtn").click(function () {
      $("#sidemenu")[0].open();
    });
    //=============category=============
    $('#category').click(function () {
      content.load('food.html');
      
              
          
        });  
        $("#backhomebtn").click(function () {
          $("#content")[0].load("home.html");

        });
        
    
    //========recomended========================
    $("#carousel").empty();
    db.collection("recomentdet").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var item = `<ons-carousel-item modifier="nodivider" id="item${doc.data().id}" class="recomended_item">
            <div class="thumbnail" style="background-image: url('${doc.data().photourl}')">
            </div>
            <div class="recomended_item_title" id="item1_${doc.data().id}">${doc.data().name}</div>
        </ons-carousel-item>`
        $("#carousel").append(item);
      });
    });
  }

 
  
  if (page.id === 'menuPage') {
    console.log("menuPage");

    $("#login").click(function () {
      $("#content")[0].load("login.html");
      $("#sidemenu")[0].close();
    });

    $("#logout").click(function () {
      //firebase sign out
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        $("#content")[0].load("login.html");
        $("#sidemenu")[0].close();
      }).catch(function (error) {
        // An error happened.
        console.log(error.message);
      });
    });

    $("#home").click(function () {
      $("#content")[0].load("home.html");
      $("#sidemenu")[0].close();
    });
  }

  //======login=========
  if (page.id === 'loginPage') {
    console.log("loginPage");

    $("#signinbtn").click(function () {
      var username = $("#username").val();
      var password = $("#password").val();
      firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {

        console.log(error.message);
      });

      
    })
    
    $("#google").click(function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        $("#content")[0].load("home.html");
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        firebase.auth().signInWithRedirect(provider);
      });
      });
    $("#signupbtn").click(function () {
      $("#content")[0].load("signup.html");
      $("#sidemenu")[0].close();
    })

    $("#backhomebtn").click(function () {
      $("#content")[0].load("home.html");
    });
  }


  //------regis---------
  if (page.id === 'signUpPage') {
    $("#signupbtn").click(function () {
      console.log("ssssss")
      db.collection("users").doc().set({
        firstname: document.getElementById('fname').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        conpassword: document.getElementById('conpassword').value,
        phone: document.getElementById('phone').value


      })
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });

      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak')
        } else {
          alert(errorMessage);
        }
      });

    });
    $("#backhomebtn").click(function () {
      $("#content")[0].load("home.html");
    });
  }
 



  if (page.id === 'orderPage') {
    $("#backhomebtn").click(function () {
      $("#content")[0].load("foodmenu.html");
    });
  }
});



function myFunction(idRes) {
  
 console.log(idRes);

  
  document.querySelector('#myNavigator').pushPage('page2.html', {data: {idMenu: idRes}});
// };
}