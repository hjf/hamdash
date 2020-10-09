import React from 'react'
import { withTranslation } from 'react-i18next';
const axios = require('axios').default;
const DATA_URL_BASE = 'https://170r8c5e4f.execute-api.sa-east-1.amazonaws.com/default/getSpots'

class PSKReporter extends React.Component {

  ts = null

  constructor(props) {
    super(props);
    this.state = { error: null, monitors: null, spots: null }
  }

  componentDidMount() {
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, 6 * 60 * 1000);
  }

  render() {

    return <div className="card">
      <div className="card-header">
        <div className="card-header-title">
          {this.props.t('PSKREPORTER.TITLE')}
        </div>
      </div>

      <div className="card-content">
        {this.props.t('PSKREPORTER.MONITORS')}: {this.state.monitors}, {this.props.t('PSKREPORTER.SPOTS')}: {this.state.spots}
        <span style={{ "float": "right", "font-style":"italic" }}>{this.props.t('PSKREPORTER.LINK')} <a href={"https://pskreporter.info/pskmap?callsign=" + this.props.callsign}>PSKReporter.com</a></span>
      </div>
    </div >

  }

  async refresh() {
    this.setState({ error: null })
    if (!this.props.callsign) {
      console.log("callsign not set")
      return
    }

    try {
      let res
      // console.log(process.env.NODE_ENV)
      // let res = { "status": 200, "data": { "error": null, "data": { "monitors": 4904, "spots": 546, "monitors_per_mode": { "FT8": 4376, "JS8": 164, "CW": 21, "FT4": 222, "PSK31": 23, "JT65": 9, "OPERA": 22, "MSK144": 20, "WSPR": 3, "FST4W": 21, "ROS": 7, "FST4": 3, "JT9": 2, "JT6M": 3, "PI4": 2, "RTTY": 2, "CW (KY C": 1, "MFSK32": 1, "OLIVIA-8": 1, "CONTESTI": 1 }, "spots_per_band": { "10.1": 391, "5.4": 152 } } } }
      // if (process.env.NODE_ENV !== "development")
      res = await axios.get(DATA_URL_BASE, { params: { callsign: this.props.callsign } });
      if (res.status === 200) {
        if (res.data.error) {
          this.setState({ error: res.data.error })
        } else {
          console.log(res.data)
          this.setState(
            {
              monitors: res.data.data.monitors,
              spots: res.data.data.spots
            }
          )
        }
      }

    } catch (error) {
      this.setState({ error: JSON.stringify(error) })
    }
  }

}

export default withTranslation()(PSKReporter);

//{ "statusCode": 200, "body": { "error": null, "data": { "monitors": 4904, "spots": 546, "monitors_per_mode": { "FT8": 4376, "JS8": 164, "CW": 21, "FT4": 222, "PSK31": 23, "JT65": 9, "OPERA": 22, "MSK144": 20, "WSPR": 3, "FST4W": 21, "ROS": 7, "FST4": 3, "JT9": 2, "JT6M": 3, "PI4": 2, "RTTY": 2, "CW (KY C": 1, "MFSK32": 1, "OLIVIA-8": 1, "CONTESTI": 1 }, "spots_per_band": { "10.1": 391, "5.4": 152 } } } }