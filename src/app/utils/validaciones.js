export function validarCedula(cedula) {
    let ci = cedula.toString().split('');

    if (ci.length > 10 || ci.length < 10) {
        return false;
    }

    let digitoRegion = Number(ci[0] + ci[1]);
    if (digitoRegion < 1 || digitoRegion > 24) {
        return false;
    }

    let tercerDigito = Number(ci[2]);
    if (tercerDigito < 0 || tercerDigito > 6) {
        return false;
    }

    let suma = 0;
    let val = 0;
    for (let i = 0; i < 9; i++) {
        if (i & 1) {
            val = ci[i] * 1;
            if (val >= 10) {
                val = val - 9;
            }
        } else {
            val = ci[i] * 2;
            if (val >= 10) {
                val = val - 9;
            }
        }
        suma += val;
    }

    suma = suma % 10 ? 10 - suma % 10 : 0;

    if (suma === Number(ci[ci.length - 1])) {
        return true;
    } else {
        return false;
    }
}

export function validarRuc(ruc) {
    let rucCorrecto = false;
    let COEFICIENTES6 = [3, 2, 7, 6, 5, 4, 3, 2];
    let COEFICIENTES9 = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let rucPub = [8];
    let rucPri = [9];
    let multi = 0;
    let residuo = 0;
    let novDig = 0;
    let decDig = 0;

    if (ruc.length == 13) {
        let prov = parseInt(ruc.substring(0, 2));
        let tercerDigito = parseInt(ruc.substring(2, 3));
        let tresUltimos = (ruc.substring(10, 13));
        let cuatroUlt = ruc.substring(9, 13);

        if (prov >= 1 && prov <= 24) {
            if (tercerDigito < 6) { //Personas Naturales
                let ced = ruc.substring(0, 10);

                if (validarCedula(ced) == true && tresUltimos == "001") {
                    rucCorrecto = true;
                } //Fin if(cedula(ced) == true)
            } else if (tercerDigito == 6 && cuatroUlt == "0001") { //Empresas Publicas
                novDig = parseFloat(ruc.substring(8, 9));

                for (let i = 0; i < 8; i++) {
                    rucPub[i] = parseInt(ruc.substring(i, i + 1));
                    multi = multi + (rucPub[i] * COEFICIENTES6[i]);
                } //Fin for

                // let div = multi / 11;
                residuo = multi % 11;

                if (residuo == 0 && decDig == 0) {
                    rucCorrecto = true;
                } else {
                    let res = 11 - residuo;

                    if (res == novDig) {
                        rucCorrecto = true;
                    } else {
                        rucCorrecto = false;
                    } //Fin if(res == novDig)
                } //Fin if if(residuo == 0 && decDig == 0)
            } else if (tercerDigito == 9 && tresUltimos == "001") { //Empresas Privadas
                decDig = parseFloat(ruc.substring(9, 10));

                for (let i = 0; i < 9; i++) {
                    rucPri[i] = parseInt(ruc.substring(i, i + 1));
                    multi = multi + (rucPri[i] * COEFICIENTES9[i]);
                } //Fin for

                // let div = multi / 11;
                residuo = multi % 11;

                if (residuo == 0 && decDig == 0) {
                    rucCorrecto = true;
                } else {
                    let res = 11 - residuo;

                    if (res == decDig) {
                        rucCorrecto = true;
                    } else {
                        rucCorrecto = false;
                    } //Fin if(res == novDig)
                } //Fin if(residuo == 0 && decDig == 0)
            } else {
                console.log("El numero ingresado no corresponde a ningun tipo de RUC");
            } //Fin if(tercerDigito == 6){
        } else {
            console.log("El RUC ingresado no corresponde a ninguna provincia");
        } //Fin if(prov>=1 && prov<=24)
    } else {
        console.log("El Ruc debe contener 13 dígitos");
    } //Fin if(ruc.length()==13)


    return rucCorrecto;
} //Fin metodo ruc