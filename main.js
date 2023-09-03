const grafico = document.querySelector('.grafico');
const angGiro = 0.08819,
    pasoAvance = 1;
let puntosR3 = [],
    puntosR2 = [];

const posGraficoY = ( y ) => grafico.offsetHeight / 2. - y;
const posGraficoX = ( x ) => grafico.offsetWidth / 2. - x;

class PuntoR3 {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const convertirAUnitario = ( vec ) => {
    const aux = Math.sqrt( 1. / (vec.x ** 2. + vec.y ** 2. + vec.z ** 2.) );
    let vecUnitario = new PuntoR3(vec.x * aux, vec.y * aux, vec.z * aux);
    return vecUnitario;
}

const prodConEscalar = ( vec, k ) => {
    let vecRes = new PuntoR3( vec.x * k, vec.y * k, vec.z * k );
    return vecRes;
}

const prodVectorial = ( vec1, vec2 ) => {
    return new PuntoR3( vec1.y * vec2.z - vec1.z * vec2.y, vec2.x * vec1.z - vec2.z * vec1.x, vec1.x * vec2.y - vec1.y * vec2.x );
}

const sumaVec = ( vec1, vec2 ) => {
    return new PuntoR3( vec1.x + vec2.x, vec1.y + vec2.y, vec1.z + vec2.z );
}

const moduloVector = ( vec ) => {
    return Math.sqrt( vec.x ** 2. + vec.y **2. + vec.z **2. );
} 

const vectorOpuesto = ( vec ) => {
    return new PuntoR3( -vec.x, -vec.y,  -vec.z );
}


class Observador {
    pos; // PuntoR3
    dir; // PuntoR3 (ojo, tiene que ser unitario)
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }
}

let obs = new Observador( new PuntoR3(5, 0, 30), new PuntoR3(0, 0, -1) ),
      u   = new PuntoR3(1,0,0),
      v   = new PuntoR3(0,1,0);


class PuntoR2 {
    x;
    y;
    divHTML;
    constructor( ptoR3 ) {
        const d = -1. * ( obs.dir.x * ptoR3.x + obs.dir.y * ptoR3.y + obs.dir.z * ptoR3.z ),
              lambda = ( -d - obs.dir.x * obs.pos.x - obs.dir.y * obs.pos.y - obs.dir.z * obs.pos.z ) / ( obs.dir.x ** 2. + obs.dir.y ** 2. + obs.dir.z ** 2. );
        const origenR3 = new PuntoR3( obs.pos.x + lambda * obs.dir.x, obs.pos.y + lambda * obs.dir.y, obs.pos.z + lambda * obs.dir.z ),
              dist = Math.sqrt( (origenR3.x - obs.pos.x) ** 2. + (origenR3.y - obs.pos.y) ** 2. + (origenR3.z - obs.pos.z) ** 2. ); 
        let aux = ( u.y * v.x - u.x * v.y );
        if( aux != 0 ) {
            this.y = ( u.y * ( ptoR3.x - origenR3.x ) - u.x * ( ptoR3.y - origenR3.y ) ) / aux;
            this.x = ( v.y * ( ptoR3.x - origenR3.x ) - v.x * ( ptoR3.y - origenR3.y ) ) / (-aux);
        } else {
            aux = ( u.z * v.x - u.x * v.z );
            if( aux != 0 ) {
                this.y = ( u.z * ( ptoR3.x - origenR3.x ) - u.x * ( ptoR3.z - origenR3.z ) ) / aux;
                this.x = ( v.z * ( ptoR3.x - origenR3.x ) - v.x * ( ptoR3.z - origenR3.z ) ) / (-aux);
            } else {
                aux = ( u.z * v.y - u.y * v.z );
                this.y = ( u.z * ( ptoR3.y - origenR3.y ) - u.y * ( ptoR3.z - origenR3.z ) ) / aux;
                this.x = ( v.z * ( ptoR3.y - origenR3.y ) - v.y * ( ptoR3.z - origenR3.z ) ) / (-aux);
            }
        }
        this.x = (this.x / dist) * grafico.offsetWidth;
        this.y = (this.y / dist) * grafico.offsetHeight;
        this.divHTML = document.createElement('div');
        this.divHTML.className = 'punto';
        this.divHTML.style.top = `${ posGraficoY(this.y) }px`; 
        this.divHTML.style.left = `${ posGraficoX(this.x) }px`;
        grafico.append( this.divHTML );
    }
}

