//////////////////////////////////////////////// GENERATION /////////////////////////////////////////////////////////
function saisie(type, nom, champ, valeur = null) {
    let input = document.createElement("input");
    input.setAttribute("type", type);
    if (type === "number") {
        input.setAttribute("min", 0);
        input.setAttribute("max", 20);
        input.setAttribute("name", nom);
        input.setAttribute("step", 0.25);
        if (valeur !== null)
            input.setAttribute("value", valeur);
    } else {
        input.id = nom;
        input.readOnly = true;
    }

    champ.appendChild(input);
    return champ;
}
//////////////////////// CHOIX /////////////////////////

function show(semestre, description) {
    //set the description
    let title = document.getElementById('Titre');
    let texte = document.createElement('p');
    texte.textContent = description.année;
    title.appendChild(texte);
    title.style.display = 'block';

    texte = document.createElement('p');
    texte.textContent = description.semestre;
    title.appendChild(texte);

    let img = document.getElementsByTagName('img')[0]
    img.src = description.image;
    img.style.display = 'inline';

    let table = document.getElementsByTagName("table")[0];
    semestre.forEach(module => {
        let nom = document.createElement("td");
        nom.textContent = module.nom;
        nom.setAttribute("width", 400);

        let coef = document.createElement("td");
        coef.textContent = module.coef;
        coef.setAttribute("name", "coeff");

        let TD = document.createElement("td");
        if (module.TD !== '/') {
            saisie("number", module.nom, TD, module.TD);
        } else {
            TD.textContent = module.TD;
        }

        let TP = document.createElement("td");
        if (module.TP !== '/') {
            saisie("number", module.nom, TP, module.TP);
        } else
            TP.textContent = module.TP;

        let EX = document.createElement("td");
        saisie("number", module.nom, EX, module.Examin);

        let moy = document.createElement("td");
        saisie("text", module.nom, moy);

        let ligne = document.createElement("tr");
        ligne.appendChild(nom);
        ligne.appendChild(coef);
        ligne.appendChild(TD);
        ligne.appendChild(TP);
        ligne.appendChild(EX);
        ligne.appendChild(moy);

        table.appendChild(ligne);
    });

    let moyGeneral = document.createElement("th");
    moyGeneral.setAttribute("colspan", 6);
    moyGeneral.textContent = "MOYENNE :";
    saisie("text", "moy", moyGeneral);

    let ligne2 = document.createElement("tr");
    ligne2.appendChild(moyGeneral);
    table.appendChild(ligne2);

    Moyenne(semestre);

    // show again
    document.getElementsByTagName('table')[0].style.display = 'table';
    document.getElementById('buttons').style.display = 'none';
    document.getElementById('back').style.display = 'inline';
    document.getElementById('welcome').style.display='none';
    document.getElementById('download').style.display='none';
}

////////////////////////////////////////////// TRAITEMENT ///////////////////////////////////////////////////////

Number.prototype.round = function round(places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function Moyenne(semestre) {
    let inputs = document.querySelectorAll(" tr td input[type=number]");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", function (e) {

            if (e.target.value > 20)
                e.target.value = 20;
            if (e.target.value < 0)
                e.target.value = 0;

            let moyMod = document.getElementById(e.target.name);
            let compt = document.getElementsByName(e.target.name);
            moyMod.value = 0;

            if (semestre == S4) {
                if (compt.length === 3) {
                    moyMod.value = (((Number(compt[0].value) + Number(compt[1].value)) / 2 + (Number(compt[2].value) * 2)) / 3);
                } else if ((compt.length === 2)) {
                    moyMod.value = (Number(compt[0].value) + (Number(compt[1].value) * 2)) / 3;
                } else
                    moyMod.value = compt[0].value;
            } else {
                if (compt.length === 2) {
                    moyMod.value = (Number(compt[0].value) + (Number(compt[1].value))) / 2;
            }else
                moyMod.value = compt[0].value;}

            moyMod.value = roundToTwo(moyMod.value);

            let moys = document.querySelectorAll("td input[type=text]");
            let moyg = document.querySelector("th input");
            let coefs = document.querySelectorAll("td[name=coeff]");
            let coefNum = 0;

            moyg.value = 0;
            for (let i = 0; i < moys.length; i++) {
                moyg.value = Number(moyg.value) + Number(moys[i].value) * Number(coefs[i].textContent);
                coefNum += Number(coefs[i].textContent);
            }
            moyg.value = Number(moyg.value) / coefNum;
            moyg.value = roundToTwo(moyg.value);
        });
    }

    //window.addEventListener("loadd", function(){
    let lignes = document.getElementsByTagName("tr");
    let tabmoy = [];
    let tabcoef = [];
    let coefTotal = 0;
    for (var i = 1; i < lignes.length - 1; i++) {
        let Elt = lignes[i].querySelectorAll("[name]");

        let moyMod = lignes[i].querySelector("[type=text]");

        // moyenne module
        if (Elt.length === 4) {
            moyMod.value = (((Number(Elt[1].value) + Number(Elt[2].value)) / 2 + (Number(Elt[3].value) * 2)) / 3);
        } else if (Elt.length === 3) {
            moyMod.value = (Number(Elt[1].value) + (Number(Elt[2].value) * 2)) / 3;
        } else
            moyMod.value = Elt[1].value;

        // l afficher
        moyMod.value = roundToTwo(moyMod.value);
        if (moyMod.value == 0 || moyMod.value === 'NaN') {
            moyMod.value = "";
        }
        tabmoy.push(Number(moyMod.value));
        tabcoef.push(Number(lignes[i].querySelector("[name]").textContent));
        coefTotal += Number(lignes[i].querySelector("[name]").textContent);

    }
    let Moyenne = document.getElementById("moy");
    console.log(coefTotal);
    for (var i = 0; i < tabmoy.length; i++) {
        Moyenne.value = Number(Moyenne.value) + Number(tabmoy[i] * tabcoef[i]);
    }
    Moyenne.value = Number(Moyenne.value) / coefTotal;
    Moyenne.value = roundToTwo(Moyenne.value);
    if (Moyenne.value == 0)
        Moyenne.value = "";
    //});
}
// DELETING
function del() {
    document.getElementById('buttons').style.display = 'flex';
    document.getElementById('Titre').innerHTML = '';
    document.getElementById('Titre').style.display = 'none';
    let table = document.getElementsByTagName('table')[0]
    table.innerHTML = `<tr>
    <th >Module</th>
    <th>Coef</th>
    <th>TD</th>
    <th>TP</th>
    <th>Examin</th>
    <th>Moyenne</th>
</tr>`
    table.style.display = 'none';
    document.getElementsByTagName('img')[0].style.display = 'none';
    document.getElementById('back').style.display = 'none';
    document.getElementById('welcome').style.display='block';
    document.getElementById('download').style.display='block';
}