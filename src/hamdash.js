import React from 'react';
import { withTranslation } from 'react-i18next';

import './i18n';

import './css/reset.css';
import './css/style.scss';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'


import Login from './login'

import CallLookup from './components/calllookup/calllookup'
import WWV from './components/wwv/wwv'
import WWV_fetcher from './components/wwv/fetch'
const fetchers = []
fetchers.push(WWV_fetcher)

class HamDash extends React.Component {

  constructor(props) {
    super(props);
    this.loginCallback = this.loginCallback.bind(this);
    this.doLogout = this.doLogout.bind(this);

  }
  state = { wwv_data: null }
  doLogout() {
    localStorage.clear()
    this.setState({ "station_info": null })



  }
  loginCallback(stationinfo) {
    localStorage.setItem("station_info", JSON.stringify(stationinfo))
    this.setState({ "station_info": stationinfo })
  }
  render() {
    if (this.state.station_info == null) {
      return <Login parentCallback={this.loginCallback}></Login>
    }
    return <div className="bodywrapper">
      <nav className="nvar">
        <span className="logo">HamDash</span>
        <span className="filler"></span>
        <span class="stationInfo">
          {this.state.station_info.callsign}          <FontAwesomeIcon icon={faSignOutAlt} onClick={this.doLogout} />
        </span>
      </nav>

      <iframe title="map"
        width="64%" height="350"
        frameborder="0" scrolling="no"
        marginheight="0" marginwidth="0"
        className="component outline"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-153.63281250000003%2C-65.33855045088168%2C94.921875%2C87.7998337606272&amp;layer=mapnik"
      ></iframe>
      <div class="rightcol">
        <WWV wwv_data={this.state.wwv_data}></WWV>
        <CallLookup ></CallLookup>
      </div>
    </div>;
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
    setInterval(async () => {
      if (this.state.station_info)
        await this.refreshComponents()

    }, 60000)
  }
}

export default withTranslation()(HamDash);
