var token;
var allProfiles;
var alumnContent;
var requerimentsArray;
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
    $('#modal1').modal({
      dismissible: false
    });
   
    
    //Open at the start the login modal
    $('#modal1').modal('open');
    $('.collapsible').collapsible();
    $(document).ready(function () {
      
      $(".carousel")[0].style = "height: 100vh;";
      
    });





  }); // end of document ready

})(jQuery); // end of jQuery name space

document.addEventListener('deviceready', onDeviceReady, false);
$(document).ready(function () {
  
  $(".carousel")[0].style = "height: 100%;";
  
});


function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  //document.getElementById('deviceready').classList.add('ready');
  // var instance = M.Modal.getInstance(elem);
  //   instance.open();


}

function getAlumDetails(){
  $.ajax({
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'access-token': token
    },
    url: 'https://api-matriculacioones.herokuapp.com/get/alumn?username='+$('#inputUsername').val(),
    contentType: "application/json",
    crossDomain: true,
    dataType: "json",
    // data: JSON.stringify(careerQuery),
  }).done(function (response) {
    alumnContent = response;
    createRequerimentList();
    requestUserCareer();
    importRequirementProfiles();
    


  }).fail(function (response) {
    
  });
  
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
    getAlumDetails();
    
    //Obtain requeriment data from the current user (WIP, currently local)
    responseModal = true;


  }).fail(function (response) {
    if (response.responseJSON != undefined) {
      alert(response.responseJSON.statusData);
    } else {
      alert("Error de conexión");
    }
    $('#modal1').modal('open');
    responseModal = true;
  });
  if (responseModal == false) {
    $('#modal1').modal('open');
  }
}


$("#signInButton").click(validateLogin);


function changeOverallState() {
  var validatingState = 0;
  var validatedState = 0;
  for (let index = 0; index < requerimentsArray.length; index++) {
    if(requerimentsArray[index].filePath){
      validatingState++;
      if(requerimentsArray[index].validated){
        validatedState++;
      }
    }
    
  }
  if(validatingState==requerimentsArray.length){
    $('#baseStatus').css("background-color", " #444444");
    $('#baseStatus').css("width", " 25px");
    $('#baseStatus').css("height", " 25px");
    if(validatedState==requerimentsArray.length){
      $('#validatedStatus').css("background-color", " #48ed07");
      $('#validatedStatus').css("width", " 30px");
    $('#validatedStatus').css("height", " 30px");
    }else{
      $('#validatingStatus').css("background-color", " #ffcc00");
      $('#validatingStatus').css("width", " 30px");
    $('#validatingStatus').css("height", " 30px");
    }
    
  }
 }

function requestUserCareer(){
   
  var careerQuery = alumnContent.termCode.replace(' ','+');
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
  for (let index = 0; index < Object.keys(career.arrayMO).length; index++) {
    
    addCollapsibleLi(career.arrayMO[index].MOCode,career.arrayMO[index].MOName);
    for (let j = 0; j < Object.keys(career.arrayMO[index].arrayUF).length ; j++) {
      addCheckbox(career.arrayMO[index].MOCode,career.arrayMO[index].arrayUF[j].UFName,career.arrayMO[index].arrayUF[j].UFCode);
      
    }
    $('#'+career.arrayMO[index].MOCode+'').on("change",function(){
      if($('#'+career.arrayMO[index].MOCode+'').prop("checked")){
        $('#UF'+career.arrayMO[index].MOCode+'').children("p").children("label").children("input").prop('checked',true)
      }else{
        $('#UF'+career.arrayMO[index].MOCode+'').children("p").children("label").children("input").prop('checked',false)

      }
    })
    
    
  }
  
}

function addCollapsibleLi(id, content) {
  $("#uflist").append('<li><div class="collapsible-header" id="MO'+id+'"><label><input id="' + id + '" name="MO-chk" type="checkbox" /><span></span></label><span>' + content + '</span></div><div id="UF' + id + '" class="collapsible-body"></div></li>');
}

function addCheckbox(parentID, content,id) {
  $("#UF" + parentID).append('<p><label><input id="' + id + '" name="UF-chk" type="checkbox" /><span></span></label><span>' + content + '</span></p>');
}

function getSelectedCheckbox() {
  let checkedList = $('input[name="UF-chk"]:checked');
  let arrayUF = []
  
  if (checkedList.length > 0) {
      arrayUF = [];
      for (let i = 0; i < checkedList.length; i++) {
          arrayUF.push(checkedList[i].id.toString());
      }
      
      return arrayUF;
  }

  return [];
}

