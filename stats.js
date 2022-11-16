const $main = document.querySelector("main");
const $containerTable = document.getElementById("contact")


let eventos = [];
let currentDate;
let eventosGananciasCalculadasFuturas = [];
let eventosGananciasCalculadasPasadas = [];
   
let fn;
let eventosFiltrados;
let evento;
let eventosSinRepetir;
let arrayEventosSinRepetir;

let eventosPasados = [];
let eventosFuturosPorCategoria = [];
let eventosPasadosPorCategoria = [];
let eventoConMasAssistencia;
let eventoConMasAforo;
let eventoConMenosAssistencia;
let fragment = new DocumentFragment;

function imprimirEventos(){
    let aux = document.createElement("table");
    aux.classList.add('col-12')
    aux.innerHTML = `<thead>
                            <tr>
                                <th colspan="3">Events statistics</th>
                            </tr>
                            </thead>
                             <tbody>
                             <tr>
                                 <td>Events with the highest percentage of attendance</td>
                                 <td>Event with larger capadity</td>
                                 <td>Events with the lowest percentage of attendace</td>
                            </tr>
                                            <tr>
                                                <td>${eventoConMasAssistencia.name}</td>
                                                <td>${eventoConMasAforo.name}</td>
                                                <td>${eventoConMenosAssistencia.name}</td>
                                            </tr>
                                        </tbody>`
    
                                    
    $containerTable.appendChild(aux);
}
    
function imprimirEventosFuturos(){
    let aux = document.createElement("table");
    aux.classList.add('col-12');
    aux.innerHTML =`  <thead>
                        <tr>
                            <th colspan="3">Upcoming events statistics by category</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Categories</th>
                            <th>Revenues</th>
                            <th>Percentage of attendance</th>
                    </tr>
                    </tbody>
                                    
                     `             
                     eventosFuturosPorCategoriasCalculadas.forEach(elemento => imiprimircategoriasFuturas(elemento)) 
                     
                     aux.appendChild(fragment);   
                    
                     
    $containerTable.appendChild(aux);
}

 
function imprimirEventosPasados(){
    let aux = document.createElement("table");
    aux.classList.add('col-12');
    aux.innerHTML =`  <thead>
                        <tr>
                            <th colspan="3">Past events statistics by category</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Categories</th>
                            <th>Revenues</th>
                            <th>Percentage of attendance</th>
                    </tr>
                    </tbody>
                                    
                     `             
                     eventosPasadosPorCategoriasCalculadas.forEach(elemento => imiprimircategoriasPasadas(elemento)) 
                     
                     aux.appendChild(fragment);   
                    
                     
    $containerTable.appendChild(aux);
}

function imiprimircategoriasPasadas(elemento){
    let aux = document.createElement("tr");
    aux.innerHTML = `
                      <td>${elemento.category}</td>       
                      <td>$  ${elemento.revenus}</td> 
                      <td>${Math.round(elemento.assistance*100/elemento.capacity)}%</td> 
                    ` 
   fragment.appendChild(aux);          
}



function imiprimircategoriasFuturas(elemento){
     let aux = document.createElement("tr");
     aux.innerHTML = `
                       <td>${elemento.category}</td>       
                       <td>$  ${elemento.revenus}</td> 
                       <td>${Math.round(elemento.estimate*100/elemento.capacity)}%</td> 
                     ` 
    
    fragment.appendChild(aux);          
}

function imiprimirIngresosFuturosPorCategoria(elemento){

    let aux = document.createElement("tr");
    aux.innerHTML = `
                      <td>${elemento}</td>       
                    ` 
   fragment.appendChild(aux);          
}

function calcularGanancias(evento){

    if(evento.estimate){
        eventosGananciasCalculadasFuturas.push(
            {
                category: evento.category,
                ganancia : evento.price * evento.estimate,
                capacidad: evento.capacity,
                date: evento.date,
                estimate: evento.estimate,
            }
            )
    }else{
        eventosGananciasCalculadasPasadas.push(
            {
                category: evento.category,
                ganancia : evento.price * evento.assistance,
                capacidad: evento.capacity,
                date: evento.date,
                assistance: evento.assistance,
            }
        )
    }
    
}