class LineaR2 {
    pto1;
    pto2;
    divHTML;
    constructor(pto1, pto2) {
        const aux1 = posGraficoY( pto1.y ),
              aux2 = posGraficoX( pto1.x ),
              aux3 = posGraficoY( pto2.y ),
              aux4 = posGraficoX( pto2.x );
        const deltaX = aux4 - aux2, 
              deltaY = aux3 - aux1;
        this.pto1 = pto1;
        this.pto2 = pto2;
        this.divHTML = document.createElement('div');
        this.divHTML.className = 'linea';
        this.divHTML.style.top = `${ aux1 }px`;
        this.divHTML.style.left = `${ aux2 + 2.5 }px`;
        this.divHTML.style.width = `${ Math.sqrt( deltaX ** 2. + deltaY ** 2. ) }px`;
        this.divHTML.style.transform = `rotate(${ Math.atan2( deltaY, deltaX ) }rad)`;
        grafico.append( this.divHTML );
    }
}

const renderR2 = () => {
    grafico.replaceChildren('');
    puntosR2 = [];
    puntosR3.forEach( (elem) => {
        puntosR2.push( new PuntoR2(elem) );
    });
    for(let i = 0; i < puntosR2.length - 1; i++) {
        for( let j = 0; j < puntosR2.length; j++ )
            new LineaR2( puntosR2[i], puntosR2[j] );
    }
}

const crearPlano = ( ptoInicial ) => {
    const lado = 10;
    puntosR3.push( ptoInicial );
    puntosR3.push( new PuntoR3( ptoInicial.x, ptoInicial.y + lado, ptoInicial.z ) );
    puntosR3.push( new PuntoR3( ptoInicial.x, ptoInicial.y, ptoInicial.z + lado ) );
    puntosR3.push( new PuntoR3( ptoInicial.x, ptoInicial.y + lado, ptoInicial.z + lado ) );
}

crearPlano( new PuntoR3(0,0,0) );
renderR2();

const girarArriba = () => {
    const vecGiro = prodConEscalar(v, angGiro);
    obs.dir = sumaVec( obs.dir, vecGiro );
    obs.dir = convertirAUnitario( obs.dir );
    v = prodVectorial( obs.dir, u );
}
const girarAbajo = () => {
    const vecGiro = prodConEscalar( vectorOpuesto(v), angGiro );
    obs.dir = sumaVec( obs.dir, vecGiro );
    obs.dir = convertirAUnitario( obs.dir );
    v = prodVectorial( obs.dir, u );
}
const girarIzq = () => {
    const vecGiro = prodConEscalar( u, angGiro );
    obs.dir = sumaVec( obs.dir, vecGiro );
    obs.dir = convertirAUnitario( obs.dir );
    u = prodVectorial( v, obs.dir );
}
const girarDer = () => {
    const vecGiro = prodConEscalar( vectorOpuesto(u), angGiro );
    obs.dir = sumaVec( obs.dir, vecGiro );
    obs.dir = convertirAUnitario( obs.dir );
    u = prodVectorial( v, obs.dir );
}
const avanzar = () => {
    const vecAvance = prodConEscalar( obs.dir, pasoAvance );
    obs.pos = sumaVec( obs.pos, vecAvance );
}

grafico.addEventListener("keydown", (e) => {
    switch(e.key) {
        case 'ArrowUp': girarArriba();
            break;
        case 'ArrowDown': girarAbajo();
            break;
        case 'ArrowLeft': girarIzq();
            break;
        case 'ArrowRight': girarDer();
            break;
        case 'w': ;
        case 'W': avanzar();
            break;
    }
    renderR2();
});

const acercarse = () => {
    const h = 0.0167,
          deltaT = 16.67;
    let t = 0;
    for( let i = 0; i < 1000; i++ ) {
        setTimeout(() => {
            obs.pos.z -= h;
            renderR2();
        }, t);
        t += deltaT;
    }
}

// acercarse();


