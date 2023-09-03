const grafico = document.querySelector('.grafico');
let puntosR3 = [],
    puntosR2 = [];

const posGraficoY = ( y ) => grafico.offsetHeight / 2. + y;
const posGraficoX = ( x ) => grafico.offsetWidth / 2. + x;

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

class Observador {
    pos; // PuntoR3
    dir; // PuntoR3 (ojo, tiene que ser unitario)
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }
}

let obs = new Observador( new PuntoR3(0, 0, 12), new PuntoR3(1, 0, 0) ),
      u   = new PuntoR3(0,1,0),
      v   = new PuntoR3(0,0,1);


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

const A = new PuntoR3(3,1,0),
      B = new PuntoR3(3,-2,0),
      C = new PuntoR3(5,-0.5,0),
      D = new PuntoR3(4,-1,4),
      AP = new PuntoR2( A ),
      BP = new PuntoR2( B ),
      CP = new PuntoR2( C ),
      DP = new PuntoR2( D ),
      linea1 = new LineaR2(AP, BP),
      linea2 = new LineaR2(AP, CP),
      linea3 = new LineaR2(AP, DP),
      linea4 = new LineaR2(BP, CP),
      linea5 = new LineaR2(BP, DP),
      linea6 = new LineaR2(CP, DP);

      puntosR3.push(A, B, C, D);


console.log(puntosR3);

const acercarse = () => {
    const h = 0.0167,
          deltaT = 16.67;
    let t = 0;
    for( let i = 0; i < 1000; i++ ) {
        setTimeout(() => {
            grafico.replaceChildren('');
            puntosR2 = [];
            obs.pos.z -= h;
            puntosR3.forEach( (elem) => {
                puntosR2.push( new PuntoR2(elem) );
            });
            console.log(puntosR2);
            for(let i = 0; i < puntosR2.length - 1; i++) {
                for( let j = 0; j < puntosR2.length; j++ )
                    new LineaR2( puntosR2[i], puntosR2[j] );
            }
        }, t);
        t += deltaT;
    }
}

acercarse();
