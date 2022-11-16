const queryString = location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
let datos;
let eventos;
let evento;


fetch("https://amazing-events.herokuapp.com/api/events")
    .then((response) => response.json())
    .then((json) => {
        datos = json;
        eventos = datos.events;
        evento = eventos.find(e => e._id == id);
        imprimirCarta(evento);
    }).catch((exception) => console.log(exception)); 

    const div = document.querySelector(".container");
    function imprimirCarta(evento){
            
            div.innerHTML = `<div class="card" style="width: 50rem; ">
            <img src="${evento.image}" class="card-img-top" alt="imagen de ${evento.image}">
            <section class="card-body">
                <h5 class="card-title">${evento.name}</h5>
                <p class="card-text">${evento.description}</p>
                    
                <div class="d-flex">
                    <ul class="d-flex justify-content-between col-10">
                        <div>
                            <li>date: ${evento.date}</li>
                            <li>category: ${evento.category}</li>
                            <li>capacity: ${evento.capacity}</li>
                        </div>
                        <div>
                            <li>assistance: ${evento.assistance}</li>
                            <li>price: ${evento.price}$</li>
                            <li>place: ${evento.place}</li>
                        </div>
                    </ul>
                </div>
            </section>
        </div>`
    }
