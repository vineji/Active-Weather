import '../css/LocalAlarm.css';
import pendingPic from '../images/pending_alarm.svg';
import safePic from '../images/safe_alarm.svg';
import dangerousPic from '../images/dangerous_alarm.svg';

function isExtremeWeather(id) {
    if (200 <= id && id <= 299)
        return true;
    if (id === 621 || id === 622)
        return true;
    if (762 <= id && id <= 781)
        return true;
    return false;
}

const Safe =
    <div className="safe">
        <div className="flexContainer">
            <p>No extreme weather detected.</p>
            <img src={safePic} alt="safe alarm"></img>
        </div>
    </div>;

const Dangerous = (data) => 
    <div className="dangerous">
        <div className="flexContainer">
            <p>Extreme weather detected! Seek shelter!</p>
            <img src={dangerousPic} alt="dangerous alarm"></img>
        </div>
    </div>;

const LocalAlarm = ({globalWeatherData}) => {
    if (globalWeatherData === null)
        return (
        <div className="local-alarm">
            <h1 className="localHeader">Local weather alarm</h1>
            <div className="flexContainer">
                <p>Search for a location to get local weather alarm</p>
                <img src={pendingPic} alt="pending alarm"></img>
            </div>
        </div>
        );

    const extremeWeathers = globalWeatherData.weather.filter(w => isExtremeWeather(w.id));

    return (
        <div className="local-alarm">
            <h1 className="localHeader">Local weather alarm around {globalWeatherData.name}</h1>
            {extremeWeathers.length > 0 ? Dangerous(extremeWeathers) : Safe}
        </div>
    );
}

export default LocalAlarm;