function selectChildrenUFs() {
  let checkedList = $('input[name="MO-chk"]:checked');
  let arrayUF = []
  
  if (checkedList.length > 0) {
      arrayUF = [];
      for (let i = 0; i < checkedList.length; i++) {
          arrayUF.push(checkedList[i].id.toString());
      }
      
      return arrayUF;
  }

  return [];
}

$("#btnSaveUFs").click(function sendUFsData(){
  
 var updateQuery = {
    "matriculatedUfs" : getSelectedCheckbox(),
    "email" : alumnContent.email
  }
  $.ajax({
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'access-token': token
      
    },
    url: 'https://api-matriculacioones.herokuapp.com/update/matriculatedUfs',
    contentType: "application/json",
    crossDomain: true,
    dataType: "json",
    data: JSON.stringify(updateQuery),
  }).done(function (response) {
    alert("Datos guardados correctamente")
  }).fail(function (response) {
    alert("Error al enviar los datos")
  });
  
});

function createRequerimentList() {
  if(alumnContent.selectedDocumentsProfile){
    requerimentsArray = alumnContent.selectedDocumentsProfile.arrayDoc;    
    var endpointUrl = 'https://api-matriculacioones.herokuapp.com';    
    var profileName = alumnContent.selectedDocumentsProfile.name;
    var inputEmail = '<input type="hidden" name="email" value="' + alumnContent.email + '" required/>';
    var inputProfileName = '<input type="hidden" name="profileName" value="' + profileName + '" required/>';//accept="image/png, image/jpeg, image/jpg
    
    
    
    for (var i = 0; i < requerimentsArray.length; i++) {
      // create form
      var id = ('form-' + profileName + '-' + requerimentsArray[i].documentName.replace(' ', '')).replace(' ', '')
      var inputDocumentName = '<input type="hidden" name="documentName" value="' + requerimentsArray[i].documentName + '" required/>';      
      var uploadForm = '<form id="'+ id +'" method="POST" action="' + endpointUrl + '/upload/documentsFile' + 'enctype="multipart/form-data">'
        +inputEmail
        +inputProfileName
        +inputDocumentName  
        +'<input id="f' + id + '" type="file" name="file" style="visibility: hidden" accept="image/png, image/jpeg, .jpg, .pdf" required/>'
        +'<span id="txt' + id + '" style="margin-right:5px;"></span>';
        if(!requerimentsArray[i].validated)
        {
          uploadForm+='<input type="button" value="Seleccionar archivo" style="margin-right: 20px;" id="b' + id + '"> </input>'
          +'<input type="submit" value="Subir archivo"/>'
  
        }
        uploadForm+='</form>';

      var name = requerimentsArray[i].documentName;
      name = name.replace(' ','_');
        
      $('#requirementList').append('<li class="collection-item" id="requirement"><div id="requirement-item"><span class="baseDot" id="baseDot' + name + '"></span><span class="deniedDot" id="deniedDot' + name + '"></span><span class="validatingDot" id="validatingDot' + name + '"></span><span class="validatedDot" id="validatedDot' + name + '"></span><div>' + requerimentsArray[i].documentName + '</div>' + uploadForm +'</div></li>');
      


      $("#f" + id).change(function() {
        var changeFileName = this.files[0].name
         $("#txt" + $(this).attr('id').substring(1)).html(changeFileName);
      });

      $("#b" + id).click(function(){
        $("#f" + $(this).attr('id').substring(1)).click()
      })
      // Replace submit form function
      $("#" + id).submit(function(e){
      e.preventDefault();
      var fData = new FormData($(this)[0]);       
      $.ajax({
        url: endpointUrl + '/upload/documentsFile',
        headers: {
            'access-token': token      
          },
        crossDomain: true,
        type: 'POST',
        data : fData, 
        contentType : false,
        processData: false    
      }).done(function (response) {
          $('#baseDot' + fData.get("documentName").replace(' ','_')).css("background-color", " #444444");
          $('#baseDot' + fData.get("documentName").replace(' ','_')).css("width", " 25px");
          $('#baseDot' + fData.get("documentName").replace(' ','_')).css("height", " 25px");
          $('#validatingDot' + fData.get("documentName").replace(' ','_')).css("background-color", " #ffcc00");
          $('#validatingDot' + fData.get("documentName").replace(' ','_')).css("width", " 30px");
          $('#validatingDot' + fData.get("documentName").replace(' ','_')).css("height", " 30px");
          $('#validatedDot' + fData.get("documentName").replace(' ','_')).css("background-color", " #1a4600");
          $('#validatedDot' + fData.get("documentName").replace(' ','_')).css("width", " 25px");
          $('#validatedDot' + fData.get("documentName").replace(' ','_')).css("height", " 25px");
          changeOverallState();
          alert("Fichero subido correctamente")
      }).fail(function (response) {
          alert("Error al subir el fichero")
      });
      return false;
    });

      // Set file label if exists
    if(requerimentsArray[i].filePath)
    {
      var lastIndex = requerimentsArray[i].filePath.lastIndexOf("/");
      if (lastIndex < 0)
      {
        lastIndex = requerimentsArray[i].filePath.lastIndexOf("\\");
      }
      var fileName = requerimentsArray[i].filePath.substring(lastIndex+1)
      $("#txt" + id).html(fileName)
    }
    else
    {
    	$("#txt" + id).html("No se ha subido el archivo")
    }

      // Set state
      if(requerimentsArray[i].filePath && requerimentsArray[i].validated){
        $(("#baseDot" + name)).css("background-color", " #444444");
        $(('#baseDot' + name)).css("width", " 25px");
        $(('#baseDot' + name)).css("height", " 25px");
        $(("#validatedDot" + name)).css("background-color", " #48ed07");
        $(('#validatedDot' + name)).css("width", " 30px");
        $(('#validatedDot' + name)).css("height", " 30px");

      }
      else if(requerimentsArray[i].filePath){
        $(("#baseDot" + name)).css("background-color", " #444444");
        $(('#baseDot' + name)).css("width", " 25px");
        $(('#baseDot' + name)).css("height", " 25px");
        $(("#validatingDot" + name)).css("background-color", " #ffcc00");
        $(('#validatingDot' + name)).css("width", " 30px");
        $(('#validatingDot' + name)).css("height", " 30px");
        $(("#validatedDot" + name)).css("background-color", " #1a4600");
        $(('#validatedDot' + name)).css("width", " 25px");
        $(('#validatedDot' + name)).css("height", " 25px");
      } 
     
      
    };
    changeOverallState();
  }
 
}

