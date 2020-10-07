import React from 'react'
import { withTranslation } from 'react-i18next';
import { Map, Marker, TileLayer, Polyline } from 'react-leaflet'
import Maidenhead from 'maidenhead'

const countries_by_code = require("./countries_by_code.json")
const countries_by_name = require("./countries_by_name.json")
const position = [0, 0]

class SmartMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {

  }
  render() {
    console.log(this.leafletElement)
    const home_marker = this.props.home ? Maidenhead.toLatLon(this.props.home) : null
    let secondary_marker = null
    if (this.props.country_by_name) {
      let country = this.props.country_by_name.toUpperCase()
      if (country) {
        let cbyname = countries_by_name[country]
        if (cbyname)
          secondary_marker = cbyname.coords
      }
    }
    let distance = null
    let remote_locator = null


    if (home_marker && secondary_marker && this.refs.map) {
      home_marker[0] = Number(home_marker[0])
      home_marker[1] = Number(home_marker[1])
      secondary_marker[0] = Number(secondary_marker[0])
      secondary_marker[1] = Number(secondary_marker[1])
      distance = Math.round(this.refs.map.leafletElement.distance(home_marker, secondary_marker) / 1000)
      remote_locator = (new Maidenhead(secondary_marker[0], secondary_marker[1], 3)).locator
    }

    return <div className="card">
      <div className="card-header">
        <div className="card-header-title">
          {this.props.t('MAP.MAP_TITLE')}
        </div>
      </div>

      <div className="card-content">


        <Map ref='map' center={position} zoom={1} className="leaflet-container">

          {/* <TileLayer
  attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
/> */}
          <TileLayer

            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
          // attribution="&copy;
          //  <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          {/* Home marker */}
          {home_marker != null &&
            < Marker position={home_marker} />
          }

          {/* Extra marker */}
          {secondary_marker != null &&
            < Marker position={secondary_marker} />
          }


          {
            distance && <Polyline positions={[
              home_marker, secondary_marker
            ]} color={'red'} />
          }
        </Map>
        {distance &&
          this.props.t("MAP.MAP_DISTANCE", { locator: remote_locator, distance: distance, km_or_mi: "Km" })
        }

      </div>
    </div >

  }
}

export default withTranslation()(SmartMap);