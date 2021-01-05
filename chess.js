
/*Obtenemos todas las piezas en un array*/

const piezas = Array.from(document.getElementsByClassName("pieza"));
const negras = piezas.slice(0,16);
const blancas = piezas.slice(16,32);

const reynegro = document.getElementById("reynegro");
const reyblanco = document.getElementById("reyblanco");


/*variable que contiene que turno es*/

let turno = 1;

/*variables que contienen si se encuentra disponible o no el enroque*/

let enroqueNL = true;
let enroqueNC = true;
let enroqueBL = true;
let enroqueBC = true;

/*Hay jaque o no?*/

let negroenjaque = false;
let blancoenjaque = false;

/*En el evento de arrastrar de cada pieza guardamos el id de la pieza que esta siendo arrastrada */
for(let i = 0; i<32; i++){

    piezas[i].addEventListener("dragstart", e =>{

        e.dataTransfer.setData("text/plain", piezas[i].id);

    });

}

/*Obtenemos todos los recuadros en un array*/

const recuadros = Array.from(document.getElementsByClassName("recuadro"));


/*Obtenemos ambos popup para elegir que pieza cambiar*/

const popupNegro = document.getElementById("opnegras");
const popupBlanco = document.getElementById("opblancas");



/*metodo que te da los equivalentes de las letras pero en numeros,es mas facil calcular los movimientos asi
 de ser necesario, tiene disponible la posibiliad de hacer lo contrario
*/

function equivale(valor){
    
    switch(valor){

        case "a": 
            return 1;
        break;

        case "b": 
            return 2;
        break;

        case "c": 
            return 3;
        break;

        case "d": 
            return 4;
        break;

        case "e": 
            return 5;
        break;

        case "f": 
            return 6;
        break;

        case "g": 
            return 7;
        break;

        case "h": 
            return 8;
        break;

        case 1: 
            return "a";
        break;

        case 2: 
            return "b";
        break;

        case 3: 
            return "c";
        break;

        case 4: 
            return "d";
        break;

        case 5: 
            return "e";
        break;

        case 6: 
            return "f";
        break;

        case 7: 
            return "g";
        break;

        case 8: 
            return "h";
        break;

    }


}

/*Agregar eventos a los recuadros */

for(let i = 0; i<64; i++){

    recuadros[i].addEventListener("dragover", e =>{

        e.preventDefault();
        recuadros[i].classList.add("encima");

    });

    recuadros[i].addEventListener("dragleave", e =>{

        recuadros[i].classList.remove("encima");


    });

    //Evento al soltar una pieza sobre un recuadro, envia toda la informacion a la clase movimiento valido, si regresa true entonces permite el movimiento

    recuadros[i].addEventListener("drop", e =>{

        e.preventDefault();

        recuadros[i].classList.remove("encima");
        const destino = recuadros[i].classList[0];

        const idpieza = e.dataTransfer.getData("text/plain");
        const piezaarrastrada = document.getElementById(idpieza);
        const tipopieza = piezaarrastrada.classList[1];
        
        const origen = piezaarrastrada.parentNode.classList[0];


        if(movimientoValido(tipopieza, origen, destino) === true){

            recuadros[i].appendChild(piezaarrastrada);

            if(tipopieza === "peonnegro" || tipopieza === "peonblanco"){
                convertirPieza(destino, piezaarrastrada, tipopieza);
            }

            switch(idpieza){ //Si alguna de estas piezas se mueve ya no se puede enrocar

                case "torrenegra1":

                    enroqueNL = false;

                break;

                case "torrenegra2":

                    enroqueNC = false;

                break;

                case "torreblanca1":

                    enroqueBL = false;

                break;

                case "torreblanca2":

                    enroqueBC = false;

                break;

                case "reynegro":

                    enroqueNL = false;
                    enroqueNC = false;

                break;

                case "reyblanco":

                    enroqueBC = false;
                    enroqueBL = false;
                
                break;
            }


            turno++;

        }

    });
}

//Funcion que le dice al programa si esta permitido ese movimiento, llama a funciones especificas para cada tipo de pieza

function movimientoValido(tipopieza, origen, destino){
    
    if(turno%2 != 0){

        if(tipopieza === "peonblanco"){


            return movPeonBlanco(origen, destino);
    
        }

        if(tipopieza === "torreblanca"){


            return movTorre(origen, destino, "blanca");
    
        }

        if(tipopieza === "afilblanco"){


            return movAfil(origen, destino, "blanca");
    
        }

        if(tipopieza === "reinablanca"){


            return movReina(origen, destino, "blanca");
    
        }

        if(tipopieza === "caballoblanco"){


            return movCaballo(origen, destino, "blanca");
    
        }

        if(tipopieza === "reyblanco"){

            if(destino === "a1" && origen === "e1" || destino === "h1" && origen === "e1"){

                enrocar(destino,"blanco");

                return false;

            }

            return movRey(origen, destino, "blanca");
    
        }

    }else{

        if(tipopieza === "peonnegro"){

            return movPeonNegro(origen, destino);
    
        }

        if(tipopieza === "torrenegra"){


            return movTorre(origen, destino, "negra");
    
        }

        if(tipopieza === "afilnegro"){


            return movAfil(origen, destino, "negra");
    
        }

        if(tipopieza === "reinanegra"){


            return movReina(origen, destino, "negra");
    
        }

        if(tipopieza === "caballonegro"){


            return movCaballo(origen, destino, "negra");
    
        }

        if(tipopieza === "reynegro"){

            if(destino === "a8" && origen === "e8" || destino === "h8" && origen === "e8"){

                enrocar(destino,"negro");

                return false;

            }

            return movRey(origen, destino, "negra");
    
        }
    }

}

