
var RASHOD_MOTO = 5;
var RASHOD_CAR = 10;

const SMILEY_HAPPY = 'sm_1.png';
const SMILEY_SAD = 'sm_2.png';

var statusEl = document.getElementById('status');
var liters = document.getElementById('liters');     
var litersOut = document.getElementById('litersOut'); 
var btnMoto = document.getElementById('btnMoto');
var btnCar = document.getElementById('btnCar');
var smiley = document.getElementById('smiley');


document.addEventListener('DOMContentLoaded', function () {
   
    litersOut.textContent = liters.value + ' л';

    var start = confirm('Приступаем?');
    if (start) {
        statusEl.textContent = 'Жизнь продолжается, и мы должны двигаться дальше';
    } else {
        statusEl.textContent = 'Камень остаётся на месте';
    }
});


liters.addEventListener('input', function () {
    litersOut.textContent = liters.value + ' л';
});


var lastDistance = '';


function askDistance() {
    var input = prompt('Введите длину пути (км):', lastDistance);
    if (input === null) return null; 
    var value = parseFloat(input);
    lastDistance = input;
    return value;
}


var canTravel = (litersValue, distanceKm, rashod100) => {
    var need = (distanceKm * rashod100) / 100;
    return litersValue >= need;
};

btnMoto.addEventListener('click', function () { handleVehicle('moto'); });
btnCar.addEventListener('click', function () { handleVehicle('car'); });


function handleVehicle(type) {
    var distance = askDistance();
    if (distance === null) return; 

    
    var ras = (type === 'moto') ? RASHOD_MOTO : RASHOD_CAR;


    var litersValue = parseFloat(liters.value);
    var enough = canTravel(litersValue, distance, ras);
    var need = (distance * ras) / 100;

   
    smiley.src = enough ? SMILEY_HAPPY : SMILEY_SAD;
    smiley.style.display = 'inline-block';

}

   

   

