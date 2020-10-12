import React from 'react'
import { withTranslation } from 'react-i18next';
import { Map, Marker, TileLayer } from 'react-leaflet'
import { GeodesicLine } from 'react-leaflet-geodesic'
import Maidenhead from 'maidenhead'
import FilterablePanel from '../filterablepanel/filterablepanel'

//const countries_by_code = require("./countries_by_code.json")
const countries_by_name = require("./countries_by_name.json")
// const position = [0, 0]

class SmartMap extends React.Component {
  constructor(props) {
    super(props)

    const countries = []

    let i = 0
    for (const country of Object.keys(countries_by_name))
      countries.push({ 'key': i++, 'value': country })

    this.state = {
      remote_locator: null,
      countryLookup: false,
      countries: countries,
      darkMode: false
    }

    this.handleInput = this.handleInput.bind(this);
    this.closeCountryLookup = this.closeCountryLookup.bind(this);
    this.openCountryLookup = this.openCountryLookup.bind(this);
    this.darkModeListener = this.darkModeListener.bind(this);
  }

  handleInput(e) {
    const target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  lookupCountryByName(countryName) {
    if (!countryName)
      return null
    const ucname = countryName.toUpperCase().trim();
    const foundCountry = countries_by_name[ucname]

    if (!foundCountry)
      return ""

    return (new Maidenhead(...foundCountry.coords, 3)).locator
  }

  componentDidMount() {
    if (this.props.remote_locator)
      this.setState({ remote_locator: this.props.remote_locator || "" })
    else if (this.props.remote_locator_by_country_name)
      this.setState({ remote_locator: this.lookupCountryByName(this.props.remote_locator_by_country_name) })

    const mm = window.matchMedia('(prefers-color-scheme: dark)')
    this.setState({ darkMode: mm.matches })
    this.darkModeListenerRef = mm.addEventListener("change", this.darkModeListener)

  }

  componentWillUnmount() {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener("change", this.darkModeListener)
  }

  darkModeListener(e) {
    this.setState({ darkMode: e.matches })

  }

  componentDidUpdate(prevProps) {
    if (prevProps.remote_locator !== this.props.remote_locator) {
      this.setState({ remote_locator: this.props.remote_locator || "" })
    }

    if (prevProps.remote_locator_by_country_name !== this.props.remote_locator_by_country_name) {
      this.setState({ remote_locator: this.lookupCountryByName(this.props.remote_locator_by_country_name) })
    }
  }

  render() {
    const home_marker = this.props.home ? Maidenhead.toLatLon(this.props.home) : null
    let secondary_marker = null
    let bearing = null
    let distance = null

    if (Maidenhead.valid(this.props.home) && Maidenhead.valid(this.state.remote_locator)) {
      try {
        secondary_marker = Maidenhead.toLatLon(this.state.remote_locator)
        const remotemh = new Maidenhead()
        remotemh.locator = this.state.remote_locator
        const homemh = new Maidenhead()
        homemh.locator = this.props.home
        bearing = homemh.bearingTo(remotemh)
        distance = Math.round(homemh.distanceTo(remotemh))
      }
      catch (err) {
        console.error(err)
      }
    }

    return <div className="card">
      <div className="card-header">
        <div className="card-header-title">
          {this.props.t('MAP.MAP_TITLE')}
        </div>
        <div className="card-header-icon">
          <span className="icon ">
            <i className="fas fa-globe"></i>
          </span>
        </div>
      </div>

      <div className="card-content">
        <div className="content">
          <Map ref='map' center={home_marker} zoom={1} className="leaflet-container">

            {this.state.darkMode && <TileLayer
              url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
              attribution=''
            />
              // &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
              //   
            }
            {!this.state.darkMode && <TileLayer

              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="" />
              // attribution="&copy;
              //  <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            }
            {/* Home marker */}
            {home_marker != null &&
              < Marker position={home_marker} />
            }

            {/* Extra marker */}
            {secondary_marker != null &&
              < Marker position={secondary_marker} />
            }

            {
              distance && <GeodesicLine positions={[
                home_marker, secondary_marker
              ]} options={{
                weight: 2,
                opacity: 1,
                color: 'red',
              }} />
            }

          </Map>
        </div>
        <div className="content">
          <div className="level">
            <div className="level-left">

              <div className="level-item">
                <label>Home: <b>{this.props.home}</b></label>
              </div>

              <div className="level-item">
                <label htmlFor="remote_locator">Remote:</label>
              </div>
              <div className="level-item">

                <div className="field">
                  <div className="control">
                    <input
                      name="remote_locator"
                      className="input is-primary is-small"
                      type="text"
                      placeholder="Enter locator"
                      value={this.state.remote_locator || ""} onChange={this.handleInput} />
                  </div>
                </div>
              </div>
              <div className="level-item">
                <div className="control">
                  <button className="button is-small" onClick={this.openCountryLookup}>
                    <i className="fas fa-search" ></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="level-right">

              <div className="level-item">
                {(
                  this.props.t("MAP.MAP_DISTANCE", { locator: this.state.remote_locator, distance: distance || "N/A", km_or_mi: distance ? "Km" : "" }))
                }
              </div>

              <div className="level-item">
                {(
                  this.props.t("MAP.BEARING", { bearing: bearing || "---" }))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        this.state.countryLookup &&
        <div className="modal is-active">
          <div className="modal-background" onClick={this.closeCountryLookup} ></div>



          <FilterablePanel
            options={this.state.countries}
            parentHandler={this.closeCountryLookup}
            title="Country lookup"
            modal={true} />
        </div>
      }
    </div >
  }

  closeCountryLookup(selectedKey) {

    selectedKey = Number(selectedKey)
    this.setState({ countryLookup: false, remote_locator: null })
    if (selectedKey === null)
      return

    let country = this.state.countries.find(x => x.key === selectedKey)
    if (!country)
      return
    country = countries_by_name[country.value]
    if (country) {
      let mh = new Maidenhead(...country.coords, 3)
      this.setState({ remote_locator: mh.locator })
    }
  }

  openCountryLookup(e) {
    this.setState({ countryLookup: true })
  }

}

export default withTranslation()(SmartMap);