import React from 'react';
import { withTranslation } from 'react-i18next';

import './i18n';
import './time'
import './css/style.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import Login from './login'

import NTPTime from './components/ntptime/ntptime'
import Weather from './components/weather/weather'
import CallLookup from './components/calllookup/calllookup'
import SmartMap from './components/map/map'
import WWV from './components/wwv/wwv'
import WWV_fetcher from './components/wwv/fetch'
import PSKReporter from './components/pskreporter/pskreporter'
import RSS from './components/rss/rss'
const fetchers = []
fetchers.push(WWV_fetcher)

class HamDash extends React.Component {

  intervalHandler = null

  constructor(props) {
    super(props);
    this.state = { wwv_data: null, country_by_name: null }
    this.loginCallback = this.loginCallback.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.countryByNameCallback = this.countryByNameCallback.bind(this);
  }

  doLogout() {
    localStorage.clear()
    this.setState({ "station_info": null })
  }

  loginCallback(stationinfo) {
    localStorage.setItem("station_info", JSON.stringify(stationinfo))
    this.setState({ "station_info": stationinfo })
  }

  countryByNameCallback(countryName) {
    this.setState({ country_by_name: countryName })
  }

  render() {
    if (this.state.station_info == null) {
      return <Login parentCallback={this.loginCallback}></Login>
    }
    return <div>
      <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <div className="navbar-item">HamDash</div>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <p className="navbar-item">
              <b>
                <Weather home={this.state.station_info.locator} />
              </b>
            </p>

            <p className="navbar-item">
              {this.state.station_info.callsign}
            </p>
            <button className="button is-primary navbar-item" onClick={this.doLogout} >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>
      </nav>

      <section className="section">
        <div className="tile is-ancestor">
          <div className="tile is-vertical ">
            <div className="tile">
              <div className="tile is-parent is-vertical">
                <div className="tile is-child">
                  <SmartMap
                    home={this.state.station_info.locator}
                    remote_locator_by_country_name={this.state.country_by_name}
                  >
                  </SmartMap>
                </div>
                <div className="tile is-child">
                  <PSKReporter callsign={this.state.station_info.callsign} />
                </div>
                <div className="tile is-child">
                  <RSS />
                </div>
              </div>
            </div>
          </div>

          <div className="tile is-vertical ">
            <div className="tile">
              <div className="tile is-parent is-vertical">
                <div className="tile is-child ">
                  <NTPTime ></NTPTime>
                </div>
                <div className="tile is-child ">
                  <WWV wwv_data={this.state.wwv_data}></WWV>
                </div>
                <div className="tile is-child ">
                  <CallLookup onCountryChanged={this.countryByNameCallback}></CallLookup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
    </div >;
  }

  async refreshComponents() {
    for (let fetcher of fetchers) {
      let fetcher_data = await fetcher.fetch();
      let newstate = {}
      newstate[fetcher.FETCHER_KEY] = fetcher_data
      this.setState(newstate)
    }
  }

  componentDidMount() {
    let station_info = localStorage.getItem("station_info")
    if (station_info != null)
      station_info = JSON.parse(station_info)

    this.setState({ "station_info": station_info })

    this.refreshComponents()
    if (!this.intervalHandler)
      this.intervalHandler = setInterval(async () => {
        if (this.state.station_info)
          await this.refreshComponents()

      }, 60000)
  }

  componentWillUnmount() {
    if (this.intervalHandler)
      clearInterval(this.intervalHandler)
  }
}

export default withTranslation()(HamDash);
