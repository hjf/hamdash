import React from 'react'
import { withTranslation } from 'react-i18next';
const QRZCOM_XMLDATA_URL = 'https://xmldata.qrz.com/xml/current/'
const axios = require('axios').default;
const xml2js = require('xml2js')

class CallLookup extends React.Component {

  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.qrzLogin = this.qrzLogin.bind(this);
    this.qrzLookup = this.qrzLookup.bind(this);

    let credentials = localStorage.getItem("CALL_LOOKUP_APIKEY")
    if (credentials === null)
      credentials = { apikey: "" }
    else
      credentials = JSON.parse(credentials)

    this.state = credentials
    this.state.callsign = ""
    this.state.lookup_results = { name: "", country: "", city: "" }
    this.state.input_username = ""
    this.state.input_password = ""
    this.state.waiting = false
    this.state.errormessage = ""
  }

  componentDidMount() {

  }

  async qrzLogin() {
    this.setState({ errormessage: "" })
    this.setState({ waiting: true })
    let rv = {}
    try {
      let res = await axios.get(QRZCOM_XMLDATA_URL,
        {
          params: {
            username: this.state.input_username,
            password: this.state.input_password
          }
        })

      if (res.status === 200) {
        let jsonResponse = await xml2js.parseStringPromise(res.data, { explicitArray: false, ignoreAttrs: true })
        console.log(jsonResponse)
        if (jsonResponse.QRZDatabase && jsonResponse.QRZDatabase.Session && jsonResponse.QRZDatabase.Session.Error)
          throw jsonResponse.QRZDatabase.Session.Error

        if (jsonResponse.QRZDatabase && jsonResponse.QRZDatabase.Session && jsonResponse.QRZDatabase.Session.Key) {
          let apikey = { apikey: jsonResponse.QRZDatabase.Session.Key }
          localStorage.setItem('CALL_LOOKUP_APIKEY', JSON.stringify(apikey))
          this.setState(apikey)
        }
        throw "Could not find API Key"
      }
      throw res.error || "error"

    } catch (error) {
      this.setState({ errormessage: error })
    }
    this.setState({ waiting: false })
    return rv;
  }

  async qrzLookup() {
    this.setState({ errormessage: "" })
    this.setState({ waiting: true })
    let rv = {}
    try {
      let res = await axios.get(QRZCOM_XMLDATA_URL,
        {
          params: {
            s: this.state.apikey,
            callsign: this.state.callsign
          }
        })

      if (res.status === 200) {
        let jsonResponse = await xml2js.parseStringPromise(res.data, { explicitArray: false, ignoreAttrs: true })
        console.log(jsonResponse)
        if (jsonResponse.QRZDatabase && jsonResponse.QRZDatabase.Session && jsonResponse.QRZDatabase.Session.Error)
          throw jsonResponse.QRZDatabase.Session.Error

        this.setState({
          lookup_results: {
            name: (jsonResponse.QRZDatabase.Callsign.fname || "") + " " + (jsonResponse.QRZDatabase.Callsign.name || ""),
            city: (jsonResponse.QRZDatabase.Callsign.addr2 || "") + ", " + (jsonResponse.QRZDatabase.Callsign.state || ""),
            country: jsonResponse.QRZDatabase.Callsign.country || ""
          }
        })
      }
      throw res.error || "error"

    } catch (error) {
      console.log(error)
      this.setState({ errormessage: error })
    }
    this.setState({ waiting: false })
  }


  render() {
    if (this.state.apikey === "") {
      return <div className="component outline">
        <h1>{this.props.t('CLOOKUP.TITLE')}</h1>
        <p>{this.props.t('CLOOKUP.EXPLAIN')}<a href="https://qrz.com/">QRZ.com</a>.</p>
        <form action="#">
          <p>
            <label htmlFor="username">{this.props.t('CLOOKUP.USERNAME')}</label>
            <input type="text" name="input_username" value={this.state.input_username} onChange={this.handleInput}></input>
          </p>
          <p>
            <label htmlFor="password">{this.props.t('CLOOKUP.PASSWORD')}</label>
            <input type="password" name="input_password" value={this.state.input_password} onChange={this.handleInput} ></input>
          </p>
          <p> <button type="button" name="doValidateQRZ" onClick={this.qrzLogin}>{this.props.t('CLOOKUP.LOGIN')}</button></p>
          <p className="error">{this.state.errormessage}</p>
        </form>
      </div>
    }
    return <div className="component outline">
      <h1>{this.props.t('CLOOKUP.TITLE')}</h1>
      <form>
        <p class="clookup_form">
          {/* <label htmlFor="callsign">{this.props.t('CLOOKUP.CALLSIGN')}</label> */}
          <input type="text" name="callsign"
            value={this.state.callsign} onChange={this.handleInput}
            placeholder={this.props.t('CLOOKUP.CALLSIGN_PLACEHOLDER')}></input>
          <button type="button" onClick={this.qrzLookup} name="doLookup">{this.props.t('CLOOKUP.LOOKUP')}</button>
        </p>
      </form>
      <div className="lookupResults">
        <p><i>Name</i><span class="tcell"> {this.state.lookup_results.name} </span></p>
        <p><i>City</i><span> {this.state.lookup_results.city}</span> </p>
        <p><i>Country</i> <span>{this.state.lookup_results.country}</span> </p>
      </div>
    </div>
  }

  handleInput(e) {
    const target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
}

export default withTranslation()(CallLookup);