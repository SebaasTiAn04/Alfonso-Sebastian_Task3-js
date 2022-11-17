
const { createApp } = Vue

createApp({
    data(){
        return{
            url: "https://amazing-events.herokuapp.com/api/events",
            eventos:[],
            categorias:[],
            categoriasSeleccionadas:[],
            backupEventos:[],
            inputFiltro:"",
            date:"",
            
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
                this.eventos = data.events.filter(tarjeta=> tarjeta.category)
                this.backupEventos = this.eventos
                this.date = data.currentDate
                this.categorias = this.eventos.map(evento => evento.category)
                this.categorias = new Set(this.eventos.map(evento => evento.category))
                this.categorias = Array.from(category)
                this.eventos.forEach(element => {
                    if(!this.categorias.includes(element.category)){
                        this.categorias.push(element.category)
                    }
                    
                });
            })
            .catch( exception => console.log(exception) )
        }
    },
    computed: {
        
        filtrar(){
            let primerFiltro = this.backupEventos.filter(evento => evento.name.toLowerCase().includes(this.inputFiltro.toLowerCase()))
            let segundoFiltro = primerFiltro.filter(evento1 => this.categoriasSeleccionadas.includes(evento1.category))
            if(segundoFiltro.length > 0){
                this.eventos = segundoFiltro
            }else{
                this.eventos = primerFiltro
            }
        }
    }
}).mount('#app')
