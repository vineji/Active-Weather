import React, {useEffect, useState} from "react";
import axios from "axios";
import wIcon from '../images/wIcon.svg';
import thermometer from '../images/thermometer.svg';
import '../css/Results.css';
import humidity from '../images/humidity.svg';
import sunrise from '../images/sunrise.svg';
import sunset from '../images/sunset.svg';
import pressure from '../images/pressure.svg';
import wind from '../images/wind.svg';

const Results = ({city, setGlobalCity, setGlobalWeatherData}) => {
    const [weatherData, setWeatherData] = useState(null); // This is the variable which will store the weather data in a JSON format

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=13f35ad8d3b3a5c1d90cbb7e1977e2cf`
            ); // This is Vineji's API key
            setWeatherData(response.data);
            setGlobalWeatherData(response.data);
            setGlobalCity(response.data.name); // This stores the city name in order to find the local activites in the city.
        }
        catch (error){
            console.error(error); // If an invalid city is entered an alert will show up to indicate thi.
            setWeatherData(null);
            alert("invalid town or city entered \n type in a valid city or town name");
        }
    }

    useEffect(() => {
        if (city){
            fetchData(); // if the city exists it calls the fetchData function
        }
    }, [city]);

    const convertTimeStampToDate = (timestamp, timezone) => { 
        const dateObject = new Date(timestamp * 1000)
        const timeObject = timezone / 60;
        // this is a method I put in to convert the time stamp from the API into real time in order to get the time of sunset and sunrise
        dateObject.setMinutes(dateObject.getMinutes() + timeObject);

        return dateObject.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: false});
    };

    const degreeToCompass = (deg) => {
        const compass = ['North','North East','East','South East','South','South West','West','North West'];
        const index = Math.round(deg / 45) % 8;
        return compass[index];
        // this a method I put in to get the compass direction of the wind by using the angle returned by the API as an arguments
    };

    const splitWords = (description) => {
        const arr = description.split(" ");
        return arr
        // this is a method I put in to spilt description from the API into an array of words to show them in different line
    };

    
    return (
        <div className='results'>
            {weatherData ? (
                <section >
                    <div className="resultsHeader">
                        <text className="Rname">{weatherData.name}</text> {/* shows name of city */}
                        <div className="sun_div"> {/* shows the sunrise and sunset in the time of the cities region  */}
                            <div className="sun">
                                <img src={sunrise} className="sun_icon" alt="sunrise"></img>
                                <p className="sun_text">{convertTimeStampToDate(weatherData.sys.sunrise, weatherData.timezone)}</p>
                            </div>
                            <div className="sun">
                                <img src={sunset} className="sun_icon" alt="sunset"></img>
                                <p className="sun_text">{convertTimeStampToDate(weatherData.sys.sunset, weatherData.timezone)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="data">
                        <div className="card"> 
                            <p className="card_title">Temperature</p> {/* shows the temperature */}
                            <img src={thermometer} alt="temperature" className='thermometer'></img>
                            <p className="temp_text">{weatherData.main.temp}&deg;C</p>
                        </div>
                        <div className="card"> 
                            <p className="card_title">Description</p> {/* shows the description of the weather */}
                            {/* This is an API used to get a weather icon that corresponds with the description */}
                            <img alt="description" src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} className='desc_icon'></img>
                            <p className="desc_text" >{splitWords(weatherData.weather[0].description)[0]} <br/>{splitWords(weatherData.weather[0].description)[1]} </p>
                        </div>
                        <div className="card"> 
                            <p className="card_title">Humidity</p> {/* shows the humidity */}
                            <img src={humidity} className='humidity' alt="humidity"></img>
                            <p className="temp_text">{weatherData.main.humidity}%</p>
                        </div>
                        <div className="card"> 
                            <p className="card_title">Pressure</p> {/* shows the pressure  */}
                            <img src={pressure} className='pressure' alt="pressure"></img>
                            <p className="temp_text">{weatherData.main.pressure} mb</p>
                        </div>
                        <div className="card"> 
                            <p className="card_title">Wind</p> {/* shows the wind speed and direction */}
                            <img src={wind} className='wind' alt="wind"></img>
                            <p className="wind_div">{weatherData.wind.speed} m/s<br/> {degreeToCompass(weatherData.wind.deg)} </p>
                        </div>
                    </div>

                </section>
            ) : (
                <section>
                    <img src={wIcon} className='wIcon' alt="weather"></img> {/* this is the default icon when the is no input */}
                </section>

            )
            }
        </div>
    );

          
};
    
    
export default Results;

/*
Format of the JSON returned by the OpenWeather API:
{
    "coord": {
        "lon": -0.1257,
        "lat": 51.5085
    },
    "weather": [
        {
            "id": 803,
            "main": "Clouds",
            "description": "broken clouds",
            "icon": "04n"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 5.9,
        "feels_like": 3.52,
        "temp_min": 4.44,
        "temp_max": 7.06,
        "pressure": 994,
        "humidity": 81
    },
    "visibility": 10000,
    "wind": {
        "speed": 3.09,
        "deg": 170
    },
    "clouds": {
        "all": 75
    },
    "dt": 1709404066,
    "sys": {
        "type": 2,
        "id": 2075535,
        "country": "GB",
        "sunrise": 1709361782,
        "sunset": 1709401347
    },
    "timezone": 0,
    "id": 2643743,
    "name": "London",
    "cod": 200
}
*/