function addCollapsibleLiProfileRequeriments(id, content) {
  $("#PR").append('<p><label><input id="'+id+'" name="PR-chk" type="radio" /><span></span></label><span>' + content + '</span></p>');
}

function getSelectedRadiobutton() {
  let checkedList = $('input[name="PR-chk"]:checked');
  if (checkedList.length > 0) {
      
      return checkedList[0].id.toString();
  }
  

  return undefined;
}



function importRequirementProfiles(){
  $.ajax({
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'access-token': token
    },
    url: 'https://api-matriculacioones.herokuapp.com/get/allDocumentsProfile',
    contentType: "application/json",
    crossDomain: true,
    dataType: "json",
    // data: JSON.stringify(careerQuery),
  }).done(function (response) {
    allProfiles=response;
    $("#profilelist").append('<li><div class="collapsible-header" id="profilelistheader"><span> Perfiles de requerimientos</span></div><div id="PR" class="collapsible-body"></div></li>');

    for (let index = 0; index < response.length; index++) {
      addCollapsibleLiProfileRequeriments(response[index].name,response[index].name);
      
    }
    $("#PR").append('<div class="collapsible-header" id="submitChangesBtnProfile"><a class="waves-effect waves-light btn-small" id="btnSaveProfile">Guardar Perfil</a></div>');
    $("#btnSaveProfile").click(function(){
      $('#modalUpdateProfile').modal({
        dismissible: false
      });
      $("#modalUpdateProfile").modal('open');
      $("#acceptProfile").click(function(){
        var selectedProfile = getSelectedRadiobutton();
        if(selectedProfile!=undefined){
          if(allProfiles!=undefined){
            var profile;
            for (let index = 0; index < allProfiles.length; index++) {
              const element = allProfiles[index];
              if(element.name==selectedProfile){
                profile=allProfiles[index]
              }
            }
            updateProfile(profile);
            alumnContent.selectedDocumentsProfile = profile;
            $('#requirementList').empty();
            createRequerimentList();
          }
        }else{
          alert("No hay un perfil selecionado")
        }
        
      })
        
    });
    

  //  alert(JSON.stringify(response));


  }).fail(function (response) {
    alert("Error con el ciclo del usuario")
  });
}

function updateProfile(profile){
  var profileQuery = {
    "documentsProfile": profile,
    "email":alumnContent.email
  }
  $.ajax({
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'access-token': token
      
    },
    url: 'https://api-matriculacioones.herokuapp.com/update/selectedDocumentsProfile',
    contentType: "application/json",
    crossDomain: true,
    dataType: "json",
    data: JSON.stringify(profileQuery),
  }).done(function (response) {
    alert("Perfil guardado correctamente")
  }).fail(function (response) {
    alert("Error al enviar el perfil")
  });
}



