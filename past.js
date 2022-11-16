
const $container = document.querySelector('.containerEvents')
const $check = document.getElementById('checkboxs')
const $buscador = document.getElementById('buscador')

let datos ;
let currentDate;
let eventos;
let fn;
let eventosFiltrados;
let evento;
let eventosSinRepetir;
let arrayEventosSinRepetir;

 
fetch("https://amazing-events.herokuapp.com/api/events")
    .then((response) => response.json())
    .then((json) => {
        datos = json;
        eventos = datos.events;
        currentDate = datos.currentDate;
        fn = (eventos) => eventos.category;
        eventosFiltrados = eventos.filter(fn);
        evento = eventosFiltrados.map(fn);
        eventosSinRepetir = new Set(evento);
        arrayEventosSinRepetir = Array.from(eventosSinRepetir);
        createCheckboxs(arrayEventosSinRepetir, $check);
        imprimirEventos(eventosFiltrados, $container);
        app();
    }).catch((exception) => console.log(exception)); 

    function app(){
       
        $check.addEventListener('change', (event) =>{
    
            if(eventCheck().length === 0){
                $container.innerHTML = '<h2> Seleccione un evento </h2>'
                return
           } 
           const eventosCheck = filtrarEventos(eventosFiltrados, eventCheck());
           eventosCheck.length !== 0 ? imprimirEventos(eventosCheck, $container)
           : $container.innerHTML = '<h2> no hay eventos </h2>';
        })
        
        $buscador.addEventListener("keyup", e=>{
            //filtro por titulo
            const eventosFiltrado = buscarTitulo(filtrarEventos(eventos, eventCheck()))
            //filtro evento por categoria
           if(eventosFiltrado.length != 0){
               imprimirEventos(eventosFiltrado, $container);
           }else{
               $container.innerHTML =  ` <h2 class="text-bg-danger col-12 text-center">NO HAY RESULTADO</h2> `
           }
       
       })
    }
  function createCheckboxs(values, container){
    let template = '';
    values.forEach(element => template += `
                    <div>
                        <input type="checkbox" value="${element}" id="c4" name="c4" checked autocomplete="off">
                        <label for="c4">${element}</label>
                    </div>
                `    
    )
    container.innerHTML = template;
 }


function createCard(dato){
    let div = document.createElement('div');
    div.classList.add( 'd-flex',  'container-fluid' , 'justify-content-evenly', 'width')
    div.innerHTML = `<div class="card m-2" style="width: 20rem; height: 27rem;">
               <img src="${dato.image}" class="card-img-top" alt="imagen de ${dato.image}">
               <section class="card-body">
                   <h5 class="card-title">${dato.name}</h5>
                   <p class="card-text">${dato.description}</p>
                       
                   <div class="d-flex justify-content-evenly">
                       <p>${dato.price}$</p>
                       <a href="./details.html?id=${dato._id}" class="btn btn-primary">Mas</a>
                   </div>
               </section>
          </div>
         `
    return div;
}

function imprimirEventos(eventos, contenedor){
    contenedor.innerHTML = '';

    
    let fragment = document.createDocumentFragment();

    eventos.forEach(evento =>{
            if(evento.date < currentDate){
                return fragment.appendChild(createCard(evento));
            }
       } 
    );

    contenedor.appendChild(fragment);
}



function eventCheck(){
    const checkedFiltrado = Array.from(document.querySelectorAll(" input[type='checkbox']:checked")).map(input => input.value)
    return checkedFiltrado;
}


function filtrarEventos(datos , eventosSeleccionados){
    const fn = evento => eventosSeleccionados.includes(evento.category);
    const filtrados = datos.filter(fn);
    return filtrados;
}


function buscarTitulo(evento){
    console.log(evento);

    return evento.filter(evento => evento.name.toLowerCase().includes($buscador.value.toLowerCase()));
}

function buscarCategoria(categoria, evenCategoria){
    let array = [];
    if(categoria.length != 0){
        array = categoria.filter(evento => evento.category.includes(evenCategoria));
    }else{
        array = categoria;
    }

    return array;
}