//Funcion que devuelve true or false dependiendo si esta vacio un recuadro

function estaVacio(recuadro){ 
    return document.getElementsByClassName(recuadro)[0].firstElementChild === null
}

//Funcion que devuelve true or false dependiendo si se puede comer la pieza

function sePuedeComer(color, recuadro){ 

    let respuesta = document.getElementsByClassName(recuadro)[0].firstElementChild.classList[2] != color;


    if (respuesta === true){
        comer(recuadro);
        return true;
    }else{

        return false;

    }
}

//Funcion que saca una pieza ya comida del tablero

function comer(posicion){

    const lugar = document.getElementsByClassName(posicion)[0];
    const victima = lugar.firstElementChild;
    lugar.removeChild(victima);

}


//Funcion que recorre la ruta norte, es decir cuando una pieza va de abajo hacia arriba.
//Devuelve true o false dependiendo si el movimiento coincide.

function rutaNorte(origen,destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    if(letrao != letrad){

        return false;

    }else{

        //Revisamos cada casilla

        let indice = numeroo;

        while(indice < numerod){

            indice++;

            //si la casilla a revisar no esta vacia

            if(!estaVacio(letrao+indice)){

                switch(indice){

                    //si la  casilla coincide con la casilla de destino, se pasa a comerla de ser posible
                    //en caso de que encuentre en el camino a su destino una pieza atravesada, no podra hacer el movimiento
                    case numerod:

                        return sePuedeComer(color,destino);

                    break;

                    default:

                        return false;

                }
            }else{
                //si se llega al destino sin obstaculos y no hay que comer ninguna pieza
                if(indice === numerod){

                    return true;

                }
            }
        }
    }
}

//Funcion que recorre la ruta sur, es decir cuando una pieza va de arriba hacia abajo.
//Devuelve true o false dependiendo si el movimiento coincide.

function rutaSur(origen,destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    if(letrao != letrad){

        return false;

    }else{

        //Revisamos cada casilla

        let indice = numeroo;

        while(indice > numerod){

            indice--;

            //si la casilla a revisar no esta vacia

            if(!estaVacio(letrao+indice)){

                switch(indice){

                    //si la  casilla coincide con la casilla de destino, se pasa a comerla de ser posible
                    //en caso de que encuentre en el camino a su destino una pieza atravesada, no podra hacer el movimiento
                    case numerod:

                        return sePuedeComer(color,destino);

                    break;

                    default:

                        return false;

                }
            }else{
                //si se llega al destino sin obstaculos y no hay que comer ninguna pieza
                if(indice === numerod){

                    return true;

                }
            }
        }
    }
}

//Funcion que recorre la ruta este, es decir cuando una pieza va de izquierda a derecha.
//Devuelve true o false dependiendo si el movimiento coincide.

function rutaEste(origen,destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    if(numeroo != numerod){

        return false;

    }else{

        let indice = equivale(letrao);

        //Revisamos cada casilla

        while(indice < equivale(letrad)){

            indice++;

            //si la casilla a revisar no esta vacia
            if(!estaVacio(equivale(indice)+numeroo)){

                switch(indice){

                    //si la  casilla coincide con la casilla de destino, se pasa a comerla de ser posible
                    //en caso de que encuentre en el camino a su destino una pieza atravesada, no podra hacer el movimiento
                    case equivale(letrad):

                        return sePuedeComer(color,destino);

                    break;

                    default:

                        return false;

                }
            }else{
                //si se llega al destino sin obstaculos y no hay que comer ninguna pieza
                if(indice === equivale(letrad)){

                    return true;

                }
            }
        }
    }
}

//Funcion que recorre la ruta oeste, es decir cuando una pieza va de derecha a izquierda.
//Devuelve true o false dependiendo si el movimiento coincide.

function rutaOeste(origen,destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    if(numeroo != numerod){

        return false;

    }else{

        let indice = equivale(letrao);

        //Revisamos cada casilla

        while(indice > equivale(letrad)){

            indice--;

            //si la casilla a revisar no esta vacia

            if(!estaVacio(equivale(indice)+numeroo)){

                switch(indice){

                    //si la  casilla coincide con la casilla de destino, se pasa a comerla de ser posible
                    //en caso de que encuentre en el camino a su destino una pieza atravesada, no podra hacer el movimiento
                    case equivale(letrad):

                        return sePuedeComer(color,destino);

                    break;

                    default:

                        return false;

                }
            }else{
                //si se llega al destino sin obstaculos y no hay que comer ninguna pieza
                if(indice === equivale(letrad)){

                    return true;

                }
            }
        }
    }
}


//Función que recorre la ruta en diagonal al noreste, devuelve si el movimiento cumple esa ruta.
//Es usada por la funcion movAfil y movReina.

