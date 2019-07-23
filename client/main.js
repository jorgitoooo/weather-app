navigator.geolocation.getCurrentPosition(pos => {
    fetch(`http://localhost:5000/weather/all/${pos.coords.latitude}/${pos.coords.longitude}`)
    .then( res => res.json())
    .then(weather => {
        populatePage(weather);
    })
    .catch(error => console.log(error));
});
setInterval(updateTime, 1000);
/****************************************************/

function populatePage(weather) {
    populateCurrentWeather(weather.currently);
    pupulateHourlyWeather(weather.hourly);
    populateDailyWeather(weather.daily);
}

function populateCurrentWeather(currentWeather) {    
    //
    const [weekday, month, day, year, rest] = Date().split(' ');
    document.getElementById('cur-date').innerHTML = `${weekday} - ${month} ${day} ${year}`;
    
    // add current temperature
    const curTemp = document.getElementById('cur-temp');
    const temperature = parseInt(currentWeather.temperature);
    curTemp.innerHTML = `${temperature}°F`;
    
    // add appropriate background color
    const curTempBg = document.getElementById('cur-temp-bg');
    curTempBg.className += ` ${getTempColor(temperature)}`

    // get corresponding icon element
    const curIcon = document.getElementById('cur-icon');
    const icon = currentWeather.icon;
    
    // add icon class name
    const curIconClassNames = curIcon.className.split(' ');
    curIconClassNames.push(getIcon(icon));
    curIcon.className = curIconClassNames.join(' ');

    const curTempSummary = document.getElementById('cur-temp-sum');
    curTempSummary.innerHTML = currentWeather.summary;
}

function pupulateHourlyWeather(hourlyWeather) {
    // get hourly weather element
    const hourlyContainer = document.getElementById('hourly-weather');

    // populate hourly summary
    const hourlySum = document.getElementById('hourly-sum');
    hourlySum.innerHTML = hourlyWeather.summary;

    // add the next 5 hours of weather
    for(let i = 1; i < 6; i++) {
        const hourData = hourlyWeather.data[i];
        const hourTemp = parseInt(hourData.temperature);
        const time = new Date(hourData.time * 1000).getHours();
        const am_pm = parseInt(time/12) > 0 ? 'PM' : 'AM';
        
        // create hourly temperature component
        const hourlyTemp = `
        <li class="list-item flex-between text-white ${
            getTempColor(hourTemp)
        } mt-2">
            <span class="li-comp bg-dark text-right" style="width: 4.5rem;">${
                time%12 === 0 ? 12 : time%12
            } ${
                am_pm
            }</span>
            <span class="li-comp">${
                hourTemp
            }°F</span>
        </li>
        `;

        // append hourly temperature component
        hourlyContainer.innerHTML += hourlyTemp;
    }
}

function populateDailyWeather(dailyWeather) {
    const weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    // populate daily summary
    const dailySum = document.getElementById('daily-sum');
    dailySum.innerHTML = dailyWeather.summary;

    // get daily temperature container
    const dailyContainer = document.getElementById('daily-container');
    const dailyWArr = dailyWeather.data;
    for(let i = 0; i < 7; i++) {
        const weekday = weekdays[new Date(dailyWArr[i].time*1000).getDay()];
       
        // create daily temperature component
        const lowTemp = parseInt(dailyWArr[i].temperatureLow);
        const highTemp = parseInt(dailyWArr[i].temperatureHigh);

        const dailyTemp = `
        <div class="card ${
            getTempColor((lowTemp + highTemp) / 2)
        } m-2 h-10">
            <div class="card-header bg-dark"><h4 class="font-weight-bold text-white text-center">${
                weekday
            }</h4></div>
            <div class="card-body font-weight-bold">
                <div class="flex-between">    
                    <div class="flex-col">
                        <h4 class="daily-temp-high card-title">High: ${
                            parseInt(dailyWArr[i].temperatureHigh)
                        }°F</h4>
                        <h5 class="daily-temp-low card-title">Low: ${
                            parseInt(dailyWArr[i].temperatureLow)
                        }°F</h5>
                    </div>
                    <i class="text-white fas ${
                        getIcon(dailyWArr[i].icon)
                    }" style="font-size: 3.5rem;"></i>
            </div>
        </div>
        `;

        // append daily temperature component
        dailyContainer.innerHTML += dailyTemp; 
    }
}

function getTempColor(temp) {
    if      (temp < 45)  return 'bg-freeze';
    else if (temp < 70)  return 'bg-cold';
    else if (temp < 85)  return 'bg-warm';
    else if (temp <= 90) return 'bg-warmer';
    else return 'bg-hot';
}

function getIcon(icon) {
    const weatherIcons = {
        'clear-day'          : 'fa-sun', 
        'clear-night'        : 'fa-moon',
        'cloudy'             : 'fa-cloud',
        'partly-cloudy-day'  : 'fa-cloud-sun',
        'a'                  : 'fa-cloud-sun-rain', 
        'b'                  : 'fa-cloud-moon-rain',
        'rain'               : 'fa-cloud-showers-heavy',
        'partly-cloudy-night': 'fa-cloud-moon',
        'snow'               : 'fa-snowflake',
        'thunderstorm'       : 'fa-bolt',
        'wind'               : 'fa-wind'
    }
    return weatherIcons[icon];
}

function updateTime() {
    document.getElementById('cur-time').innerHTML = `
    ${new Date().toLocaleTimeString()}
    `;
}