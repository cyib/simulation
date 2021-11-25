function distribution(leftElectrons, onlyLayers = false) {
    const pauling = 4;
    const electrons = leftElectrons;

    let l = 1;
    let c = 1;

    let valenceLayer = 1;

    let auxC = 0;
    let auxLJumpSuborbit = 0;
    let auxLJumpOrbit = 0;
    
    let orbitSuportsAux = 2;

    let orbitSupports = 2;
    let suborbitsAmount = 1;

    let sublayers = {};
    while (leftElectrons > 0) {
        leftElectrons -= sameOrbitRemoveFactor(c).aux;
        if(l > valenceLayer) valenceLayer = l;
        
        //SUBLAYERS [K,L,M,N ... Q]
        if(!sublayers[l]){
            sublayers[l] = sameOrbitRemoveFactor(c).aux;
            if(leftElectrons <= 0) {
                sublayers[l] = sameOrbitRemoveFactor(c).aux+leftElectrons;
                sublayers = sublayersWithDistributionExceptions(sublayers, electrons, valenceLayer, l, c);
            }
        }else{
            sublayers[l] += sameOrbitRemoveFactor(c).aux;
            if(leftElectrons <= 0) {
                sublayers[l] = sameOrbitRemoveFactor(c).main+leftElectrons;
                sublayers = sublayersWithDistributionExceptions(sublayers, electrons, valenceLayer, l, c);
            }
        }
        
        if(c == 1 && (suborbitsAmount*2)==l){
            //JUMP ORBIT
            if(leftElectrons <= 0) break;
            suborbitsAmount++;
            orbitSupports = (orbitSuportsAux + pauling) + orbitSupports;
            orbitSuportsAux += pauling;
            l += auxLJumpOrbit;
            c = l;
            auxLJumpOrbit--;
        }else if(c == 1){
            //JUMP SUBORBIT
            if(leftElectrons <= 0) break;
            c += auxC;
            auxC++;
            l++;
            l += auxLJumpSuborbit;
            auxLJumpSuborbit--;
        }else{
            //JUMP SAMEORBIT
            if(leftElectrons <= 0) break;
            l++;
            c--;
        }
    }

    let response = {
        l, 
        c, 
        valenceLayer,
        electrons: sameOrbitRemoveFactor(c).aux+leftElectrons, 
    };
    if(onlyLayers) return { layers: sublayers };
    
    return response;
}

function sameOrbitRemoveFactor(c, withHistory=true) {
    let history = [];
    let main = 2;
    let aux = 2;
    for (let i = 0; i < c-1; i++) {
        history.push(aux);
        main = (aux+4) + main;
        aux+=4;
    }
    if(withHistory){ 
        history.push(aux);
        return { history, main, aux };
    }
    return { main, aux };
}

function sublayersWithDistributionExceptions(sublayers, electrons, valenceLayer, l, c) {
    var _sublayers = sublayers;

    var history = sameOrbitRemoveFactor(c, true).history;
    var alreadyCompleted = _sublayers[valenceLayer-1];
    for (const h of history) {
        alreadyCompleted -= h
    }
    alreadyCompleted += history[history.length-1];

    if(electrons <= 47){
        if(_sublayers[valenceLayer]==2 && (alreadyCompleted == 4 || alreadyCompleted == 9)){
            _sublayers[valenceLayer]--;
            _sublayers[valenceLayer-1]++;
        }
    }
 
    return _sublayers;
}

// var simAtoms = [24, 29, 41, 42, 44, 45, 46, 47, 57, 58, 64, 78, 79, 89, 90, 91, 92];
// for (const a of simAtoms) {
//     console.log(a);
//     console.table(distribution(a, true));
// }

// for (let a = 1; a < 119; a++) {
//     console.log(a);
//     console.table(distribution(a, true));
// }

