(function($){
  $(function(){

    $('.sidenav').sidenav();

    //Start de Swipeable tabs
    var options = { "swipeable": true };
    var el = document.getElementById('tabs');
    var instance = M.Tabs.init(el, options);

    $(document).ready(function(){
      //Set parameters to the modal
      $('.modal').modal({
        dismissible: false
      });
      //Open at the start the login modal
      $('.modal').modal('open');
      
    });
    

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
