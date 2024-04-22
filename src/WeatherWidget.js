import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Results from './Results';
import '../css/WeatherWidget.css';


const WeatherWidget = ({setGlobalCity, setGlobalWeatherData}) => {
    const [city, setCity] = useState('');

    const handleCitySubmit = (newCity) => {
        setCity(newCity); // This will set the sity variable with whatever input the user has put in
    };

    return(
        <div className='container'> {/* This is the container where the user will search using the SearchBar and the data will show in the Results */}
            <div className='back'>
                <SearchBar onCitySubmit={handleCitySubmit}/>
                <Results city={city} setGlobalCity={setGlobalCity} setGlobalWeatherData={setGlobalWeatherData}/>
            </div>
        </div>
    );
}

export default WeatherWidget;

