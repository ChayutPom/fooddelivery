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

var arrayMenu = [];
var arrayCount = [];
var arrayPrice = [];
var arrayNum =[];
a=0;


document.addEventListener('init', function (event) {
  var page = event.target;


  if (page.id === 'page1') {
    //=====================restarant=========================================
    db.collection("restaurant").get().then(function (querySnapshot)  {
      querySnapshot.forEach(function (doc)  {
        
        var item = `<ul class="list list--inset"  >
      <li  id="selectRestaurant" onclick="myFunction('${doc.data().idRestaurant}')"  class="list-item list--inset__item list-item--chevron list-item--tappable" style="height: 100px">
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

    
    $("#backhomebtn").click(function () {
      $("#content")[0].load("home.html");

    });
  } else if (page.id === 'page2') {
    console.log(page.data.idMenu);
    db.collection("restaurant").where("idRestaurant", "==", page.data.idMenu )
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var item = `<ons-list-item>
        <div class="left" >
              <img style="height:100px; width:100px" class="list-item__thumbnail" src="${doc.data().picture}">
        </div>
        <div class="center" style="margin-left: 25px">
        ${doc.data().nameRestaurant}<br>FreeDelivery
        </div>
        <div class="right">4.6 ★<br>(30)</div>
      </ons-list-item>`
        $("#logo").append(item);
      });
 
    });

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
          <div onclick="cart('${doc.data().nameMenu}','${doc.data().price}','${doc.data().num}')"  id="plus" class="list-item__right">
                <button  class="fab fab--mini"><i class="zmdi zmdi-plus"></i></button>
          </div>
        </li>
      </ul>`
        $("#select").append(item);
      });
 
    });

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
        
    //========category========================
    $("#category").empty();
    db.collection("category").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var item = `
        <ons-row class="category" >
            <ons-col modifier="nodivider"  >
                <div class="category_header" id="category" style="background-image: url('${doc.data().pic}')">
                    <figure class="category_thumbnail">
                        <div class="category_title" style="text-shadow: 3px 2px #006400;" id="Category_1_name">${doc.data().name}</div>
                    </figure>
                </div>
            </ons-col>
        </ons-row>`
        $("#category").append(item);
      });
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
   console.log("orderPage");
  //  db.collection("cart").get().then(function (querySnapshot)  {
  //   querySnapshot.forEach(function (doc)  {
      for (i = 0; i < arrayMenu.length; i++) {

        var item = `<ons-row>
        <ons-col width="200px">${arrayMenu[i]}</ons-col>
        <ons-col>${arrayPrice[i]}</ons-col>
        <ons-col>${arrayCount[i]}</ons-col> 
        <ons-col><ons-icon ><i class="far fa-minus-square"></i></ons-icon></ons-col>  
        </ons-row>` 
      
     
      $("#order").append(item);    
      }
  //   });    

  $("#pay").click(function () {
    document.querySelector('#myNavigator').pushPage('home.html');
    
  });
  $("#cancle").click(function () {
    
    document.querySelector('#myNavigator').pushPage('home.html');
    // $("#content")[0].load("home.html");
  });
  }
});



function myFunction(idRes) {
  
 console.log(idRes);

  
  document.querySelector('#myNavigator').pushPage('page2.html', {data: {idMenu: idRes}});

}


function cart(menu,price,count) {

  console.log(menu,price,count);

  var x = document.getElementById("cart");
  x.style.display = "";
  
  var arraycart = arrayMenu.includes(menu);

 
  
  if(arraycart == false){
    arrayMenu.push(menu);
  arrayPrice.push(price);
  arrayCount.push(count);
  console.log(arrayMenu);
  console.log(arrayPrice);
  console.log(arrayCount);
  arrayNum.push(a++);
  console.log(arrayNum);
  
  }else if(arraycart == true){
    
  }

  // db.collection("cart").add({
  //   nameMenu: menu,
  //   price:price,   
  //   });
    $("#cart").click(function () {
      document.querySelector('#myNavigator').pushPage('order.html');
    });

 }
 