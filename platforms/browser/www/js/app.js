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

    var email = user.email;
    console.log(email + "signed in");

  } else {
    console.log("sign out");
    // User is signed out.
    // ...
  }
});

var arrayMenu = [];
var arrayCount = [];
var arrayPrice = [];
var arrayNum = [];
a = 0;
var total = [];
var totalall = 0;

document.addEventListener('init', function (event) {
  var page = event.target;


  if (page.id === 'page1') {
    //=====================restarant=========================================
    db.collection("restaurant").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {

        var item = `
        <ul class="list list--inset"  >
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
    db.collection("restaurant").where("idRestaurant", "==", page.data.idMenu)
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

    db.collection("menu").where("idMenu", "==", page.data.idMenu)
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
    var user = firebase.auth().currentUser;
    $("#cart").click(function () {

      if (user) {
        document.querySelector('#myNavigator').pushPage('order.html');
      } else {
        ons.notification.alert("Please login")
      }
    });

  }




  if (page.id === 'homePage') {
    $("#menubtn").click(function () {
      $("#sidemenu")[0].open();
    });
    //=============category=============

    $('#category').click(function () {
      $("#content")[0].load("food.html");
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
                <div class="category_header" id="category"  style="background-image: url('${doc.data().pic}')">
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
    $("#address").click(function () {
      $("#content")[0].load("address.html");
      $("#sidemenu")[0].close();
    });
  }


  if (page.id === "addressPage") {
    var lat;
    var lng;
    var selectLat;
    var selectLng;
   
   
   
     var onSuccess = function(position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude ;
   
   
          mapboxgl.accessToken = 'pk.eyJ1IjoidG90ZXphMzEiLCJhIjoiY2sybGFlZWQwMDUwejNkbXU3cDh1MmRzbCJ9.S6s6C36_Y-h4-HcKrDX7vA';
          var map = new mapboxgl.Map({
          container: 'map', // container id
          style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
          center: [lng, lat], // starting position [lng, lat]
          zoom: 13 // starting zoom
          });
   
          var marker = new mapboxgl.Marker({
           draggable: true
           })
           .setLngLat([lng, lat])
           .addTo(map);
            
           function onDragEnd() {
   
           var lngLat = marker.getLngLat();
           selectLat = lngLat.lat;
           selectLng = lngLat.lng;
           coordinates.style.display = 'block';
           coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
   
   
           }
            
           marker.on('dragend', onDragEnd);
          
       };
   
       // onError Callback receives a PositionError object
       //
       function onError(error) {
           alert('code: '    + error.code    + '\n' +
                 'message: ' + error.message + '\n');
       }
   
       navigator.geolocation.getCurrentPosition(onSuccess, onError);
   
   
   
       $("#setAddress").click(function(){
           ons.notification.alert("Delivery: " + selectLat +","+selectLng);
         
       });
   
   
       }


  //======login=========
  if (page.id === 'loginPage') {
    $("#signinbtn").click(function () {
      var username = $("#username").val();
      var password = $("#password").val();
      firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {

        console.log(error.message);
      });


    })

    $("#google").click(function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        $("#content")[0].load("home.html");
      }).catch(function (error) {
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

    var bar = `<ons-toolbar >
    <div  class="left" id="backhomebtn">
      <ons-back-button >Back</ons-back-button>
    </div>
  </ons-toolbar>`
    $("#bar").append(bar);

    for (i = 0; i < arrayMenu.length; i++) {

      var item = `<ons-row>
        <ons-col width="150px">${arrayMenu[i]}</ons-col>
        <ons-col>${arrayPrice[i]}</ons-col>
        <ons-col onclick="myDem(${arrayNum[i]})"><ons-icon ><i class="far fa-minus-square"></i></ons-icon></ons-col>
        <ons-col>${arrayCount[i]}</ons-col> 
        <ons-col onclick="myDep(${arrayNum[i]})"><ons-icon ><i class="far fa-plus-square"></i></ons-icon></ons-col>  
        <ons-col>${parseInt(arrayPrice[i]) * parseInt(arrayCount[i])}</ons-col>       
        </ons-row>
        <ons-row></ons-row>`
      var arraycart2 = arrayMenu[i].includes(arrayMenu[i]);

      if (arraycart2 == false) {
        total.push(parseInt(arrayPrice[i]) * parseInt(arrayCount[i]));
      } else if (arraycart2 == true) {
        total.splice(i, 1, parseInt(parseInt(arrayPrice[i]) * parseInt(arrayCount[i])));
      }
      $("#order").append(item);
    }

    document.getElementById("demo2").innerHTML = "Total: " + total.reduce(myFunc);

    function myFunc(total, num) {
      return total + num;
    }

    $("#pay").click(function () {
      ons.notification.alert("Pay with cash");
      $('#myNavigator')[0].removePage('home.html');
      a = 0;
      b = 1;
      arrayMenu = [];
      arrayMenu = [];
      arrayCount = [];
      arrayPrice = [];
      total = [];
    });
    $("#pay2").click(function () {
      ons.notification.alert("Pay with paypal");
      $('#myNavigator')[0].removePage('home.html');
      a = 0;
      b = 1;
      arrayMenu = [];
      arrayMenu = [];
      arrayCount = [];
      arrayPrice = [];
      total = [];
    })

    $("#cancle").click(function () {
      ons.notification.alert('Cancle!', $('#myNavigator')[0].removePage('home.html'));
      document.querySelector('#myNavigator').pushPage('order.html');
      a = 0;
      b = 1;
      arrayMenu = [];
      arrayMenu = [];
      arrayCount = [];
      arrayPrice = [];
      total = [];
    });
  }


});


function myDem(q) {
  arrayCount.splice(q, 1, parseInt(arrayCount[q]) - 1);
  if (arrayCount[q] <= 0) {
    arrayMenu.splice(q, 1);
    arrayCount.splice(q, 1);
    arrayPrice.splice(q, 1);
    total.splice(q, 1);

  }
  $("#or").load("order.html");
}
function myDep(p) {
  arrayCount.splice(p, 1, parseInt(arrayCount[p]) + 1);
  $("#or").load("order.html");
}

function myFunction(idRes) {

  
  document.querySelector('#myNavigator').pushPage('page2.html', { data: { idMenu: idRes } });

}
function cart(menu, price, count) {

  var x = document.getElementById("cart");
  x.style.display = "";

  var arraycart = arrayMenu.includes(menu);

  if (arraycart == false) {

    arrayMenu.push(menu);
    arrayPrice.push(price);
    arrayCount.push(count);
    arrayNum.push(a++);
  } else if (arraycart == true) {

  }
}
