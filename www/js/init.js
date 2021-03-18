(function($){
  $(function(){

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
    

    
    
   

  }); // end of document ready
  
})(jQuery); // end of jQuery name space

document.addEventListener('deviceready', onDeviceReady, false);

 
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
 
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //document.getElementById('deviceready').classList.add('ready');
    // var instance = M.Modal.getInstance(elem);
    //   instance.open();
    
    
}

function validateLogin(){
    var query = {
      "username": $('#inputUsername').val(),
      "password": $('#inputPass').val()
    }
    $.ajax({
      method: "POST",
      headers: {
              'Content-Type':'application/json'
          },
      url: "https://api-matriculacioones.herokuapp.com/login/alumn",
      contentType: "application/json",
      crossDomain: true,
      dataType: "json",
      data: JSON.stringify(query),
    }).done(function(response) {
      //Obtain requeriment data from the current user
      var requerimentsArray = [{
          "documentName": "DNI",
          "Status": "green"
      }, {
          "documentName": "Payment",
          "Status": "orange"
      }];
      
        for(i = 0; i < requerimentsArray.length; i++){
          $('#requirementList').append('<li>'+requerimentsArray[i].documentName+'<span class="dot"></span></li>');
          alert(requerimentsArray[i].Status);
      };
     
    }).fail(function(response) {
      if(response.responseJSON != undefined){
        alert(response.responseJSON.statusData);
      }else{
        alert("Error de conexión");
      }
      $('.modal').modal('open');
    });

}

$("#signInButton").click(validateLogin)

function changeOverallState(){
  //Validate by the admins
  $('.dot').css("background-color"," #5fa249");
  //Content submitted 
  $('.dot').css("background-color"," #ffcc00");
}
