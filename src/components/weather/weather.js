import React from 'react'
import { withTranslation } from 'react-i18next';

const Maidenhead = require('maidenhead')
const axios = require('axios').default;
const metarp = require('metar-parser')

const DATA_URL_BASE = 'https://9992sjmz70.execute-api.sa-east-1.amazonaws.com/default/getMetarByLatLong'


class Weather extends React.Component {
  constructor(props) {
    super(props)
    this.state = { weather: null, expires: new Date(0), error: "" }
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      this.refresh();
    }, 60000);
    this.refresh();
  }


  render() {

    return <span>
      {!this.props.home &&
        this.props.t('WEATHER.NO_LOCATION_SET')
      }
      {!this.state.weather && !this.error &&
        this.props.t('WEATHER.NO_DATA')
      }
      {this.state.weather &&
        this.state.weather.temp_c + "ºC " +
        this.state.weather.wind_kph + "Km/h " + this.state.weather.wind_direction + " " +
        this.state.weather.pressure_mb + "hPa"
      }
      {
        this.error
      }
    </span>

    // return <div className="card">
    // <div className="card-header">
    //   <div className="card-header-title">
    //     {this.props.t('WEATHER.TITLE')}
    //   </div>
    // </div>
    // <div className="card-content ">

    //   {!this.props.home &&
    //     this.props.t('WEATHER.NO_LOCATION_SET')
    //   }
    //   {this.state.weather &&
    //     this.state.weather.temp_c + "ºC " +
    //     this.state.weather.wind_kph + "Km/h " + this.state.weather.wind_direction + " " +
    //     this.state.weather.pressure_mb + "hPa"
    //   }
    //   {
    //     this.error
    //   }
    // </div>
    // </div>
  }

  async refresh() {
    if (!this.props.home) {
      console.log("home not set")

      return
    }

    if (this.state.expires > new Date()) {
      console.log("weather data not expired yet")
      return
    }

    let latlon = Maidenhead.toLatLon(this.props.home)
    let lat = latlon[0].toFixed(2)
    let lon = latlon[1].toFixed(2)
    try {
      
      let res = await axios.get(DATA_URL_BASE, { params: { lat: lat, lon: lon } });
      if (res.status === 200) {
        if (res.data.error) {

          if (res.data.error === "{}" || res.data.error === '""') {
            this.state.error = this.props.t('WEATHER.NODATA')

          } else {
            this.setState({ error: res.data.error })
          }
        } else {

          if (res.data.metar) {
            let parsed = metarp(res.data.metar)
            let winddir = ""
            try {
              if (parsed.wind.direction) {
                let winddirs = this.props.t('WEATHER.WINDS').split(",")
                if (winddirs.length === 16) {
                  winddir = winddirs[Math.round(parsed.wind.direction / 24.0)]
                }
              }
            } catch (err) {
              console.log(err)
            }
            this.setState({
              weather: {
                temp_c: parsed.temperature.celsius,
                temp_f: parsed.temperature.fahrenheit,
                wind_mph: parsed.wind.speedMps,
                wind_kt: parsed.wind.speedKt,
                wind_kph: Math.round(parsed.wind.speedKt * 1.854),
                wind_direction: winddir,
                pressure_mb: parsed.altimeter.millibars
              }
            })
            this.setState(
              {
                expires: new Date(Date.now() + 1000 * 60)
              }
            )
            return
          }
        }
      }

    } catch (error) {
      this.setState({ error: JSON.stringify(error) })
    }

  }
}

export default withTranslation()(Weather);