function rutaNoreste(origen, destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //Si la ruta es hacia el noreste, entonces la letra y el num deben haber aumentado en la misma proporción.
    //Se va a ir recorriendo cada casilla, si hay alguna pieza, se revisa si es igual al destino.
    //Si es el destino, se revisa si se puede comer la pieza. Si no lo es, quiere decir que esta intentando saltarse una pieza y devuelve false.

    let indiceLetra = equivale(letrao);
    let indiceNum = numeroo;

    while(indiceLetra < equivale(letrad) && indiceNum < numerod){

        indiceLetra++;
        indiceNum++;


        if(!estaVacio(equivale(indiceLetra)+indiceNum)){

            switch(equivale(indiceLetra)+indiceNum){

                case destino:

                return sePuedeComer(color,destino);

                break;

                default:

                return false;

            }

        }


    }

    if(equivale(indiceLetra)+indiceNum === destino){

        return true;

    }else{


        return false;

    }

}

//Función que recorre la ruta en diagonal al sureste, devuelve si el movimiento cumple esa ruta.
//Es usada por la funcion movAfil y movReina.

function rutaSureste(origen, destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //Si la ruta es hacia el sureste, entonces la letra debe haber aumentado y el numero disminuido en la misma proporción.
    //Se va a ir recorriendo cada casilla, si hay alguna pieza, se revisa si es igual al destino.
    //Si es el destino, se revisa si se puede comer la pieza. Si no lo es, quiere decir que esta intentando saltarse una pieza y devuelve false.

    let indiceLetra = equivale(letrao);
    let indiceNum = numeroo;

    while(indiceLetra < equivale(letrad) && indiceNum > numerod){

        indiceLetra++;
        indiceNum--;

        if(!estaVacio(equivale(indiceLetra)+indiceNum)){

            switch(equivale(indiceLetra)+indiceNum){

                case destino:

                return sePuedeComer(color,destino);

                break;

                default:

                return false;

            }
        }
    }

    if(equivale(indiceLetra)+indiceNum === destino){

        return true;

    }else{

        return false;

    }
}


//Función que recorre la ruta en diagonal al noroeste, devuelve si el movimiento cumple esa ruta.
//Es usada por la funcion movAfil y movReina.

function rutaNoroeste(origen, destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //Si la ruta es hacia el noroeste, entonces la letra debe haber disminuido y el numero aumentado en la misma proporción.
    //Se va a ir recorriendo cada casilla, si hay alguna pieza, se revisa si es igual al destino.
    //Si es el destino, se revisa si se puede comer la pieza. Si no lo es, quiere decir que esta intentando saltarse una pieza y devuelve false.

    let indiceLetra = equivale(letrao);
    let indiceNum = numeroo;

    while(indiceLetra > equivale(letrad) && indiceNum < numerod){

        indiceLetra--;
        indiceNum++;

        if(!estaVacio(equivale(indiceLetra)+indiceNum)){

            switch(equivale(indiceLetra)+indiceNum){

                case destino:

                return sePuedeComer(color,destino);

                break;

                default:

                return false;

            }

        }


    }

    if(equivale(indiceLetra)+indiceNum === destino){

        return true;

    }else{


        return false;

    }

}

//Función que recorre la ruta en diagonal al suroeste, devuelve si el movimiento cumple esa ruta.
//Es usada por la funcion movAfil y movReina.

function rutaSuroeste(origen, destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //Si la ruta es hacia el sureste, entonces la letra  y el numero deben haber disminuido en la misma proporción.
    //Se va a ir recorriendo cada casilla, si hay alguna pieza, se revisa si es igual al destino.
    //Si es el destino, se revisa si se puede comer la pieza. Si no lo es, quiere decir que esta intentando saltarse una pieza y devuelve false.

    let indiceLetra = equivale(letrao);
    let indiceNum = numeroo;

    while(indiceLetra > equivale(letrad) && indiceNum > numerod){

        indiceLetra--;
        indiceNum--;

        if(!estaVacio(equivale(indiceLetra)+indiceNum)){

            switch(equivale(indiceLetra)+indiceNum){

                case destino:

                return sePuedeComer(color,destino);

                break;

                default:

                return false;

            }

        }


    }

    if(equivale(indiceLetra)+indiceNum === destino){

        return true;

    }else{


        return false;

    }

}

//Funcion que calcula los movimientos posibles de una torre y devuelve verdadero o falso si coincide con lo que se intenta hacer

function movTorre(origen,destino,color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //Llamamos a las diferentes funciones que revisan posibles rutas 

        switch(true){

            case rutaNorte(origen,destino,color):
                return true;
            break;

            case rutaSur(origen,destino,color):
                return true;
            break;

            case rutaEste(origen,destino,color):
                return true;
            break;

            case rutaOeste(origen,destino,color):
                return true;
            break;

            default:
                return false;
        }

}

//Funcion que revisa los movimientos posibles de un afil devuelve si coincide con lo que se intenta hacer

function movAfil(origen, destino, color){

    //Si no se mueve en lineas diagonales, no es válido
    //Llamamos a las diferentes funciones que revisan posibles rutas 

    switch(true){

        case rutaNoreste(origen,destino,color):
            return true;
        break;

        case rutaSureste(origen,destino,color):
            return true;
        break;

        case rutaNoroeste(origen,destino,color):
            return true;
        break;

        case rutaSuroeste(origen,destino,color):
            return true;
        break;

        default:
            return false;
    }

}

//Funcion que revisa los movimientos posibles de una reina devuelve si coincide con lo que se intenta hacer

