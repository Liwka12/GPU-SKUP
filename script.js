/* =====================================================
 GPU SKUP - SCRIPT.JS
 Kalkulator odkupu kart graficznych
 ===================================================== */


let currentStep = 0;



let answers = {

    gpu:null,
    state:null,
    service:null,
    opened:null,
    repaired:null,
    age:null,
    artifacts:null,
    warranty:null,
    box:null,
    fans:null,
    coil:null,
    usage:null,
    moisture:null

};



const questions = [


{
title:"Wybierz model karty graficznej",
type:"gpu"
},


{
title:"Jaki jest stan karty?",
key:"state",
options:[
["newCard","Nowa"],
["usedCard","Używana"],
["damagedCard","Uszkodzona"]
]
},



{
title:"Czy karta miała kiedyś serwis?",
key:"service",
options:[
["serviceYes","Tak"],
["serviceNo","Nie"]
]
},



{
title:"Czy karta była kiedyś rozbierana?",
key:"opened",
options:[
["openedYes","Tak"],
["openedNo","Nie"]
]
},



{
title:"Czy karta była kiedyś naprawiana?",
key:"repaired",
options:[
["repairedYes","Tak"],
["repairedNo","Nie"]
]
},



{
title:"Ile czasu posiadasz kartę?",
key:"age",
options:[
["less1","Mniej niż rok"],
["oneThree","1-3 lata"],
["moreThree","Ponad 3 lata"]
]
},



{
title:"Czy karta wyświetla artefakty?",
key:"artifacts",
options:[
["artifactsYes","Tak"],
["artifactsNo","Nie"]
]
},



{
title:"Czy karta posiada gwarancję?",
key:"warranty",
options:[
["warrantyYes","Tak"],
["warrantyNo","Nie"]
]
},



{
title:"Czy karta posiada pudełko?",
key:"box",
options:[
["boxYes","Tak"],
["boxNo","Nie"]
]
},



{
title:"Czy wentylatory terkoczą lub buczą?",
key:"fans",
options:[
["fansBad","Tak"],
["fansGood","Nie"]
]
},



{
title:"Czy karta piszczy cewkami?",
key:"coil",
options:[
["coilYes","Tak"],
["coilNo","Nie"]
]
},



{
title:"Do czego używana była karta?",
key:"usage",
options:[
["gaming","Granie"],
["mining","Kopanie kryptowalut"],
["work","Praca"]
]
},



{
title:"Czy karta miała kontakt z wilgocią?",
key:"moisture",
options:[
["moistureYes","Tak"],
["moistureNo","Nie"]
]
}


];







function startCalculator(){


hideElement("startScreen");

showElement("calculator");


currentStep=0;


showQuestion();


}








function showQuestion(){


let q = questions[currentStep];



let title=document.getElementById("questionTitle");

if(title)
title.innerHTML=q.title;



let counter=document.getElementById("stepCounter");

if(counter)
counter.innerHTML=
"Krok "+(currentStep+1)+" / "+questions.length;



let progress=document.getElementById("progressFill");

if(progress)
progress.style.width =
((currentStep+1)/questions.length*100)+"%";




let box=document.getElementById("answers");

if(!box)
return;


box.innerHTML="";





if(q.type==="gpu"){


let input=document.createElement("input");

input.className="gpu-search";

input.placeholder="Wpisz np. RTX 3070";


input.addEventListener("input",function(){

searchGPU(input.value);

});


box.appendChild(input);


return;


}







q.options.forEach(option=>{


let button=document.createElement("button");

button.className="answer";

button.innerHTML=option[1];



button.onclick=function(){


answers[q.key]=option[0];


nextQuestion();


};



box.appendChild(button);



});


}









function searchGPU(text){


let box=document.getElementById("answers");


if(!box)
return;



let old=document.getElementById("gpuResults");


if(old)
old.remove();




let result=document.createElement("div");

result.id="gpuResults";




if(typeof gpuDatabase==="undefined"){

result.innerHTML="Brak bazy GPU";

box.appendChild(result);

return;

}





gpuDatabase.forEach(card=>{


if(card.name.toLowerCase().includes(text.toLowerCase())){


let button=document.createElement("button");


button.className="answer";


button.innerHTML=card.name;



button.onclick=function(){


answers.gpu=card;


nextQuestion();


};


result.appendChild(button);


}



});



box.appendChild(result);



}









