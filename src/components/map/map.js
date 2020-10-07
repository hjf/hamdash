import React from 'react'
import { withTranslation } from 'react-i18next';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import Maidenhead from 'maidenhead'

const countries_by_code = require("./countries_by_code.json")
const countries_by_name = require("./countries_by_name.json")
const position = [0, 0]

class SmartMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const homepos = this.props.home ? Maidenhead.toLatLon(this.props.home) : null
    let marker_by_country_name = null
    if (this.props.country_by_name) {
      let country = this.props.country_by_name.toUpperCase()
      if (country) {
        let cbyname = countries_by_name[country]
        if (cbyname)
          marker_by_country_name = cbyname.coords
      }
    }

    return <Map center={position} zoom={1} className="leaflet-container">

      {/* <TileLayer
  attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
/> */}
      <TileLayer

        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=""
      // attribution="&copy;
      //  <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />{homepos != null &&
        < Marker position={homepos} >

        </Marker>
      }

      {marker_by_country_name != null &&
        < Marker position={marker_by_country_name} color="red" >

        </Marker>
      }
    </Map>

  }
}

export default withTranslation()(SmartMap);