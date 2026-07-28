/* =====================================
 GPU BUY - GŁÓWNY SKRYPT
===================================== */


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





const steps=[


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
title:"Do czego była używana karta?",
key:"usage",
options:[
["gaming","Granie"],
["mining","Kopanie kryptowalut"],
["work","Praca / AI"]
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


document
.getElementById("startScreen")
.classList.add("hidden");



document
.getElementById("calculator")
.classList.remove("hidden");



currentStep=0;


showStep();


}










function showStep(){



let step=
steps[currentStep];



document
.getElementById("questionTitle")
.innerHTML=
step.title;




document
.getElementById("stepCounter")
.innerHTML=
"Krok "+
(currentStep+1)
+
" / "
+
steps.length;





document
.getElementById("progressFill")
.style.width=
((currentStep+1)
/steps.length*100)
+"%";






let area=
document.getElementById("answers");


area.innerHTML="";





if(step.type==="gpu"){


let input=
document.createElement("input");



input.className=
"gpu-search";



input.placeholder=
"Wpisz np. RTX 3070";



input.oninput=function(){

searchGPU(
input.value
);

};



area.appendChild(input);


return;


}







step.options.forEach(option=>{



let button=
document.createElement("div");



button.className=
"answer";



button.innerHTML=
option[1];




button.onclick=function(){


answers[step.key]
=
option[0];



nextStep();



};




area.appendChild(button);



});



}









function searchGPU(text){


let area=
document.getElementById("answers");



let old=
document.getElementById("gpuResults");



if(old)
old.remove();





let result=
document.createElement("div");


result.id=
"gpuResults";





gpuDatabase.forEach(card=>{


if(

card.name
.toLowerCase()
.includes(
text.toLowerCase()
)

){



let item=
document.createElement("div");



item.className=
"answer";



item.innerHTML=
card.name;




item.onclick=function(){


answers.gpu=
card;



nextStep();



};




result.appendChild(item);



}



});





area.appendChild(result);



}










function nextStep(){



if(currentStep < steps.length-1){


currentStep++;


showStep();



}
else{


finishCalculator();



}



}









function calculatePrice(){



let basePrice;




if(

answers.state==="newCard"

||

answers.state==="usedCard"

){


basePrice=
answers.gpu.maxPrice;


}
else{


basePrice=
answers.gpu.minPrice;


}






let finalPrice=
basePrice;



let changes=[];






function applyRule(rule){



if(
priceRules[rule]
){



let item=
priceRules[rule];



finalPrice +=
item.value;




if(item.value!==0){


changes.push({

name:item.name,

value:item.value

});


}



}



}







applyRule(
answers.warranty
);


applyRule(
answers.box
);


applyRule(
answers.fans
);


applyRule(
answers.coil
);


applyRule(
answers.service
);


applyRule(
answers.opened
);


applyRule(
answers.repaired
);


applyRule(
answers.artifacts
);


applyRule(
answers.moisture
);






if(finalPrice<0)

finalPrice=0;







return{


basePrice,

changes,

finalPrice


};



}









function finishCalculator(){



let result=
calculatePrice();





document
.getElementById("calculator")
.classList.add("hidden");



document
.getElementById("resultScreen")
.classList.remove("hidden");






document
.getElementById("priceResult")
.innerHTML=

result.finalPrice
+
" zł";







let corrections="";



result.changes.forEach(c=>{


corrections +=

c.name
+
": "
+
c.value
+
" zł<br>";



});








document
.getElementById("summaryText")
.innerHTML=


`

<b>${answers.gpu.name}</b>

<br><br>


Cena bazowa:

${result.basePrice} zł


<br><br>


Korekty:

<br>

${corrections}


<br>


<b>Oferta odkupu:
${result.finalPrice} zł</b>


<br><br>


Cena orientacyjna.
Końcowa wycena zależy od realnego stanu karty.


`;









let mailText=

`
Model:
${answers.gpu.name}


Oferta:
${result.finalPrice} zł


Cena bazowa:
${result.basePrice} zł


`;





document
.getElementById("emailButton")
.href=

"mailto:"
+
config.email
+
"?subject=Wycena GPU&body="
+
encodeURIComponent(mailText);





document
.getElementById("phoneButton")
.href=

"tel:"
+
config.phone;




}









window.addEventListener(
"load",
()=>{


let loader=
document.getElementById("loader");



if(loader){


setTimeout(()=>{


loader.style.display="none";


},500);



}



});