fetch("https://amazing-events.herokuapp.com/api/events")
    .then((response) => response.json())
    .then((json) => {
        datos = json;
        eventos = datos.events;
        currentDate = datos.currentDate;
        eventosPas(currentDate);

        //Primera columna
        eventoConMasAssistencia = eventoMaxAsistencia(eventosPasados);
        eventoConMasAforo = eventoMaxAforo(eventosPasados);
        eventoConMenosAssistencia = eventoMinAsistencia(eventosPasados);

        eventosFut(currentDate);
        console.log(categoriasPasados(currentDate));
        //segunda Columna
        
        //calcular ganancias
        eventos.forEach(evento => calcularGanancias(evento))
        calcularGananciasFuturas(eventosGananciasCalculadasFuturas);
        calcularGananciasPasadas(eventosGananciasCalculadasPasadas);
        
        //imprimir
        imprimirEventos();
        imprimirEventosFuturos();
        imprimirEventosPasados();
        
    }).catch((exception) => console.log(exception));
    
    let eventosFuturosPorCategoriasCalculadas = [];



    function calcularGananciasFuturas(array){
        eventosFuturosPorCategoria.map(evento => {
            eventosFuturosPorCategoriasCalculadas.push(
                {
                    category: evento,
                    revenus : array.filter(elemento => evento == elemento.category).map(e => e.ganancia).reduce((a,b) => a+=b),
                    estimate : array.filter(elemento => evento == elemento.category).map(e => e.estimate).reduce((a,b) => a+=b),
                    capacity : array.filter(elemento => evento == elemento.category).map(e => e.capacidad).reduce((a,b) => a+=b)
                }
            )
        })
    }
    
    let eventosPasadosPorCategoriasCalculadas = [];

    function calcularGananciasPasadas(array){
        eventosPasadosPorCategoria.map(evento => {
            eventosPasadosPorCategoriasCalculadas.push(
                {
                    category: evento,
                    revenus : array.filter(elemento => evento == elemento.category).map(e => e.ganancia).reduce((a,b) => a+=b),
                    assistance : array.filter(elemento => evento == elemento.category).map(e => e.assistance).reduce((a,b) => a+=b),
                    capacity : array.filter(elemento => evento == elemento.category).map(e => e.capacidad).reduce((a,b) => a+=b)
                }
            )
        })
    }

    function eventoMaxAsistencia(evenPast){
        let max = Number.MIN_SAFE_INTEGER;
        let cant;
        let even;
        for(evento of evenPast){
            
            cant = parseInt((evento.assistance/ evento.capacity)*100);
            if(cant > max){
                max = cant;
                even = evento;
            }
        }
        return even;
    }

    function eventoMinAsistencia(evenPast){
        let max = Number.MAX_SAFE_INTEGER;
        let cant;
        let even;
        for(evento of evenPast){
            
            cant = parseInt((evento.assistance/ evento.capacity)*100);
            if(cant < max){
                max = cant;
                even = evento;
            }
        }
        return even;
    }

    function eventoMaxAforo(evenPast){
        let max = Number.MIN_SAFE_INTEGER;
        let cant;
        let even;
        for(evento of evenPast){
            
            cant = parseInt(evento.capacity);
            if(cant > max){
                max = cant;
                even = evento;
            }
        }
        return even;
    }

    function eventosPas(Date){
        for(evento of eventos){
            if(evento.date < Date){
                eventosPasados.push(evento)
            }
        }
        return eventosPasados;
    }

    function eventosFut(Date){
        let eventosParaFiltrar = [];
        for(evento of eventos){
            if(evento.date > Date){
                eventosParaFiltrar.push(evento)
            }
        }
        fn = (eventosParaFiltrar) => eventosParaFiltrar.category;
        eventosFiltrados = eventosParaFiltrar.filter(fn);
        evento = eventosFiltrados.map(fn);
        eventosSinRepetir = new Set(evento);
        arrayEventosSinRepetir = Array.from(eventosSinRepetir);
        eventosFuturosPorCategoria = arrayEventosSinRepetir
        return eventosFuturosPorCategoria;
    }

    function categoriasPasados(Date){
        let eventosParaFiltrar = [];
        for(evento of eventos){
            if(evento.date < Date){
                eventosParaFiltrar.push(evento)
            }
        }
        fn = (eventosParaFiltrar) => eventosParaFiltrar.category;
        eventosFiltrados = eventosParaFiltrar.filter(fn);
        evento = eventosFiltrados.map(fn);
        eventosSinRepetir = new Set(evento);
        arrayEventosSinRepetir = Array.from(eventosSinRepetir);
        return eventosPasadosPorCategoria = arrayEventosSinRepetir;
    }
    
