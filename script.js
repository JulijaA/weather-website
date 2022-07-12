const dateEl = document.getElementById("current-date");
const timeEl = document.getElementById("current-time");
const currentWeatherItems = document.getElementById("current-weather-items");
const currentTempEl = document.getElementById('temp');
const currentCountry = document.getElementById('country');
let iconEl = document.getElementById("icon");
const weatherForecastEl = document.getElementById('weather-forecast');
const dynamicImg = document.getElementById('dynamicImg');
const desc = document.getElementById('description');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '20e6b0e3bf8e4abefb9fd54a03f0e429';

const imagesForWeather = {
    Clear: './img/sunny1.png',
    Clouds: 'https://images.pexels.com/photos/531767/pexels-photo-531767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    Thunderstorm: './img/thunderstrom.png',
    Drizzle: "./img/drizzle.png",
    Rain: './img/rain1.png',
    Snow: './img/snow.png',
    Fog: './img/fog1.png',

}

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
    let { humidity, pressure, sunrise, sunset, wind_speed, temp } = data.current;
    let { main } = data.current.weather[0];
    let { icon } = data.current.weather[0];
    let { description } = data.current.weather[0];

    function dynamicBackground() {
        for (const key in imagesForWeather) {
            if (key === main) {
                dynamicImg.innerHTML =
                    `
            <img src="${imagesForWeather[key]}" width='100%';> 
            `;
            }
        }
    }

    currentTempEl.innerHTML = Math.floor(temp) + "&#8451;";
    currentCountry.innerHTML = data.timezone;
    desc.innerHTML = description;

    currentWeatherItems.innerHTML =
        `
        <h3>Weather Details</h3>
        <div class="weather-item">
        <div class="text-item">Humidity: <i class="fa-solid fa-temperature-half"></i> </div>
        <div>${humidity}%</div>
        
        </div>
        <div class="weather-item">
        <div class="text-item" >Pressure: <i class="fa-solid fa-temperature-arrow-up"></i> </div>
            <div>${pressure} mb</div>
        </div>
        <div class="weather-item">
        <div  class="text-item">Wind: <i class="fa-solid fa-wind"></i> </div>
            <div>${wind_speed} km/h</div>
            
        </div>
        <div class="weather-item">
        <div  class="text-item">Sunrise: <i class="fa-regular fa-sun"></i> </div>
            <div>${window.moment(sunrise * 1000).format('HH:hh a')}</div>
            
        </div>
        <div class="weather-item">
        <div class="text-item">Sunset: <i class="fa-regular fa-moon"></i></div>
            <div>${window.moment(sunset * 1000).format('HH:hh a')}</div>
        </div>
    `;

    dynamicBackground();

    // =============== Code for showing the forecast for 7 days ===================================

    // let otherDayForcast = '';
    // data.daily.forEach((day, idx) => {
    //     if(idx == 0){

    //     }else {
    //         otherDayForcast += `
    //         <div class="weather-forecast-item">
    //             <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
    //             <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
    //             <div class="temp">${Math.floor(day.temp.day)}&#176;C</div>
    //         </div>

    //         `
    //     }
    // })

    // weatherForecastEl.innerHTML = otherDayForcast;
}


