/*
console.log('**** test.js ****');

navigator.geolocation.getCurrentPosition(pos => {
    fetch(`http://localhost:5000/weather/all/${pos.coords.latitude}/${pos.coords.longitude}`)
     .then(res => res.json())
     .then( weather => console.log(weather) )
     .catch(error => console.log(error));
});
*/