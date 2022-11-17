const { createApp } = Vue

createApp({
    data(){
        return{
            url: "https://amazing-events.herokuapp.com/api/events",
            eventos:[],

            eventosFuturos:[],
            eventosPasados:[],

            eventosFuturosCategoria:[],
            eventosPasadosCategoria:[],
            categorias:[],
            categoriasSeleccionadas:[],

            arrayCategoriasPasadas: [],
            arrayCategoriasFuturas: [],
            mayorAsistencia: [],
            menorAsistencia: [],
            mayorCapacidad: []
            
        }
    },
    created(){
        this.loadData()
        
    },
    mounted(){
        
    },
    methods: {
        loadData(){
        fetch(this.url).then(response => response.json())
            .then(data => {
                this.eventos = data.events
                this.eventosFuturos =  this.eventos.filter(evento => (evento.date >= data.currentDate) )
                this.eventosPasados = this.eventos.filter(evento => (evento.date < data.currentDate) )
               

                const fn = evento => evento.category
                this.eventosFuturosCategoria = Array.from(
                    new Set (this.eventosFuturos.map(fn)))

                this.eventosPasadosCategoria = Array.from(
                    new Set (this.eventosPasados.map(fn)))   

                    const asistencia = this.eventosAsistencia(this.eventosPasados);
                    const capacidad = this.eventosCapacidad(this.eventosPasados);
                    this.mayorAsistencia = asistencia[0];
                    this.menorAsistencia = asistencia[asistencia.length - 1];
                    this.mayorCapacidad = capacidad[0];
    
                    this.arrayCategoriasPasadas = this.gananciasPasadas(this.eventosPasadosCategoria, this.eventosPasados)
    
                    this.arrayCategoriasFuturas = this.gananciasFuturas(this.eventosFuturosCategoria, this.eventosFuturos)
            })
            .catch( exception => console.log(exception) )
        },

        eventosAsistencia(array) {
            return array.map(events => events).sort((b, a) => (((a.assistance * 100) / a.capacity) - ((b.assistance * 100) / b.capacity)))
        },
        eventosCapacidad(array) {
            return array.map(events => events).sort((b, a) => (a.capacity - b.capacity));
        },

        
        gananciasPasadas(categoria, evento){
            let array = []
            categoria.forEach(elemento => {
                const eventosIguales = evento.filter( evento => evento.category === elemento)            
                const ganancias = eventosIguales.map(evento => (evento.assistance * evento.price)).reduce((a, b)=> a + b)
    
                const asistencia = eventosIguales.map(evento => (evento.assistance * 100 ) / evento.capacity)
                const sumaAsistencia = asistencia.reduce((a, b) => a + b) / asistencia.length 
        
                const datos = {
                    nombre: elemento,
                    ganancia: ganancias,
                    porcentaje: sumaAsistencia.toFixed(2)

                }
                array.push(datos)
            });
            return array
        },
        gananciasFuturas( categoria, evento ){
            let array = []
            categoria.forEach(elemento => {

                const eventosIguales = evento.filter( evento => evento.category === elemento)
                
                const ganancias = eventosIguales.map(evento => (evento.estimate * evento.price)).reduce((a, b)=> a + b)
        
        
        
                const asistencia = eventosIguales.map(evento => (evento.estimate * 100 ) / evento.capacity)
                const sumaAsistencia = asistencia.reduce((a, b) => a + b) / asistencia.length 
        
                const datos = {
                    nombre: elemento,
                    ganancia: ganancias,
                    porcentaje: sumaAsistencia.toFixed(2)

                }
                array.push(datos)
            });
            return array
        },
        
    },

    
    computed: {
    }
}).mount('#app')
