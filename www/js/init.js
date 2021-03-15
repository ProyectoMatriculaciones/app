(function($){
  $(function(){

    $('.sidenav').sidenav();

    //Start de Swipeable tabs
    // var options = { "swipeable": true };
    // var el = document.getElementById('tabs');
    // var instance = M.Tabs.init(el, options);
    $('.tabs').tabs({ "swipeable": true });

    //(WIP) Set carousel tabs height to a 100% of the screen
    // $(".carousel").style = "height: 100%;";
    
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
      url: "http://192.168.41.127:3000/login/alumn",
      contentType: "application/json",
      crossDomain: true,
      dataType: "json",
      data: JSON.stringify(query),
    }).done(function(response) {
      console.log(response)	
    }).fail(function(response) {
      alert("No se ha entrado ningun usuario con ese email.");		
      console.log(response)
      $('.modal').modal('open');
    });

}

$("#signInButton").click(validateLogin)
