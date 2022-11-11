
const $container = document.querySelector('.containerEvents')
const $check = document.getElementById('checkboxs')
const $buscador = document.getElementById('buscador')
const datos = eventos.events;
const currentDate = eventos.currentDate


const fn = (events) => events.category;

const eventosFiltrados = datos.filter(fn);
const evento = eventosFiltrados.map(fn);
const eventosSinRepetir = new Set(evento);
const arrayEventosSinRepetir = Array.from(eventosSinRepetir);

 
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

createCheckboxs(arrayEventosSinRepetir, $check);

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
        if(evento.date < currentDate)
           return fragment.appendChild(createCard(evento));
       } 
    );

    contenedor.appendChild(fragment);
}

imprimirEventos(eventosFiltrados, $container);


function eventCheck(){
    const checkedFiltrado = Array.from(document.querySelectorAll(" input[type='checkbox']:checked")).map(input => input.value)
    return checkedFiltrado;
}

$check.addEventListener('change', (event) =>{
   const checked = Array.from(document.querySelectorAll(" input[type='checkbox']:checked")).map(input => input.value)
    if(eventCheck().length === 0){
    $container.innerHTML = '<h2> Seleccione un evento </h2>'
    return
   } 
   const eventos = filtrarEventos(eventosFiltrados, eventCheck());
   eventos.length !== 0 ? imprimirEventos(eventos, $container)
   : $container.innerHTML = '<h2> no hay eventos </h2>';
})


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

$buscador.addEventListener("keyup", e=>{
     //filtro por titulo
     const eventosFiltrado = buscarTitulo(filtrarEventos(datos, eventCheck()))
     //filtro evento por categoria
/*      const eventosFiltrado = eventos.filter(buscarCategoria(eventos, eventCheck())) */
    if(eventosFiltrado.length != 0){
        imprimirEventos(eventosFiltrado, $container);
    }else{
        $container.innerHTML =  ` <h2 class="text-bg-danger col-12 text-center">NO HAY RESULTADO</h2> `
    }
     
})