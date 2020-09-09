const sadMassage = document.querySelector(`.hiddenMSG`);
const weatherBox = document.querySelector(`.weather-box`);
const massage = document.querySelector(`.temp`);
let isLoaded = false;
const weather = `https://api.openweathermap.org/data/2.5/weather?q=`;
const localWeather = `https://api.openweathermap.org/data/2.5/weather?lat=`;
let currentLocation;
let tempObj = {};
let cityToCheckWeather = [];
const loader = document.querySelector(".loader");
const button = document.querySelector(".btn");
const input = document.querySelector(".input");

async function getWeather(searchValue) {
  console.log(`im here`);
  const response = await fetch(
    `${weather}${searchValue}&appid=24b9904362e84c395620b226a6816499`
  );
  const data = await response.json();
 
  tempObj = {
    name: data.name,
    temp: (data.main.temp - 272.15).toFixed(1),
    country: data.sys.country,
    icon:data.weather[0].icon
  };
  console.log(tempObj);

  if (cityToCheckWeather.some((city) => city.name === tempObj.name)) {
    console.log(`already exists`);
    console.log(cityToCheckWeather);
    sadMassage.classList.remove(`hiddenMSG`);
  } else {
    cityToCheckWeather.push(tempObj);
    console.log(cityToCheckWeather);
    console.log(`geg`);
    createTheDOM(tempObj);
    writeToHTML(cityToCheckWeather);
    sadMassage.classList.add(`hiddenMSG`);
  }
}
async function getLocalWeather(latitude, longitude) {
  const localResponse = await fetch(
    `${localWeather}${latitude}&lon=${longitude}&appid=24b9904362e84c395620b226a6816499`
  );
  const localData = await localResponse.json();
  console.log(localData);
  let sunriseCoockingHour = new Date(localData.sys.sunrise * 1000).getHours();
  let sunriseCoockingMinutes = new Date(
    localData.sys.sunrise * 1000
  ).getMinutes();
  let sunriseCoockingSeconds = new Date(
    localData.sys.sunrise * 1000
  ).getSeconds();
  let sunsetCoockingHour = new Date(localData.sys.sunset * 1000).getHours();
  let sunsetCoockingMinutes = new Date(
    localData.sys.sunset * 1000
  ).getMinutes();
  let sunsetCoockingSeconds = new Date(
    localData.sys.sunset * 1000
  ).getSeconds();
  let tempObj = {
    name: localData.name,
    temp: (localData.main.temp - 272.15).toFixed(1),
    sunrise: `${sunriseCoockingHour}:${sunriseCoockingMinutes}:${sunriseCoockingSeconds}`,
    sunset: `${sunsetCoockingHour}:${sunsetCoockingMinutes}:${sunsetCoockingSeconds}`,
  };
  currentLocation = tempObj;
  render(currentLocation);
}

(function geoFindMe() {
  isLoaded = false;
  loader.classList.remove("hidden");
  async function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    isLoaded = true;
    await getLocalWeather(latitude, longitude);
    loader.classList.add("hidden");
  }
  function error() {
    status.textContent = "Unable to retrieve your location";
  }
  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    // status.textContent = "Locating…";

    navigator.geolocation.getCurrentPosition(success, error);
  }
})();

async function render(currentLocation) {
  console.log(isLoaded);
  console.log(currentLocation);
  massage.textContent = `you are currently in ${currentLocation.name} the weather is ${currentLocation.temp}°C sunrise is at ${currentLocation.sunrise} and sunset is at ${currentLocation.sunset}`;
}

function createTheDOM(tempObj) {
  myWeatherDiv = document.createElement("div");
  myWeatherDiv.classList.add(`weatherDiv`);
  myCityName = document.createElement("p");
  myCityName.classList.add(`cityName`);
  myCityName.textContent = `${tempObj.name}, ${tempObj.country}`;
  myCityTemp = document.createElement("p");
  myCityTemp.classList.add(`cityTemp`);
  myCityTemp.textContent = `${tempObj.temp}°C`;
  myCityIcon = document.createElement("img");
  myCityIcon.src = `http://openweathermap.org/img/wn/${tempObj.icon}@2x.png`
  
}
function writeToHTML(arr) {
  arr.forEach((obj) => {
    myWeatherDiv.append(myCityName);
    myWeatherDiv.append(myCityIcon);
    myWeatherDiv.append(myCityTemp);
    weatherBox.append(myWeatherDiv);
  });
}
button.addEventListener(`click`, async () => {
  let searchValue = input.value;
  console.log(searchValue);
  await getWeather(searchValue);
});
