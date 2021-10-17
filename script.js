const dateEl = document.getElementById("current-date");
const timeEl = document.getElementById("current-time");
const currentWeatherItems = document.getElementById("current-weather-items");
const currentTempEl = document.getElementById('temp');
const currentCountry = document.getElementById('country');
let iconEl = document.getElementById("icon");
const weatherForecastEl = document.getElementById('weather-forecast');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '20e6b0e3bf8e4abefb9fd54a03f0e429';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = hoursIn12HrFormat + `:` + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ", " + date + ' ' + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed, temp} = data.current;
    let { icon } = data.current.weather[0];
    let { description} = data.current.weather[0];
    currentTempEl.innerHTML = Math.floor(temp) + " " + "&#8451;";
    currentCountry.innerHTML = data.timezone;
    iconEl.innerHTML = `
    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="" class="w-icon" id="icon">`;
    currentWeatherItems.innerHTML =
        `
        <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
        
        </div>
        <div class="weather-item">
        <div>Pressure</div>
            <div>${pressure} mb</div>
        </div>
        <div class="weather-item">
        <div>Wind Speed</div>
            <div>${wind_speed} km/h</div>
            
        </div>
        <div class="weather-item">
        <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:hh a')}</div>
            
        </div>
        <div class="weather-item">
        <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('HH:hh a')}</div>
            
        </div>
    `;

     let otherDayForcast = '';
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            
        }else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">${Math.floor(day.temp.day)}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}


