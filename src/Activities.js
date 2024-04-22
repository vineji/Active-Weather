import React, {useState, useEffect} from "react";
import axios from "axios";
import Lottie from 'lottie-react';
import '../css/Activities.css';
import Loading from "../images/Loading.json";
import Outdoor from "../images/Outdoor.svg";

const Activities = ({globalCity}) => {
    const [lon, setLon] = useState(null) // longtitude variable
    const [lat, setLat] = useState(null) // latitude variable
    const [placeID, setPlaceID] = useState(null) // placeID variable
    const [activityData, setActivityData] = useState(null); // Return from the API with activities for the given location
    const [loading, setLoading] = useState(true) // variable to indicate if we are still waiting for a reply from the API

    const fetchCoords = async () => {
        try {
            const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${globalCity}&format=json&apiKey=5a932255cafc4521aa5c1e3181469ec4
            `
            );
            // This is Konrad's API key, make sure to replace it with your own.

            // set data variables
            setLon(response.data.results[0].lon);
            setLat(response.data.results[0].lat);
            setPlaceID(response.data.results[0].place_id);
            setLoading(false); // indicate loading is finished (reply from the API arrived)

            // DEBUGGING CODE
            // console.log(response.data.results[0].place_id)
            // console.log("fetchCoords retuned:");
            // console.log(response.data); // outputs weather data to console log
            // console.log("fetchCoords said lon is:");
            // console.log(lon);
            // console.log("fetchCoords said lat is:");
            // console.log(lat);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setLoading(true); // indicate loading has started (we are waiting for a reply from the API)
        fetchCoords();
    }, [globalCity]); // any time the city that is searched for changes, fetch it's coordinates

    const fetchActivities = async () => {
        try {
            const response = await axios.get(
            /*`https://api.geoapify.com/v2/places?categories=entertainment.activity_park&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=4&apiKey=5a932255cafc4521aa5c1e3181469ec4
            ` */
            `https://api.geoapify.com/v2/places?categories=entertainment.activity_park&filter=place:${placeID}&bias=proximity:${lon},${lat}&limit=4&apiKey=5a932255cafc4521aa5c1e3181469ec4`
            );
            // This is Konrad's API key, make sure to replace it with your own. (or better yet, implement env files for API keys)
            // it only returns 4 activities at max, so that the app does not become too crowded with data

            setActivityData(response.data) // set data variable
            setLoading(false); // indicte loading is finished (reply from the API arrived)

            // DEBUGGING CODE
            //console.log(response.data)
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchActivities();
    }, [lon, lat]); // any time coordinates change, fetch corresponding Activity data


    // return the data, formatted and conditionally
    return(
        <div className="rightTile">
            {globalCity ? ( // if global city has value
                <>
                    <h1 className="header">Local activities around {globalCity}</h1>
                    {loading ? ( // if we are still loading, display loading animation
                        <Lottie animationData={Loading}/>
                    ) : (
                        <div className="scrollable">
                            {activityData ? ( // if the API returned something
                                
                                activityData.features.length !== 0 ? ( // if the API returned non-zero amounts of activities
                                    activityData.features.map((feature) => 
                                        <Activity activityData={feature} />
                                    )
                                ) : ( // if the API returned, but with an empty list, which  means there are no activities there
                                    <p>No activities found. Search again or try a different city.</p>
                                )
                            ) : ( // if the API has not returned anything yet (no call has been made yet, because user has not searched for a city yet)
                                <p>Search for a city to display activity data.</p>
                            )}
                        </div>
                    )}
                </>
            ): ( // if global city does not have a value (user has not searched for a city yet)
                <>
                    <h1 className="header">Local activities</h1>
                    <p>Search for a location to get local activities</p>
                    <img src={Outdoor} alt="outdoor activities" className="outdoor"></img>

                </>
            )}
        </div>

    )
}

// Function to streamline the look of each displayed activity, and make it easier to display as many as we want
const Activity = ({activityData}) => {
    return(
        <section className="activityData">
            <h2>{activityData["properties"]["name"]}</h2>
            <p>
                <a href={activityData["properties"]["website"]} target="_blank" rel="noreferrer">Visit website</a><br/><br/>
                Address: {activityData["properties"]["formatted"]}<br/>
            </p>
        </section>
    )
}

