navigator.geolocation.getCurrentPosition(
    
    function (position) {
        // console.log(position);
        const form = document.querySelector('.form');
        const containerWorkouts = document.querySelector('.workouts');
        const inputType = document.querySelector('.form__input--type');
        //const inputDistance = document.querySelector('.form__input--distance');
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coords= [latitude, longitude]

        let map;
        let mapEvent
        map = L.map('map').setView(coords, 13);
        map.on('click', function(mapE) {
            mapEvent=mapE

            console.log(mapEvent)
            
            form.classList.remove('hidden');
            //inputDistance.focus();

            const lat= mapEvent.latlng.lat
            const lng= mapEvent.latlng.lng
            L.marker([lat, lng]).addTo(map)
                    .bindPopup(L.popup({
                        maxWidth:250,
                        minWidth:100,
                        autoClose:false,
                        closeOnClick:false,
                        className:'running-popup',
                    }))
                    .setPopupContent('Workout')
                    .openPopup();

        })
       

        

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([latitude, longitude]).addTo(map)
    .bindPopup('your location')
    .openPopup();
        console.log('https://www.google.com/maps/@'+latitude+','+longitude)
        
    }, 
    function(){
        alert("Could not get position. ")
    }
)

form.addEventListener('submit', function(){})