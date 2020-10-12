import { ResourceStore } from 'i18next';
import React from 'react'
import { withTranslation } from 'react-i18next';

const QRZCOM_XMLDATA_URL = 'https://xmldata.qrz.com/xml/current/'
const axios = require('axios').default;
const xml2js = require('xml2js')
const LOCAL_STORE_KEY = 'CALL_LOOKUP_APIKEY'
class CallLookup extends React.Component {

  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.qrzLogin = this.qrzLogin.bind(this);
    this.doLookup = this.doLookup.bind(this);
    this.qrzLookup = this.qrzLookup.bind(this);

    let credentials = localStorage.getItem(LOCAL_STORE_KEY)
    if (credentials === null)
      credentials = { apikey: "", username: "", password: "" }
    else
      credentials = JSON.parse(credentials)

    this.state = {
      ...credentials,
      ...{
        callsign: "",
        lookup_results: { name: "", country: "", city: "" },
        input_username: "",
        input_password: "",
        errormessage: "",
        button_login_loading: false,
        button_lookup_loading: false
      }
    }
  }

  async doLogin() {
    this.setState({ errormessage: "", button_login_loading: true })
    try {
      const res = await this.qrzLogin(this.state.input_username, this.state.input_password)
      if (res.error)
        throw Error(res.error)

      let credentials = { apikey: res.apikey, username: this.state.input_username, password: this.state.input_password }
      this.setState(credentials)
      localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(credentials))
    } catch (err) {
      this.setState({ errormessage: err.message, apikey: "", username: "", password: "" })
      localStorage.removeItem(LOCAL_STORE_KEY)
    } finally {
      this.setState({ button_login_loading: false })
    }
  }

  async doLookup() {
    if (this.props.onCountryChanged)
      this.props.onCountryChanged(null)

    this.setState({
      'errormessage': "",
      'lookup_results': { name: "", city: "", country: "" },
      'button_lookup_loading': true
    })

    try {
      let res = await this.qrzLookup(this.state.callsign, this.state.apikey)
      if (res.error) {
        if (res.error === "INVALID_KEY") {
          res = await this.qrzLogin(this.state.username, this.state.password)
          if (res.error) {
            this.setState({ apikey: "", username: "", password: "" })
            localStorage.removeItem(LOCAL_STORE_KEY)
            throw Error(res.error)
          }

          const apikey = res.apikey
          this.setState({ apikey: apikey })
          let credentials = { apikey: res.apikey, username: this.state.username, password: this.state.password }
          localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(credentials))
          res = await this.qrzLookup(this.state.callsign, apikey)
          if (res.error)
            throw Error(res.error)
        } else {
          throw Error(res.error)
        }
      }

      this.setState({ 'lookup_results': res })

      if (this.props.onCountryChanged)
        this.props.onCountryChanged(res.country || null)
    } catch (err) {
      this.setState({ errormessage: err.message })
    } finally {
      this.setState({ button_lookup_loading: false })
    }
  }

  async qrzLogin(username, password) {

    try {
      let res = await axios.get(QRZCOM_XMLDATA_URL,
        { params: { username: username, password: password } })

      if (res.status === 200) {
        let jsonResponse = await xml2js.parseStringPromise(res.data, { explicitArray: false, ignoreAttrs: true })

        this.qrzValidateResponse(jsonResponse)

        if (jsonResponse.QRZDatabase.Session.Error)
          throw Error(jsonResponse.QRZDatabase.Session.Error)

        if (jsonResponse.QRZDatabase.Session.Key) {
          return { apikey: jsonResponse.QRZDatabase.Session.Key }
        } else {
          throw Error("Could not find API Key")
        }
      } else {
        throw Error(res.error) || Error("Unknown error")
      }
    } catch (error) {
      return { error: error.message }
    }
  }

  qrzValidateResponse(qrzResponse) {
    if (!qrzResponse.QRZDatabase)
      throw Error("QRZDatabase property not found")

    if (!qrzResponse.QRZDatabase.Session)
      throw Error("QRZDatabase.Session property not found")
  }

  async qrzLookup(callsign, apikey) {
    let httpres = await axios.get(QRZCOM_XMLDATA_URL, { params: { s: apikey, callsign: callsign } })

    try {
      if (httpres.status === 200) {
        let res = await xml2js.parseStringPromise(httpres.data, { explicitArray: false, ignoreAttrs: true })

        this.qrzValidateResponse(res)

        if (res.QRZDatabase.Session.Error) {
          if (["Session Timeout", "Invalid session key"].includes(res.QRZDatabase.Session.Error)) {
            throw Error("INVALID_KEY")
          } else {
            throw Error(res.QRZDatabase.Session.Error)
          }
        } else {
          const lookup_results = {
            name: (res.QRZDatabase.Callsign.fname || "") + " " + (res.QRZDatabase.Callsign.name || ""),
            city: (res.QRZDatabase.Callsign.addr2 || "") + ", " + (res.QRZDatabase.Callsign.state || ""),
            country: res.QRZDatabase.Callsign.country || ""
          }
          return lookup_results;
        }
      } else {
        throw Error(httpres.error) || Error("error")
      }
    } catch (err) {
      return { error: err.message }
    }
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
                onClick={this.doLogin}>
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
        <div className="card-header-icon">
          <span className="icon ">
            <i className="fas fa-id-card"></i>
          </span>
        </div>
      </div>
      <div className="card-content">
        <div className="content">
          <div className="field has-addons has-addons-fullwidth is-fullwidth">
            <div className="control is-fullwidth is-small ">
              <input type="text" name="callsign" className=" is-small  input is-fullwidth"
                value={this.state.callsign} onChange={this.handleInput}
                placeholder={this.props.t('CLOOKUP.CALLSIGN_PLACEHOLDER')}></input>
            </div>
            <div className="control">
              <button className={"button is-small is-primary is-fullwidth " + (this.state.button_lookup_loading ? "is-loading" : "")} type="button" onClick={this.doLookup} name="doLookup">{this.props.t('CLOOKUP.LOOKUP')}</button>
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