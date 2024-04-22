import { useState } from 'react';
import './css/App.css';
import Activities from './components/Activities';
import WeatherWidget from './components/WeatherWidget';
import LocalAlarm from './components/LocalAlarm';

function App() {
  // globalCity state is here, so outher components have access to it 
  // but it doesn't get updated at every keystroke only on submit
  const [globalCity, setGlobalCity] = useState('');
  const [globalWeatherData, setGlobalWeatherData] = useState(null);

  document.title = "Weather app" // sets the title of the page (hardcoded)

  return (
    <div className="App">
      {/* Any component call has to be in this div!!!! VERY IMPORTANT 
      <h1>This is a skeleton file that was created by create-react-app and modified</h1>
      <p>
        I got rid of the placeholder text in App.js and the styling in App.css
        <br />
        !BUT!
        <br />
        if you want your actual react components to run here, then import them and call them in the div that this h1 and paragraph is. (I left a comment in the code too)
        <br />
      </p>
      */}
      <div className='weather'>
        <WeatherWidget 
          setGlobalCity={setGlobalCity}
          setGlobalWeatherData={setGlobalWeatherData}
        />
        <LocalAlarm globalWeatherData={globalWeatherData}/>
      </div>
      <Activities globalCity={globalCity} />
    </div>
  );
}

export default App;
