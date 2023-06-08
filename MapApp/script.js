'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

const type = inputType.value;

let map;
let mapEvent;
let workouts = [];


//parent class
class Workout{
    date = new Date();
    id = (Date.now()+'').slice(-10);

    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

}

class Running extends Workout {
    type = 'Running';

    constructor (coords, distance, duration, cadence){
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this.setDescription();
    }

    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }

    setDescription(){
        this.description = `Running on ${this.date.toDateString()}`;
    }
}

class Cycling extends Workout {
  type = 'Cycling';

    constructor (coords, distance, duration, elevationGain){
        super(coords, distance, duration)
        this.elevationGain = elevationGain;
        this.calcPace();
        this.setDescription();
    }

    calcPace(){
      this.pace = this.duration / this.distance;
      return this.pace;
  }

  setDescription(){
      this.description = `Cycling on ${this.date.toDateString()}`;
  }
}


navigator.geolocation.getCurrentPosition(
  
    function (position) {
        console.log(position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coords= [latitude, longitude];
        

      

        map = L.map('map').setView(coords, 13);

        map.on("click", function (mapE){
             mapEvent = mapE;

            form.classList.remove('hidden');
            inputDistance.focus();

     } )
            

            


        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const data = JSON.parse(localStorage.getItem("workouts"))

        if (data){
          workouts = data;
          console.log(data);
          console.log(workouts);
          
          for (let workout of workouts){
          let lat = workout.coords[0];
          let lng = workout.coords[1];

          markerTemplate(lat, lng);
          htmlTemplate(workout);
};
        }
  
        
    },
    function(){
        alert("Could not get position. ");
    }
  
    
);

form.addEventListener('submit', function(e){
    e.preventDefault()
    
    
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const lat = mapEvent.latlng.lat;
    const lng = mapEvent.latlng.lng;
    let workout;

    
    if (type ==='running'){
        const cadence = Number(inputCadence.value);
        workout= new Running([lat,lng],distance,duration,cadence);
        console.log('running')
    }
    if (type ==='cycling'){
        const elevation = +inputElevation.value;
        workout= new Cycling([lat,lng],distance,duration,elevation);
        console.log('cycling')
    }

    workouts.push(workout); //adding latest workout to array
    console.log(workouts);

    //local storage of array
    localStorage.setItem("workouts", JSON.stringify(workouts));

    markerTemplate(lat, lng);
    htmlTemplate(workout)

    form.reset();
    form.classList.add('hidden');
            });

    

    
//rendering workout in the sidebar


inputType.addEventListener('change', function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
 })
 
containerWorkouts.addEventListener("click", function(e){
  const workoutEl = e.target.closest(".workout");

  if (!workoutEl) return; //if workout not found return out of this function

  const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

  map.setView(workout, coords, 13,{
    animate:true,
    pan: {
      duration:1,
    },
  });
});


///other functions///

function htmlTemplate(workout){
  let html;
  if (type == "running"){
    html = `<li class="workout workout--running" data-id=${workout.id}>
  <h2 class="workout__title">${workout.description}</h2>
  <div class="workout__details">
    <span class="workout__icon">🏃‍♂️</span>
    <span class="workout__value">${workout.distance}</span>
    <span class="workout__unit">km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${workout.duration}</span>
    <span class="workout__unit">min</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>`;
          }else if(type == "cycling"){ 
            html = `<li class="workout workout--cycling" data-id=${workout.id}>
  <h2 class="workout__title">${workout.description}</h2>
  <div class="workout__details">
    <span class="workout__icon">🚴‍♀️</span>
    <span class="workout__value">${workout.distance}</span>
    <span class="workout__unit">km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${workout.duration}</span>
    <span class="workout__unit">min</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace}</span>
    <span class="workout__unit">km/h</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${workout.elevationGain}</span>
    <span class="workout__unit">m</span>
  </div>
</li>`;
        }
form.insertAdjacentHTML("afterend",html);

};

function markerTemplate(lat, lng){
  L.marker([lat, lng])
  .addTo(map)
  .bindPopup(
      L.popup({
          maxWidth:250,
          minWidth:100,
          autoClose:false,
          closeOnClick:false,
          className:'running-popup',
       })
      )   
  .setPopupContent('Workout')
  .openPopup();
}