export default Activities;

/* 
Format of the JSON returned by the Places API:
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "VauxWall East Climbing Centre",
                "country": "United Kingdom",
                "country_code": "gb",
                "state": "England",
                "county": "Greater London",
                "city": "London",
                "postcode": "SE11 6BD",
                "district": "London Borough of Lambeth",
                "neighbourhood": "Ethelred Estate",
                "suburb": "Lambeth",
                "street": "Lollard Street",
                "housenumber": "1",
                "lon": -0.11459148930774206,
                "lat": 51.49233205,
                "state_code": "ENG",
                "formatted": "VauxWall East Climbing Centre, 1 Lollard Street, London, SE11 6BD, United Kingdom",
                "address_line1": "VauxWall East Climbing Centre",
                "address_line2": "1 Lollard Street, London, SE11 6BD, United Kingdom",
                "categories": [
                    "building",
                    "building.sport",
                    "entertainment",
                    "entertainment.activity_park",
                    "entertainment.activity_park.climbing",
                    "fee",
                    "sport",
                    "sport.sports_centre"
                ],
                "details": [
                    "details",
                    "details.payment"
                ],
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database Licence",
                    "url": "https://www.openstreetmap.org/copyright",
                    "raw": {
                        "fee": "yes",
                        "name": "VauxWall East Climbing Centre",
                        "sport": "climbing",
                        "osm_id": 97209805,
                        "leisure": "sports_centre",
                        "website": "https://londonclimbingcentres.co.uk/centre/vauxeast/",
                        "alt_name": "VauxEast",
                        "building": "commercial;detached",
                        "operator": "London Climbing Centres",
                        "osm_type": "w",
                        "addr:city": "London",
                        "addr:street": "Cabanel Place",
                        "payment:cash": "no",
                        "addr:postcode": "SE11 6BD",
                        "opening_hours": "Mo-Fr 09:00-22:00; Sa-Su,PH 09:00-19:00",
                        "operator:type": "private_for_profit",
                        "climbing:sport": "no",
                        "payment:others": "no",
                        "addr:housenumber": 1,
                        "climbing:boulder": "yes",
                        "climbing:toprope": "no",
                        "payment:contactless": "yes",
                        "payment:debit_cards": "yes",
                        "payment:credit_cards": "yes"
                    }
                },
                "website": "https://londonclimbingcentres.co.uk/centre/vauxeast/",
                "opening_hours": "Mo-Fr 09:00-22:00; Sa-Su,PH 09:00-19:00",
                "operator": "London Climbing Centres",
                "operator_details": {
                    "type": "private_for_profit"
                },
                "name_other": {
                    "alt_name": "VauxEast"
                },
                "payment_options": {
                    "cash": false,
                    "others": false,
                    "contactless": true,
                    "debit_cards": true,
                    "credit_cards": true
                },
                "building": {
                    "type": "commercial;detached"
                },
                "distance": 1884,
                "place_id": "51cc08fa2ade55bdbf598dfc90bc04bf4940f00102f901cd4dcb050000000092031d5661757857616c6c204561737420436c696d62696e672043656e747265"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.1145914893077446,
                    51.49233204917355
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "The Font Borough",
                "country": "United Kingdom",
                "country_code": "gb",
                "state": "England",
                "county": "Greater London",
                "city": "London",
                "postcode": "SE1 9BL",
                "district": "London Borough of Southwark",
                "suburb": "The Borough",
                "quarter": "Bankside",
                "street": "Park Street",
                "housenumber": "185",
                "lon": -0.0971764,
                "lat": 51.5071808,
                "state_code": "ENG",
                "formatted": "The Font Borough, 185 Park Street, London, SE1 9BL, United Kingdom",
                "address_line1": "The Font Borough",
                "address_line2": "185 Park Street, London, SE1 9BL, United Kingdom",
                "categories": [
                    "entertainment",
                    "entertainment.activity_park",
                    "entertainment.activity_park.climbing",
                    "fee",
                    "sport",
                    "sport.sports_centre"
                ],
                "details": [
                    "details"
                ],
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database Licence",
                    "url": "https://www.openstreetmap.org/copyright",
                    "raw": {
                        "fee": "yes",
                        "name": "The Font Borough",
                        "sport": "climbing",
                        "osm_id": 11042290163,
                        "leisure": "sports_centre",
                        "website": "https://www.the-font.co.uk/borough",
                        "operator": "The Font Climbing Ltd",
                        "osm_type": "n",
                        "addr:city": "London",
                        "addr:street": "Park Street",
                        "addr:postcode": "SE1 9BL",
                        "opening_hours": "Mo-Fr 06:30-22:30; Sa-Su 10:00-18:00",
                        "operator:type": "private_for_profit",
                        "addr:housename": "Unit 1b, Triptych Place",
                        "climbing:sport": "no",
                        "addr:housenumber": 185,
                        "climbing:boulder": "yes",
                        "climbing:toprope": "no"
                    }
                },
                "website": "https://www.the-font.co.uk/borough",
                "opening_hours": "Mo-Fr 06:30-22:30; Sa-Su 10:00-18:00",
                "operator": "The Font Climbing Ltd",
                "operator_details": {
                    "type": "private_for_profit"
                },
                "distance": 2116,
                "place_id": "516469f1738de0b8bf59eccce84cebc04940f00103f901f3f92b920200000092031054686520466f6e7420426f726f756768"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.0971764,
                    51.50718079917155
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "EustonWall Climbing Centre",
                "country": "United Kingdom",
                "country_code": "gb",
                "state": "England",
                "county": "Greater London",
                "city": "London",
                "postcode": "NW1 3AX",
                "district": "London Borough of Camden",
                "suburb": "Fitzrovia",
                "street": "Euston Road",
                "housenumber": "350",
                "lon": -0.1420434,
                "lat": 51.5244151,
                "state_code": "ENG",
                "formatted": "EustonWall Climbing Centre, 350 Euston Road, London, NW1 3AX, United Kingdom",
                "address_line1": "EustonWall Climbing Centre",
                "address_line2": "350 Euston Road, London, NW1 3AX, United Kingdom",
                "categories": [
                    "entertainment",
                    "entertainment.activity_park",
                    "entertainment.activity_park.climbing",
                    "fee",
                    "sport",
                    "sport.sports_centre"
                ],
                "details": [
                    "details",
                    "details.payment"
                ],
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database Licence",
                    "url": "https://www.openstreetmap.org/copyright",
                    "raw": {
                        "fee": "yes",
                        "name": "EustonWall Climbing Centre",
                        "sport": "climbing",
                        "osm_id": 10552592178,
                        "leisure": "sports_centre",
                        "website": "https://londonclimbingcentres.co.uk/centre/eustonwall/",
                        "alt_name": "Euston Wall",
                        "operator": "London Climbing Centres",
                        "osm_type": "n",
                        "addr:city": "London",
                        "addr:street": "Euston Road",
                        "payment:cash": "no",
                        "addr:postcode": "NW1 3AX",
                        "opening_hours": "Mo-Fr 06:00-23:00; Sa-Su,PH 09:00-21:00",
                        "operator:type": "private_for_profit",
                        "climbing:sport": "no",
                        "payment:others": "no",
                        "addr:housenumber": 350,
                        "climbing:boulder": "yes",
                        "climbing:toprope": "no",
                        "payment:contactless": "yes",
                        "payment:debit_cards": "yes",
                        "payment:credit_cards": "yes"
                    }
                },
                "website": "https://londonclimbingcentres.co.uk/centre/eustonwall/",
                "opening_hours": "Mo-Fr 06:00-23:00; Sa-Su,PH 09:00-21:00",
                "operator": "London Climbing Centres",
                "operator_details": {
                    "type": "private_for_profit"
                },
                "name_other": {
                    "alt_name": "Euston Wall"
                },
                "payment_options": {
                    "cash": false,
                    "others": false,
                    "contactless": true,
                    "debit_cards": true,
                    "credit_cards": true
                },
                "distance": 2147,
                "place_id": "51316bce667a2ec2bf59f93ab20820c34940f00103f90132c7fb740200000092031a457573746f6e57616c6c20436c696d62696e672043656e747265"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.14204339999999996,
                    51.524415099169296
                ]
            }
        }
    ]
}
*/