
import React, {useState} from "react";
import '../css/SearchBar.css';
import icon from '../images/logo.svg';



function SearchBar({onCitySubmit}) {
    const [city, setCity] = useState(''); // City variables are initialy set to nothing because the user has not set anything

    const handleInputChange = (e) => {
        setCity(e.target.value);  // This will handle the input change whenever the user types in a different city
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ensure that an empty input does not get passed through
        onCitySubmit(city);
        
    }
    return(
        <form className='container' onSubmit={handleSubmit}> {/* This is a container for the text input and the search button*/}
            <input className='search' 
            type='text'
            placeholder='Search town or city'
            value={city}
            onChange={handleInputChange}
            />
            <button type="submit" className='searchButton'>
                <img src={icon} alt='search' /> {/* This will submit the input into the API */}
            </button>
        </form>
    );
    

}

export default SearchBar;