function movReina(origen, destino, color){

    //Si no se mueve en lineas rectas, no es válido
    //Llamamos a las diferentes funciones que revisan posibles rutas 

    switch(true){

        case rutaNoreste(origen,destino,color):
            return true;
        break;

        case rutaSureste(origen,destino,color):
            return true;
        break;

        case rutaNoroeste(origen,destino,color):
            return true;
        break;

        case rutaSuroeste(origen,destino,color):
            return true;
        break;

        case rutaNorte(origen,destino,color):
            return true;
        break;

        case rutaSur(origen,destino,color):
            return true;
        break;

        case rutaEste(origen,destino,color):
            return true;
        break;

        case rutaOeste(origen,destino,color):
            return true;
        break;

        default:
            return false;
    }

}


//Funcion que calcula los movimientos posibles del peon negro y devuelve si coincide con lo que se intenta hacer

function movPeonNegro(origen, destino){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //el numero de destino para un peon negro debe ser siempre menor

    if(numerod>=numeroo){

        return false

    }else{ //si el numero es menor, pasamos a ver los 4 posibles movimientos

        //cuando se hace un movimiento simple hacia adelante

        if(letrao === letrad && numerod === numeroo - 1){

            return estaVacio(destino);        

        }

        //cuando se hace un movimiento doble hacia adelante como primer movimiento del peon

        if(numeroo === 7 && letrao === letrad && numerod === numeroo - 2){

            return estaVacio(destino);        

        }

        //cuando se va a comer una pieza

        if(equivale(letrad) === equivale(letrao)-1  || equivale(letrad) === equivale(letrao)+1 ){

            if (estaVacio(destino) === false){

                return sePuedeComer("negra", destino);

            }        

        }

    }

}

//funcion que calcula los movimientos posibles del peon blanco y devuelve si coincide con lo que se intenta hacer

function movPeonBlanco(origen, destino){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //el numero de destino para un peon blanco debe ser siempre mayor

    if(numerod<=numeroo){

        return false

    }else{ //si el numero es mayor, pasamos a ver los 4 posibles movimientos

        //cuando se hace un movimiento simple hacia adelante

        if(letrao === letrad && numerod === numeroo + 1){

            return estaVacio(destino);        

        }

        //cuando se hace un movimiento doble hacia adelante como primer movimiento del peon

        if(numeroo === 2 && letrao === letrad && numerod === numeroo + 2){

            return estaVacio(destino);        

        }

        //cuando se va a comer una pieza

        if(equivale(letrad) === equivale(letrao)+1  || equivale(letrad) === equivale(letrao)-1 ){

            if (estaVacio(destino) === false){

                return sePuedeComer("blanca", destino);

            }        

        }

    }

}

//funcion que calcula los movimientos posibles del caballo y devuelve si coincide con lo que se intenta hacer

function movCaballo(origen, destino, color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //Calculamos el valor absoluto de la distancia en Y y en X

    let difY = numerod - numeroo;
    if(difY<0){ difY=difY*-1}

    let difX = equivale(letrad) - equivale(letrao);
    if(difX<0){ difX=difX*-1}

    let suma = difX + difY;

    if(suma === 3 && difX != 0 && difX != 3){

        if(estaVacio(destino)){

            return true;

        } else{

            return sePuedeComer(color,destino);

        }
        
    }else{

        return false;

    }

}

//funcion que calcula los movimientos posibles del rey y devuelve si coincide con lo que se intenta hacer

function movRey(origen, destino, color){

    //obtenemos las letras y numeros de las posiciones por separado

    const letrao = origen.charAt(0);
    const numeroo = Number(origen.charAt(1));
    const letrad = destino.charAt(0);
    const numerod = Number(destino.charAt(1));

    //Calculamos el valor absoluto de la distancia en Y y en X

    let difY = numerod - numeroo;
    if(difY<0){ difY=difY*-1}

    let difX = equivale(letrad) - equivale(letrao);
    if(difX<0){ difX=difX*-1}

    let suma = difX + difY;

    if(difX > 1 || difY > 1){

        return false

    }else{

        if(amenaza(destino,color)){

            return false;

        }else{

            if(estaVacio(destino)){

                return true;
    
            }else{
    
                return sePuedeComer(color,destino);
    
            }
            
        }

    }

}

//funcion que activa el popup para elegir la pieza para cambiar por un peon. Activa ademas los eventos necesarios.

function convertirPieza(destino, peon, tipopieza){

    if(tipopieza === "peonnegro"){
        if(destino.charAt(1) === "1"){

            popupNegro.style.display = "flex";

            /*Paso los parametros colocandolos como propiedades del elemento*/

            eligetn.pieza = peon;
            eligetn.tipo = "torrenegra";
            eligetn.addEventListener("click",cambiarPieza);

            eligean.pieza = peon;
            eligean.tipo = "afilnegro";
            eligean.addEventListener("click",cambiarPieza);

            eligecn.pieza = peon;
            eligecn.tipo = "caballonegro";
            eligecn.addEventListener("click",cambiarPieza);

            eligern.pieza = peon;
            eligern.tipo = "reinanegra";
            eligern.addEventListener("click",cambiarPieza);

        }
    }

    if(tipopieza === "peonblanco"){
        if(destino.charAt(1) === "8"){

            popupBlanco.style.display = "flex";

            /*Paso los parametros colocandolos como propiedades del elemento*/


            eligetb.pieza = peon;
            eligetb.tipo = "torreblanca";
            eligetb.addEventListener("click",cambiarPieza);

            eligeab.pieza = peon;
            eligeab.tipo = "afilblanco";
            eligeab.addEventListener("click",cambiarPieza);

            eligecb.pieza = peon;
            eligecb.tipo = "caballoblanco";
            eligecb.addEventListener("click",cambiarPieza);

            eligerb.pieza = peon;
            eligerb.tipo = "reinablanca";
            eligerb.addEventListener("click",cambiarPieza);

        }
    }

}

