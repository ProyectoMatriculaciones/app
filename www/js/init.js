var token;
(function ($) {
  $(function () {

    $('.sidenav').sidenav();



    //Start de Swipeable tabs
    // var options = { "swipeable": true };
    // var el = document.getElementById('tabs');
    // var instance = M.Tabs.init(el, options);
    $('.tabs').tabs({ "swipeable": true });

    //(WIP) Set carousel tabs height to a 100% of the screen
    //$('.carousel-slider')[0].style = "height: 100%;";

    //Set parameters to the modal
    $('.modal').modal({
      dismissible: false
    });
    //Open at the start the login modal
    $('.modal').modal('open');
    $('.collapsible').collapsible();
    $(document).ready(function () {
      console.log($(".carousel")[0].style);
      $(".carousel")[0].style = "height: 100vh;";
      console.log($(".carousel")[0].style);
    });





  }); // end of document ready

})(jQuery); // end of jQuery name space

document.addEventListener('deviceready', onDeviceReady, false);
$(document).ready(function () {
  console.log($(".carousel")[0].style);
  $(".carousel")[0].style = "height: 100%;";
  console.log($(".carousel")[0].style);
});


function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  //document.getElementById('deviceready').classList.add('ready');
  // var instance = M.Modal.getInstance(elem);
  //   instance.open();


}



function validateLogin() {
  var responseModal = false;
  var pass = $('#inputPass').val();
  // Future var with the local password hashed
  // var passMd5 = md5(pass);
  var query = {
    "username": $('#inputUsername').val(),
    "password": pass

  }
  $.ajax({
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    url: "https://api-matriculacioones.herokuapp.com/login/alumn",
    contentType: "application/json",
    crossDomain: true,
    dataType: "json",
    data: JSON.stringify(query),
  }).done(function (response) {
    token = response.statusData;
    createRequerimentList();
    requestUserCareer();
    //Obtain requeriment data from the current user (WIP, currently local)
    responseModal = true;


  }).fail(function (response) {
    if (response.responseJSON != undefined) {
      alert(response.responseJSON.statusData);
    } else {
      alert("Error de conexión");
    }
    $('.modal').modal('open');
    responseModal = true;
  });
  if (responseModal == false) {
    $('.modal').modal('open');
  }
}


$("#signInButton").click(validateLogin);


function changeOverallState() {
  //Validate by the admins
  $('.dot').css("background-color", " #5fa249");
  //Content submitted 
  $('.dot').css("background-color", " #ffcc00");
}

function requestUserCareer(){
   
  var careerQuery = 'CFPM++++AR10'
  var career;
  $.ajax({
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'access-token': token
    },
    url: 'https://api-matriculacioones.herokuapp.com/get/grade?careerCode='+careerQuery,
    contentType: "application/json",
    crossDomain: true,
    dataType: "json",
    // data: JSON.stringify(careerQuery),
  }).done(function (response) {
    career = response;
    createUfList(career);
  //  alert(JSON.stringify(response));


  }).fail(function (response) {
    alert("Error con el ciclo del usuario")
  });
  
}

function createUfList(career) {
  
  
  console.log(career)
  for (let index = 0; index < Object.keys(career.arrayMO).length; index++) {
    // console.log(career.arrayMO[index].MOCode)
    addCollapsibleLi(career.arrayMO[index].MOCode,career.arrayMO[index].MOName);
    for (let j = 0; j < Object.keys(career.arrayMO[index].arrayUF).length ; j++) {
      addCheckbox(career.arrayMO[index].MOCode,career.arrayMO[index].arrayUF[j].UFName);
      
    }
    
    
  }
  
}

function addCollapsibleLi(id, content) {
  $("#uflist").append('<li><div class="collapsible-header" id="MO'+id+'"><label><input id="' + id + '" name="MO-chk" type="checkbox" /><span></span></label><span>' + content + '</span></div><div id="UF' + id + '" class="collapsible-body"></div></li>');
}

function addCheckbox(id, content) {
  $("#UF" + id).append('<p><label><input id="' + content + '" name="UF-chk" type="checkbox" /><span></span></label><span>' + content + '</span></p>');
}

function createRequerimentList() {
  var requerimentsArray = [{
    "documentName": "DNI",
    "Status": "grey"
  }, {
    "documentName": "Pago Matricula",
    "Status": "grey"
  }];
  var i = 0;
  for (i = 0; i < requerimentsArray.length; i++) {

    $('#requirementList').append('<li class="collection-item" id="requirement"><div id="requirement-item"><span class="dot" id=dot' + requerimentsArray[i].documentName + '></span><div>' + requerimentsArray[i].documentName + '</div><div id="documentName">No se ha enviado ningún documento</div><a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>');
    if (requerimentsArray[i].Status == "green") {

      $("#dot" + requerimentsArray[i].documentName).css("background-color", " #5fa249");
    } else if (requerimentsArray[i].Status == "orange") {

      $("#dot" + requerimentsArray[i].documentName).css("background-color", " #ffcc00");
    }

    $('#requirementList').on("click", "a", function () {
      $(this).parent().children('span').css("background-color", " #ffcc00");
    });

  };
}