function nextQuestion(){


if(currentStep < questions.length-1){


currentStep++;

showQuestion();


}

else{


showResult();


}


}









function previousQuestion(){


if(currentStep>0){


currentStep--;

showQuestion();


}


}









function calculatePrice(){


if(!answers.gpu)
return 0;




let price;



// NOWA / UŻYWANA = CENA MAKSYMALNA
// USZKODZONA = MINIMALNA


if(
answers.state==="newCard" ||
answers.state==="usedCard"
){


price=answers.gpu.maxPrice;


}
else{


price=answers.gpu.minPrice;


}






function add(rule){


if(
typeof priceRules!=="undefined" &&
priceRules[rule]
){


price += priceRules[rule].value;


}


}




add(answers.warranty);

add(answers.box);

add(answers.fans);

add(answers.coil);

add(answers.opened);

add(answers.repaired);

add(answers.artifacts);

add(answers.moisture);

add(answers.service);






if(price<0)

price=0;



return Math.round(price);



}









function showResult(){


let finalPrice=calculatePrice();



hideElement("calculator");

showElement("resultScreen");





let price=document.getElementById("priceResult");


if(price)

price.innerHTML =
finalPrice+" zł";





let summary=document.getElementById("summaryText");


if(summary){


summary.innerHTML=


`
<b>${answers.gpu.name}</b>

<br><br>

Proponowana cena odkupu:

<h2>${finalPrice} zł</h2>


<p>
Cena orientacyjna.
Końcowa cena zależy od rzeczywistego stanu karty.
</p>

`;


}




createEmail(finalPrice);



}









function createEmail(price){



let email=document.getElementById("emailButton");


if(!email)
return;




let message = `

WYCENA KARTY GRAFICZNEJ

======================


Model:

${answers.gpu.name}



Proponowana cena:

${price} zł



======================

INFORMACJE KLIENTA:


Stan:

${translate(answers.state)}



Serwis:

${translate(answers.service)}



Rozbierana:

${translate(answers.opened)}



Naprawiana:

${translate(answers.repaired)}



Czas posiadania:

${translate(answers.age)}



Artefakty:

${translate(answers.artifacts)}



Gwarancja:

${translate(answers.warranty)}



Pudełko:

${translate(answers.box)}



Wentylatory:

${translate(answers.fans)}



Cewki:

${translate(answers.coil)}



Użytkowanie:

${translate(answers.usage)}



Wilgoć:

${translate(answers.moisture)}



======================


Proszę o kontakt w sprawie odkupu.



`;





email.href =

"mailto:?subject=Wycena GPU&body="
+
encodeURIComponent(message);



}









function translate(value){



let data={


newCard:"Nowa",

usedCard:"Używana",

damagedCard:"Uszkodzona",


serviceYes:"Tak",

serviceNo:"Nie",


openedYes:"Tak",

openedNo:"Nie",


repairedYes:"Tak",

repairedNo:"Nie",


less1:"Mniej niż rok",

oneThree:"1-3 lata",

moreThree:"Ponad 3 lata",


artifactsYes:"Tak",

artifactsNo:"Nie",


warrantyYes:"Tak",

warrantyNo:"Nie",


boxYes:"Tak",

boxNo:"Nie",


fansBad:"Buczą / terkoczą",

fansGood:"Sprawne",


coilYes:"Piszczenie cewek",

coilNo:"Brak",


gaming:"Granie",

mining:"Kopanie kryptowalut",

work:"Praca",


moistureYes:"Tak",

moistureNo:"Nie"


};



return data[value] || "Nie podano";


}









function showElement(id){


let e=document.getElementById(id);


if(e)
e.classList.remove("hidden");


}



function hideElement(id){


let e=document.getElementById(id);


if(e)
e.classList.add("hidden");


}








window.addEventListener("load",function(){


let loader=document.getElementById("loader");


if(loader){


setTimeout(function(){


loader.style.display="none";


},800);


}


});