//Quita los eventos de los botones para elegir una pieza para reemplazar a un peon negro

function quitarEventosNegro(){

    eligetn.removeEventListener("click",cambiarPieza);
    eligean.removeEventListener("click",cambiarPieza);
    eligecn.removeEventListener("click",cambiarPieza);
    eligern.removeEventListener("click",cambiarPieza);

}

//Quita los eventos de los botones para elegir una pieza para reemplazar a un peon blanco

function quitarEventosBlanco(){

    eligetb.removeEventListener("click",cambiarPieza);
    eligeab.removeEventListener("click",cambiarPieza);
    eligecb.removeEventListener("click",cambiarPieza);
    eligerb.removeEventListener("click",cambiarPieza);

}

//Cambia el peon a la pieza seleccionada a traves el evento. Tiene parametros que recibe a traves de propiedades
//del target del evento.

function cambiarPieza(e){

    let peon = e.currentTarget.pieza;
    let tipopieza = e.currentTarget.tipo;

    if(tipopieza === "torrenegra" || tipopieza === "afilnegro" || tipopieza === "caballonegro" || tipopieza === "reinanegra"){

        peon.src = `imagenes/${tipopieza}.svg`;
        peon.classList.remove("peonnegro","negra");
        peon.classList.add(tipopieza,"negra");
        quitarEventosNegro();
        popupNegro.style.display = "none";

    }

    if(tipopieza === "torreblanca" || tipopieza === "afilblanco" || tipopieza === "caballoblanco" || tipopieza === "reinablanca"){

        peon.src = `imagenes/${tipopieza}.svg`;
        peon.classList.remove("peonblanco","blanca");
        peon.classList.add(tipopieza,"blanca");
        quitarEventosBlanco();
        popupBlanco.style.display = "none";

    }
    
}

//Funcion que recibe un recuadro y en base a eso devuelve si esta amenazado o no por un peon negro.

function amenazaPeonNegro(recuadro){

    const letra = recuadro.charAt(0);
    const numero = Number(recuadro.charAt(1));

    //si el recuadro esta en la linea 8 entonces es imposible que se vea amenzado por un peon negro

    if(numero === 8){

        return false;

    }else{

        if(letra != 'h'){

            let b = numero + 1;
            b = equivale(equivale(letra)+1) + b;

            if(document.getElementsByClassName(b)[0].firstChild != null){
    
                if(document.getElementsByClassName(b)[0].firstChild.classList[1] === "peonnegro"){
                

                    return true;

    
                }
            
            }    

        }

        if(letra != 'a'){

            let a = numero + 1;
            a = equivale(equivale(letra)-1) + a;

            if(document.getElementsByClassName(a)[0].firstChild != null){
    
                if(document.getElementsByClassName(a)[0].firstChild.classList[1] === "peonnegro"){
    
                    return true;
    
                }

            } 
    
        }


        return false;

    }
 
}

//Funcion que recibe un recuadro y en base a eso devuelve si esta amenazado o no por un peon blanco.

function amenazaPeonBlanco(recuadro){

    const letra = recuadro.charAt(0);
    const numero = Number(recuadro.charAt(1));

    //si el recuadro esta en la linea 1 entonces es imposible que se vea amenzado por un peon blanco.

    if(numero === 1){

        return false;

    }else{

        if(letra != 'h'){

            let b = numero - 1;
            b = equivale(equivale(letra)+1) + b;

            if(document.getElementsByClassName(b)[0].firstChild != null){
    
                if(document.getElementsByClassName(b)[0].firstChild.classList[1] === "peonblanco"){
                
                    return true;
    
                }
            
            }    

        }

        if(letra != 'a'){

            let a = numero - 1;
            a = equivale(equivale(letra)-1) + a;

            if(document.getElementsByClassName(a)[0].firstChild != null){
    
                if(document.getElementsByClassName(a)[0].firstChild.classList[1] === "peonblanco"){
    
                    return true;
    
                }

            } 
    
        }

        return false;

    }
 
}

//Recibe un recuadro y devuelve un array de arrays que contienen las piezas que se encuentran en las 4 direcciones horizontal + vertical

function amenazaTorre(recuadro){

   //obtenemos las letras y numeros del recuadro por separado

   const letra = recuadro.charAt(0);
   const numero = Number(recuadro.charAt(1));

   //Con los ciclos while vamos obteniendo arrays de las piezas que estan en las 4 direcciones.

   let arriba = [];
   let abajo = [];
   let derecha = [];
   let izquierda = [];

   let indiceY = numero;
   let indiceX = equivale(letra);

   while(indiceY < 8){

       indiceY++;

       //si la casilla a revisar no esta vacia
       if(!estaVacio(letra+indiceY)){

           arriba.push(document.getElementsByClassName(letra+indiceY)[0].firstChild.classList[1]);

       }
   }

   indiceY = numero;

   while(indiceY > 1){

       indiceY--;

       //si la casilla a revisar no esta vacia
       if(!estaVacio(letra+indiceY)){

           abajo.push(document.getElementsByClassName(letra+indiceY)[0].firstChild.classList[1]);

       }
   }

   while(indiceX < 8){

       indiceX++;

       //si la casilla a revisar no esta vacia
       if(!estaVacio(equivale(indiceX)+numero)){

           derecha.push(document.getElementsByClassName(equivale(indiceX)+numero)[0].firstChild.classList[1]);

       }
   }

   indiceX = equivale(letra);

   while(indiceX > 1){

       indiceX--;

       //si la casilla a revisar no esta vacia
       if(!estaVacio(equivale(indiceX)+numero)){

           izquierda.push(document.getElementsByClassName(equivale(indiceX)+numero)[0].firstChild.classList[1]);

       }
   }

   return [arriba,abajo,derecha,izquierda];

}

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por una torre negra o una reina negra

