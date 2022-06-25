import style from "./WeatherApp.module.css";
import { ReactComponent as AirFlowIcon } from "../../images/airFlow.svg";
import { ReactComponent as RainIcon } from "../../images/rain.svg";
import { ReactComponent as RefreshIcon } from "../../images/refresh.svg";
import { useCallback, useEffect, useState } from "react";
import { OPENDATA_CWB_AUTHORIZATION } from "../../global/constants";
import WeatherIcon from "./components/WeatherIcon";

const Authorization = OPENDATA_CWB_AUTHORIZATION;

const fetchCurrentWeather = () => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${Authorization}&locationName=臺北`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log("data", data);
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
          neededElements[item.elementName] = item.elementValue;
        }
        return neededElements;
      }, {});

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
      };
    });
};

const fetchWeatherForecast = () => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${Authorization}&locationName=臺北市`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        if (["Wx", "PoP", "CI"].includes(item.elementName)) {
          neededElements[item.elementName] = item.time[0].parameter;
        }
        return neededElements;
      }, {});

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

const WeatherApp = () => {
  console.log("--- invoke");

  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
  });

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather(), fetchWeatherForecast()]);
      //   console.log("data", currentWeather, weatherForecast);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
      });
    };

    fetchingData();
  }, []);

  useEffect(() => {
    console.log("useEffect");
    fetchData();
  }, [fetchData]);

  return (
    <div className={style.container}>
      {console.log("render")}
      <div className={style.weatherCard}>
        <div className={style.location}>{weatherElement.locationName}</div>
        <div className={style.description}>
          {weatherElement.description} {weatherElement.comfortability}
        </div>
        <div className={style.currentWeather}>
          <div className={style.temperature}>
            {Math.round(weatherElement.temperature)} <div className={style.celsius}>°C</div>
          </div>
          <WeatherIcon currentWeatherCode={weatherElement.weatherCode} moment="night" />
        </div>
        <div className={style.airFlow}>
          <AirFlowIcon />
          {weatherElement.windSpeed} m/h
        </div>
        <div className={style.rain}>
          <RainIcon />
          {Math.round(weatherElement.rainPossibility)}%
        </div>
        <div
          className={style.redo}
          onClick={() => {
            fetchData();
          }}
        >
          最後觀測時間：
          {new Intl.DateTimeFormat("zh-TW", {
            hour: "numeric",
            minute: "numeric",
          }).format(new Date(weatherElement.observationTime))}{" "}
          <RefreshIcon />
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
