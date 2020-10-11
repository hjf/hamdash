import React from 'react'
import { withTranslation } from 'react-i18next';
import dayjs from '../../time';

const timesync = require('timesync')

class NTPTime extends React.Component {

  ts = null
  intervalHandler = null

  constructor(props) {
    super(props);
    this.state = { offset: 0, localtime: " ", servertime: "fetching..." }
  }

  componentDidMount() {
    dayjs.locale(this.props.i18n.lng)

    this.ts = timesync.create({
      server: '//timeserver.hjf.com.ar/timesync',
      interval: 10000
    });

    this.ts.on('change', (offset) => {
      offset = Math.round(offset)
      this.setState({ offset: `${offset}` })
    });

    if (!this.intervalHandler)
      this.intervalHandler = setInterval(() => {
        if (this.ts) {
          this.setState({
            servertime: dayjs(this.ts.now()).utc().format("HH:mm:ss"),
            localtime: dayjs().format("LTS ddd l")
          })
        }
      }, 1000);
  }

  componentWillUnmount() {
    if (this.intervalHandler)
      clearInterval(this.intervalHandler)
  }


  render() {

    return <div className="card">
      <div className="card-header">
        <div className="card-header-title">
          {this.props.t('NTPTIME.TITLE')}
        </div>
      </div>
      <div className="card-content ">
        <div className="content "><h1>{this.state.servertime}</h1></div>
        <div className="content">{this.props.t('NTPTIME.LABEL_LOCAL_TIME')}: {this.state.localtime}</div>
        <div className="content">{this.props.t('NTPTIME.LABEL_TIME_ERROR', { offset: this.state.offset })}</div>
      </div>
    </div>

  }


}

export default withTranslation()(NTPTime);