function amenazaTorreNegra(recuadro){

    let direcciones = amenazaTorre(recuadro);
 
    //si el primer elemento en el camino es una reinanegra o una torrenegra, entonces si hay amenaza

    if(direcciones[0][0] === "reinanegra" || direcciones[1][0] === "reinanegra" || direcciones[2][0] === "reinanegra" || direcciones[3][0] === "reinanegra"){

        return true;

    }

    if(direcciones[0][0] === "torrenegra" || direcciones[1][0] === "torrenegra" || direcciones[2][0] === "torrenegra" || direcciones[3][0] === "torrenegra"){

        return true;

    }

    return false;


}

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por una torre blanca o una reina blanca

function amenazaTorreBlanca(recuadro){

    let direcciones = amenazaTorre(recuadro);

 
    //si el primer elemento en el camino es una reinablanca o una torreblanca, entonces si hay amenaza

    if(direcciones[0][0] === "reinablanca" || direcciones[1][0] === "reinablanca" || direcciones[2][0] === "reinablanca" || direcciones[3][0] === "reinablanca"){

        return true;

    }

    if(direcciones[0][0] === "torreblanca" || direcciones[1][0] === "torreblanca" || direcciones[2][0] === "torreblanca" || direcciones[3][0] === "torreblanca"){

        return true;

    }

    return false;

}

//Recibe un recuadro y devuelve un array de arrays que contienen las piezas que se encuentran en las 4 direcciones diagonales

function amenazaAfil(recuadro){

    //obtenemos las letras y numeros del recuadro por separado
 
    const letra = recuadro.charAt(0);
    const numero = Number(recuadro.charAt(1));
 
    //Con los ciclos while vamos obteniendo arrays de las piezas que estan en las 4 direcciones.
 
    let noreste = [];
    let sureste = [];
    let noroeste = [];
    let suroeste = [];
 
    let indiceY = numero;
    let indiceX = equivale(letra);
 
    while(indiceY < 8 && indiceX < 8){
 
        indiceY++;
        indiceX++;
 
        //si la casilla a revisar no esta vacia
        if(!estaVacio(equivale(indiceX)+indiceY)){
 
            noreste.push(document.getElementsByClassName(equivale(indiceX)+indiceY)[0].firstChild.classList[1]);
 
        }
    }
 
    indiceY = numero;
    indiceX = equivale(letra);
 
    while(indiceY > 1 && indiceX < 8){
 
        indiceY--;
        indiceX++;
 
        //si la casilla a revisar no esta vacia
        if(!estaVacio(equivale(indiceX)+indiceY)){
 
            sureste.push(document.getElementsByClassName(equivale(indiceX)+indiceY)[0].firstChild.classList[1]);
 
        }
    }
 
    indiceY = numero;
    indiceX = equivale(letra);
 
    while(indiceY > 1 && indiceX > 1){
 
        indiceY--;
        indiceX--;
 
        //si la casilla a revisar no esta vacia
        if(!estaVacio(equivale(indiceX)+indiceY)){
 
            suroeste.push(document.getElementsByClassName(equivale(indiceX)+indiceY)[0].firstChild.classList[1]);
 
        }
    }
 
    indiceY = numero;
    indiceX = equivale(letra);
 
    while(indiceY < 8 && indiceX > 1){
 
        indiceY++;
        indiceX--;
 
        //si la casilla a revisar no esta vacia
        if(!estaVacio(equivale(indiceX)+indiceY)){
 
            noroeste.push(document.getElementsByClassName(equivale(indiceX)+indiceY)[0].firstChild.classList[1]);
 
        }
    }
 
    return [noreste,sureste,suroeste,noroeste];
 
 }

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por un afilblanco o una reinablanca

function amenazaAfilBlanco(recuadro){

    let direcciones = amenazaAfil(recuadro);
 
    //si el primer elemento en el camino es una reinablanca o una afilblanco, entonces si hay amenaza

    if(direcciones[0][0] === "reinablanca" || direcciones[1][0] === "reinablanca" || direcciones[2][0] === "reinablanca" || direcciones[3][0] === "reinablanca"){

        return true;

    }

    if(direcciones[0][0] === "afilblanco" || direcciones[1][0] === "afilblanco" || direcciones[2][0] === "afilblanco" || direcciones[3][0] === "afilblanco"){

        return true;

    }

    return false;

}

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por un afilblanco o una reinablanca

function amenazaAfilNegro(recuadro){

    let direcciones = amenazaAfil(recuadro);

    //si el primer elemento en el camino es una reinablanca o una afilblanco, entonces si hay amenaza

    if(direcciones[0][0] === "reinanegra" || direcciones[1][0] === "reinanegra" || direcciones[2][0] === "reinanegra" || direcciones[3][0] === "reinanegra"){

        return true;

    }

    if(direcciones[0][0] === "afilnegro" || direcciones[1][0] === "afilnegro" || direcciones[2][0] === "afilnegro" || direcciones[3][0] === "afilnegro"){

        return true;

    }

    return false;

}

