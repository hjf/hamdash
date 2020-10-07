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
    this.state.errormessage = ""
    this.state.button_login_loading = false
    this.state.button_lookup_loading = false
  }

  componentDidMount() {

  }

  async qrzLogin() {
    this.setState({ errormessage: "" })
    this.setState({ button_login_loading: true })
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
    this.setState({ button_login_loading: false })

  }

  async qrzLookup() {
    this.setState({ errormessage: "" })
    this.setState({ button_lookup_loading: true })
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
        if (jsonResponse.QRZDatabase && jsonResponse.QRZDatabase.Session && jsonResponse.QRZDatabase.Session.Error) {
          if (jsonResponse.QRZDatabase.Session.Error === "Session Timeout") {
            //TODO: auto relogin

            localStorage.removeItem("CALL_LOOKUP_APIKEY")
            let apikey = { apikey: '' }
            this.setState(apikey)
          }
          throw jsonResponse.QRZDatabase.Session.Error
        }

        this.setState({
          lookup_results: {
            name: (jsonResponse.QRZDatabase.Callsign.fname || "") + " " + (jsonResponse.QRZDatabase.Callsign.name || ""),
            city: (jsonResponse.QRZDatabase.Callsign.addr2 || "") + ", " + (jsonResponse.QRZDatabase.Callsign.state || ""),
            country: jsonResponse.QRZDatabase.Callsign.country || ""
          }
        })
        if (this.props.onCountryChanged)
          this.props.onCountryChanged(jsonResponse.QRZDatabase.Callsign.country || null)
      }
      throw res.error || "error"

    } catch (error) {
      console.log(error)
      this.setState({ errormessage: error })
    }
    this.setState({ button_lookup_loading: false })
  }


  render() {
    if (this.state.apikey === "") {
      return <div className="box">
        <h1 className="title">{this.props.t('CLOOKUP.TITLE')}</h1>
        <p>{this.props.t('CLOOKUP.EXPLAIN')}<a href="https://qrz.com/">QRZ.com</a>.</p>
        <form action="#">
          <div className="field">
            <label htmlFor="username" className="label">{this.props.t('CLOOKUP.USERNAME')}</label>
            <div className="control  has-icons-left">
              <input type="text" className="input" name="input_username" value={this.state.input_username} onChange={this.handleInput}></input>
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="password">{this.props.t('CLOOKUP.PASSWORD')}</label>
            <div className="control  has-icons-left has-icons-right">
              <input className="input" type="password" name="input_password" value={this.state.input_password} onChange={this.handleInput} ></input>
              <span className="icon is-small is-left">
                <i className="fas fa-key"></i>
              </span>
            </div>
          </div>
          <div className="control ">
            <div className="field ">
              <button className={"button is-primary is-fullwidth " + (this.state.button_login_loading ? "is-loading" : "")}
                type="button" name="doValidateQRZ"
                onClick={this.qrzLogin}>
                {this.props.t('CLOOKUP.LOGIN')}</button>
            </div>
          </div>
          <p className="error">{this.state.errormessage}</p>
        </form>
      </div>
    }
    return <div className="card">
      <div className="card-header">
        <div className="card-header-title">
          {this.props.t('CLOOKUP.TITLE')}
        </div>
      </div>
      <div className="card-content">
        <div className="content">
          <div className="field has-addons">
            <div className="control">
              <input type="text" name="callsign" className="input is-small"
                value={this.state.callsign} onChange={this.handleInput}
                placeholder={this.props.t('CLOOKUP.CALLSIGN_PLACEHOLDER')}></input>
            </div>
            <div className="control">
              <button className={"button is-primary is-small " + (this.state.button_lookup_loading ? "is-loading" : "")} type="button" onClick={this.qrzLookup} name="doLookup">{this.props.t('CLOOKUP.LOOKUP')}</button>
            </div>
          </div>
        </div>
        <table className="table is-fullwidth is-fullwidth">
          <tbody>
            <tr >
              <th>Name</th><td>{this.state.lookup_results.name}</td>
            </tr>
            <tr>
              <th>City</th><td>{this.state.lookup_results.city}</td>
            </tr>
            <tr>
              <th>Country</th><td>{this.state.lookup_results.country}</td>
            </tr>
            <tr>
              <td colSpan="2">{this.state.errormessage} </td>
            </tr>
          </tbody>
        </table>
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