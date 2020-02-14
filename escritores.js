// 
// Jose Vega Flordelis
// 


var pElements;
var divBotones;
var botonesControl;

window.addEventListener("load", () => {
  refrescaBotones();
  document.getElementById('botonBuscar').addEventListener('click', ()=>{
    ajaxGet(procesar);
  });
  document.getElementById('botonAgregar').addEventListener('click', ()=>{
    guardar();
  });

});

function refrescaBotones () {
  pElements = document.getElementsByTagName('p');
  divBotones = document.getElementById('divBotones');
  createButtons();
}

function findAddButton(lista) {
  for (const element of lista) {
    if (element.value === "añadir") {
      return element;
    } 
  }
}

function findRemoveButton(lista) {
  for (const element of lista) {
    if (element.value === "eliminar") {
      return element;
    } 
  }
}

function createButtons(){
  var controlButtons = '';
  for(let pos=0;pos<pElements.length;pos++){
    controlButtons+=createControlButton(pos);
  }
  divBotones.innerHTML = controlButtons;
}

function createControlButton(pos){
  let nParagraph = pos+1;
  return "<a href='#' class='muestraoculta' id=pButton" + pos + " onclick='modifyParagraph(" + pos + ")'>Ocultar parrafo " + nParagraph + "</a>"
}

function modifyParagraph(pos){
  let element = pElements[pos];
  let numElem = pos+1
  if(element.style.display === 'none'){
    element.style.display = 'block';
    document.getElementById('pButton' + pos).innerText = "Ocultar parrafo " + numElem
  }else{
    element.style.display = 'none';
    document.getElementById('pButton' + pos).innerText = "Mostrar parrafo " + numElem
  }
}

function removeParagraph(){
  let pos = document.getElementById('numParrafo').value - 1;
  pElements[pos].remove();
  refrescaBotones();
}

function addParagraph(){
  let pos = document.getElementById('numParrafo').value - 1;
  let pargf = '<p>' + document.getElementById('textonuevo').value + '</p>';
  let element = pElements[pos];
  element.insertAdjacentHTML('beforebegin', pargf);
  refrescaBotones();
}

function ajaxGet(callback) {
  var id = document.getElementById('idEscritor').value;
  var req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/escritores/" + id, true);
  req.addEventListener("load", () => {
      if (req.status >= 200 && req.status < 400) {
          console.log(req.responseText);
          callback(req.responseText);
      }else{
          console.error(req.status + " " + req.statusText);
      }
  });
  req.addEventListener("error", () => {
      console.error("error de red");
  });
  req.send(null);
}

function ajaxPost(writer) {
  var req = new XMLHttpRequest();
  req.open("POST", "http://localhost:3000/escritores", true);
  req.setRequestHeader('Content-type','application/json');
  req.onload = ()=> {
      if (req.readyState == 4 && req.status == "201") {
          console.log(res.responseText);
          document.getElementById('nomEscritor').value = '';
          document.getElementById('nomLibro').value = '';
          document.getElementById('nacEscritor').value = '';
      } else {
          console.error(req.status + " " + req.statusText);
      }
  }

  req.error =  () => {
      console.error("error de red");
  }
  req.send(writer);
}


function procesar(respuesta) {
  var escritor = JSON.parse(respuesta);
  document.getElementById('nomEscritor').value = escritor.nombre;
  document.getElementById('nomLibro').value = escritor.libro;
  document.getElementById('nacEscritor').value = escritor.nacionalidad;
}

function guardar(){
  var escritor = new Object();
  escritor.nombre = document.getElementById('nomEscritor').value;
  escritor.libro = document.getElementById('nomLibro').value;
  escritor.nacionalidad = document.getElementById('nacEscritor').value;
  ajaxPost(JSON.stringify(escritor));
}