//obtiene todas las posiciones desde las cuales un caballo podria alcanzar dicho recuadro

function amenazaCaballo(recuadro){

    //obtenemos las letras y numeros del recuadro por separado
 
    const letra = recuadro.charAt(0);
    const numero = Number(recuadro.charAt(1));
 
    let posiciones = [];
    let posicion = "";

    let x = "0";
    let y = 0;

    if(equivale(letra) < 7){

        if(numero < 8){

            x = equivale(equivale(letra) + 2);
            y = numero + 1;

            posicion = x + y;

            posiciones.push(posicion)

        }

        if(numero > 1){

            x = equivale(equivale(letra) + 2);
            y = numero - 1;

            posicion = x + y;

            posiciones.push(posicion)

        }

    }

    if(equivale(letra) < 8){

        if(numero < 7){

            x = equivale(equivale(letra) + 1);
            y = numero + 2;

            posicion = x + y;

            posiciones.push(posicion)

        }

        if(numero > 2){

            x = equivale(equivale(letra) + 1);
            y = numero - 2;

            posicion = x + y;

            posiciones.push(posicion)

        }

    }

    if(equivale(letra) > 2){

        if(numero < 8){

            x = equivale(equivale(letra) - 2);
            y = numero + 1;

            posicion = x + y;

            posiciones.push(posicion)

        }

        if(numero > 1){

            x = equivale(equivale(letra) - 2);
            y = numero - 1;

            posicion = x + y;

            posiciones.push(posicion)

        }

    }

    if(equivale(letra) > 1){

        if(numero < 7){

            x = equivale(equivale(letra) - 1);
            y = numero + 2;

            posicion = x + y;

            posiciones.push(posicion)

        }

        if(numero > 2){

            x = equivale(equivale(letra) - 1);
            y = numero - 2;

            posicion = x + y;

            posiciones.push(posicion)

        }

    }

    return posiciones;

}

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por un caballoblanco

function amenazaCaballoBlanco(recuadro){

    let direcciones = amenazaCaballo(recuadro);

    //si en algunas de las posiciones del array se encuentra un caballo blanco, hay peligro

    for (let index = 0; index < direcciones.length; index++) {

        if(document.getElementsByClassName(direcciones[index])[0].firstChild != null){

            if(document.getElementsByClassName(direcciones[index])[0].firstChild.classList[1] === "caballoblanco"){

                return true;

            }

        }
        
    }

    return false;

}

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por un caballonegro

function amenazaCaballoNegro(recuadro){

    let direcciones = amenazaCaballo(recuadro);

    //si en algunas de las posiciones del array se encuentra un caballo blanco, hay peligro

    for (let index = 0; index < direcciones.length; index++) {

        if(document.getElementsByClassName(direcciones[index])[0].firstChild != null){

            if(document.getElementsByClassName(direcciones[index])[0].firstChild.classList[1] === "caballonegro"){

                return true;

            }

        }
        
    }

    return false;

}

//Devuelve todos los recuadros que se encuentran al lado de un recuadro dado

function vecinos(recuadro){

    //obtenemos las letras y numeros del recuadro por separado
 
    const letra = recuadro.charAt(0);
    const numero = Number(recuadro.charAt(1));
 
    let posiciones = [];
    let posicion = "";

    let x = "0";
    let y = 0;

    x = equivale(equivale(letra) + 1);
    y = numero + 1;

    if(document.getElementsByClassName(x+numero)[0] != undefined){

        posicion = x + numero;
        posiciones.push(posicion);

    }

    if(document.getElementsByClassName(letra+y)[0] != undefined){

        posicion = letra + y;
        posiciones.push(posicion);

    }  

    if(document.getElementsByClassName(x+y)[0] != undefined){

        posicion = x + y;
        posiciones.push(posicion);

    }

    y = numero - 1;

    if(document.getElementsByClassName(x+y)[0] != undefined){

        posicion = x + y;
        posiciones.push(posicion);

    }  

    if(document.getElementsByClassName(letra+y)[0] != undefined){

        posicion = letra + y;
        posiciones.push(posicion);

    }  

    x = equivale(equivale(letra) - 1);

    if(document.getElementsByClassName(x+y)[0] != undefined){

        posicion = x + y;
        posiciones.push(posicion);

    }  

    if(document.getElementsByClassName(x+numero)[0] != undefined){

        posicion = x + numero;
        posiciones.push(posicion);

    } 
    
    y = numero + 1;

    if(document.getElementsByClassName(x+y)[0] != undefined){

        posicion = x + y;
        posiciones.push(posicion);

    }   

    return posiciones;

}

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por un reynegro

function amenazaReyNegro(recuadro){

    const adyacentes = vecinos(recuadro);

    for (let index = 0; index < adyacentes.length; index++) {
        
        if(!estaVacio(adyacentes[index])){

            if(document.getElementsByClassName(adyacentes[index])[0].firstChild.classList[1] === "reynegro"){

            return true

            }

        }
        
    }

    return false
}

//Funcion que recibe un recuadro, y devuelve si este se encuentra amenzado o no por un reyblanco

function amenazaReyBlanco(recuadro){

    const adyacentes = vecinos(recuadro);

    for (let index = 0; index < adyacentes.length; index++) {
        
        if(!estaVacio(adyacentes[index])){

            if(document.getElementsByClassName(adyacentes[index])[0].firstChild.classList[1] === "reyblanco"){

            return true

            }

        }
        
    }

    return false
}

