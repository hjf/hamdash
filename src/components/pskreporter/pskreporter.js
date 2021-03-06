import React from 'react'
import { withTranslation } from 'react-i18next';
import { Level } from '../levels/level'
import { MyCard } from '../mycard'

const axios = require('axios').default;
const DATA_URL_BASE = 'https://170r8c5e4f.execute-api.sa-east-1.amazonaws.com/default/getSpots'

class PSKReporter extends React.Component {

  ts = null
  intervalHandler = null

  constructor(props) {
    super(props);
    this.state = { error: null, monitors: null, spottedMe: null, spottedByMe: null }
  }

  componentDidMount() {
    this.refresh();
    if (!this.intervalHandler)
      setInterval(() => {
        this.refresh();
      }, 6 * 60 * 1000);
  }

  componentWillUnmount() {
    if (this.intervalHandler)
      clearInterval(this.intervalHandler)
  }

  render() {

    return <MyCard title={this.props.t('PSKREPORTER.TITLE')} icon="binoculars">

      <Level data={
        [
          { title: this.props.t('PSKREPORTER.MONITORS'), value: this.state.monitors },
          { title: this.props.t('PSKREPORTER.SPOTTED_ME'), value: this.state.spottedMe },
          { title: this.props.t('PSKREPORTER.SPOTTED_BY_ME'), value: this.state.spottedByMe },
        ]
      }></Level>
      <p className="is-pulled-right is-italic">{this.props.t('PSKREPORTER.LINK')} <a href={"https://pskreporter.info/pskmap?callsign=" + this.props.callsign}>PSKReporter.com</a></p>
      <hr className="is-invisible " />

    </MyCard>

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
          this.setState(
            {
              monitors: res.data.data.monitors,
              spottedMe: res.data.data.spottedMe,
              spottedByMe: res.data.data.spottedByMe,
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