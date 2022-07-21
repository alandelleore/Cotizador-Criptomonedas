const criptomonedasSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');

let nombreCripto;



const objBusqueda = {
    moneda: '',
    criptomoneda: '',
    nombre: ''
}
//Crear un Promise

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);

    monedaSelect.addEventListener('change', leerValor);
})

async function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD`;

    // fetch(url)
    //     .then(res => res.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then( criptomonedas => selectCriptomonedas(criptomonedas))

    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
        
        console.log(resultado.Data)
    } catch (error) {
        console.log(error)
    }

}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option')
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option)
        
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
    switch (objBusqueda[e.target.name]) {
        case 'BTC':
            nombreCripto = 'Bitcoin'
            break;
        case 'ETH':
            nombreCripto = 'Ethereum'
            break;
        case 'USDT':
            nombreCripto = 'Tether'
            break;
        case 'USDC':
            nombreCripto = 'USA Coin'
            break;
        case 'BNB':
            nombreCripto = 'Binance Coin'
            break;
        case 'XRP':
            nombreCripto = 'XRP'
            break;
        case 'SOL':
            nombreCripto = 'Solana'
            break;
        case 'BUSD':
            nombreCripto = 'BUSD'
            break;
        case 'ADA':
            nombreCripto = 'Cardano'
            break;
        case 'AVAX':
            nombreCripto = 'Avalanche'
            break;
         case 'DOGE':
            nombreCripto = 'Dogecoin'
            break;
        case 'FTT':
            nombreCripto = 'FTX Token'
            break;
        case 'DOT':
            nombreCripto = 'Polkadot'
            break;
        case 'MATIC':
            nombreCripto = 'Polygon'
            break;
        case 'SHIB':
            nombreCripto = 'Shiba Inu'
            break;
        case 'TRX':
            nombreCripto = 'TRON'
            break;
        case 'LINK':
            nombreCripto = 'Chainlink'
            break;
        case 'UNI':
            nombreCripto = 'Uniswap Protocol Token'
            break;
        case 'DAI':
            nombreCripto = 'Dai'
            break;
        case 'APE':
            nombreCripto = 'ApeCoin'
            break;                
        default:
            break;
    }
}



function submitFormulario(e){
    e.preventDefault()

    // validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === "" || criptomoneda === ""){
        mostrarAlerta('Debe seleccionar moneda/criptomoneda')
        return;
    }

    //Consultar la API con los resultados
    consultarAPI();
    
}

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error')
    if(!existeError){

        const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    //Mensaje de error
    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
        divMensaje.remove();
    }, 3000)

    }
    
}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try {
       const respuesta = await fetch(url);
       const cotizacion = await respuesta.json();
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);

    } catch (error) {
        console.log(error)
    }
}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();

    console.log(cotizacion)

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, IMAGEURL} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `Precio: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 hs: <span>${CHANGEPCT24HOUR}%</span></p>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p class='final'>Última actualización: <span>${LASTUPDATE}</span></p>`

    const imgCripto = document.createElement('div');
    imgCripto.innerHTML = `<div><img src='https://www.cryptocompare.com/${IMAGEURL}' /></div>
                           <div class='nombreCripto'><h5>${nombreCripto}</h5></div>`
    imgCripto.classList.add('logo-cripto','divCripto');

    const divisor = document.createElement('div');
    divisor.innerHTML = '<hr/>';

   
    resultado.appendChild(imgCripto);
    resultado.appendChild(divisor);
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
    
    window.scrollBy({
        top: 400,
        left: 100,
        behaviour: 'smooth'
      })


}

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}