//Funcion que recibe un recuadro y color de la pieza, devuelve si hay alguna amenaza

function amenaza(recuadro, color){

    if(color === "blanca"){

        switch(true){

            case amenazaTorreNegra(recuadro):

                return true;

            break;

            case amenazaAfilNegro(recuadro):

                return true;

            break;

            case amenazaCaballoNegro(recuadro):

                return true;

            break;

            case amenazaPeonNegro(recuadro):

                return true;

            break;

            case amenazaReyNegro(recuadro):

                return true;

            break;

        }

    }

    if(color === "negra"){

        switch(true){

            case amenazaTorreBlanca(recuadro):

                return true;

            break;

            case amenazaAfilBlanco(recuadro):

                return true;

            break;

            case amenazaCaballoBlanco(recuadro):

                return true;

            break;

            case amenazaPeonBlanco(recuadro):

                return true;

            break;

            case amenazaReyBlanco(recuadro):

                return true;

            break;

        }

    }

    return false;

}

/*Permite saber si es posible enrocar al rey, sin embargo de momento no la he usado*/

function enrocable(color){

    let izq = true;
    let der = true;

    if(color === "negro"){

        switch(false){

            case estaVacio("b8"):

                izq = false;

            break;

            case estaVacio("c8"):
                
                izq = false;

            break;

            case estaVacio("d8"):

                izq = false;

            break;

            default:

                if(enroqueNL){

                    izq = true;

                }
        }

        switch(false){

            case estaVacio("g8"):
                
                der = false;

            break;

            case estaVacio("f8"):

                der = false;

            break;

            default:

                if(enroqueNC){

                    der = true;

                }
        }


        if(document.getElementsByClassName("a8")[0].firstChild.classList[1] === "torrenegra" && izq === true){

            return true;

        }

        if(document.getElementsByClassName("h8")[0].firstChild.classList[1] === "torrenegra" && der === true){

            return true;

        }

        return false;

    }

    if(color === "blanco"){

        switch(false){

            case estaVacio("b1"):

                izq = false;

            break;

            case estaVacio("c1"):
                
                izq = false;

            break;

            case estaVacio("d1"):

                izq = false;

            break;

            default:

                if(enroqueBL){

                    izq = true;

                }
        }

        switch(false){

            case estaVacio("g1"):
                
                der = false;

            break;

            case estaVacio("f1"):

                der = false;

            break;

            default:

                if(enroqueBC){

                    der = true;

                }
        }

        if(document.getElementsByClassName("a1")[0].firstChild.classList[1] === "torreblanca" && izq === true){

            return true;

        }

        if(document.getElementsByClassName("h1")[0].firstChild.classList[1] === "torreblanca" && der === true){

            return true;

        }

        return false;

    }

}

/*Comprueba si es posible realizar el enroque que se intenta y lo ejecuta */

function enrocar(destino, color){

    if(color === "negro"){
        if(document.getElementsByClassName(destino)[0].firstChild != null){
            if(document.getElementsByClassName(destino)[0].firstChild.classList[1] === "torrenegra"){

                if(destino === "a8"){ //enroque largo negro

                    switch(false){

                        case estaVacio("b8"):

                            return false;

                        break;

                        case estaVacio("c8"):
                            
                            return false;

                        break;

                        case estaVacio("d8"):

                            return false;

                        break;

                        default:

                            if(enroqueNL){

                                let caetorre = document.getElementsByClassName("d8")[0]

                                caetorre.appendChild(torrenegra1);

                                let caerey = document.getElementsByClassName("c8")[0]

                                caerey.appendChild(reynegro);

                                turno++;

                            }
                    }


                }    

                if(destino === "h8"){ //enroque corto negro

                    switch(false){

                        case estaVacio("g8"):
                            
                            return false;

                        break;

                        case estaVacio("f8"):

                            return false;

                        break;

                        default:

                            if(enroqueNC){

                                let caetorre = document.getElementsByClassName("f8")[0]

                                caetorre.appendChild(torrenegra2);

                                let caerey = document.getElementsByClassName("g8")[0]

                                caerey.appendChild(reynegro);

                                turno++;

                            }
                    }


                } 

            }
        }
    }

    if(color === "blanco"){
        if(document.getElementsByClassName(destino)[0].firstChild != null){
            if(document.getElementsByClassName(destino)[0].firstChild.classList[1] === "torreblanca"){

                if(destino === "a1"){ //enroque largo negro

                    switch(false){

                        case estaVacio("b1"):

                            return false;

                        break;

                        case estaVacio("c1"):
                            
                            return false;

                        break;

                        case estaVacio("d1"):

                            return false;

                        break;

                        default:

                            if(enroqueBL){

                                let caetorre = document.getElementsByClassName("d1")[0]

                                caetorre.appendChild(torreblanca1);

                                let caerey = document.getElementsByClassName("c1")[0]

                                caerey.appendChild(reyblanco);

                                turno++;

                            }
                    }


                }    

                if(destino === "h1"){ //enroque corto negro

                    switch(false){

                        case estaVacio("g1"):
                            
                            return false;

                        break;

                        case estaVacio("f1"):

                            return false;

                        break;

                        default:

                            if(enroqueBC){

                                let caetorre = document.getElementsByClassName("f1")[0]

                                caetorre.appendChild(torreblanca2);

                                let caerey = document.getElementsByClassName("g1")[0]

                                caerey.appendChild(reyblanco);

                                turno++;

                            }
                    }


                } 

            }
        }
    }

}

