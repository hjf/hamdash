import React from 'react'
import { withTranslation } from 'react-i18next';
import { getBrowserLanguage } from './util'

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.i18n.lng,
      callsign: '',
      locator: '',
      validLocator: false,
      validCallsign: false

    };

    this.changeLanguage = this.changeLanguage.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  componentDidMount() {
    //try to get the user's prefered language. cut it to lang only with no country for...reasons
    //TODO: support fort es, es-ES, es-AR...



  }
  render() {
    return <div className="center-screen"><div className="outline login_form_wrapper " >
      <h1 >{this.props.t('LOGIN.WELCOME')}</h1>
      <h2 >{this.props.t('LOGIN.WELCOME2')}</h2>
      <form className="login_form" action="#">
        <p>
          <label htmlFor="callsign">{this.props.t('LOGIN.CALLSIGN')}</label>
          <input type="text" className="callsign" name="callsign" value={this.state.callsign} onChange={this.handleInput}></input>
          <span className={this.state.validCallsign ? "valid" : "invalid"}>x</span>
        </p>
        <p>
          <label htmlFor="locator">{this.props.t('LOGIN.LOCATOR')}</label>
          <input type="text" name="locator" value={this.state.locator} onChange={this.handleInput}></input>
          <span className={this.state.validLocator ? "valid" : "invalid"}>x</span>

        </p>
        <p>
          <label htmlFor="language">{this.props.t('LOGIN.LANGUAGE')}</label>
          <select name="language" value={this.state.lang} onChange={this.changeLanguage} >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </p>
        <p>
          <button name="setData" onClick={this.doLogin}>{this.props.t('LOGIN.BUTTON')}</button>
        </p>
      </form>
      <div>{this.props.t('LOGIN.PRIVACYPOLICY')}</div>

    </div>
    </div>

  };

  handleInput(e) {
    const target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === "locator") {
      let letters = value.split('')
      value = ""

      //locators need AA00bb99CC99dd11... AA00 is the minimum
      for (let i = 0; i < letters.length; i++) {
        if (i < 4)
          value += letters[i].toUpperCase()
        else if (i < 8)
          value += letters[i].toLowerCase()
        else if (i < 12)
          value += letters[i].toUpperCase()
      }

      //validate locator
      let locatorRegex = /^[A-Za-z]{2}[0-9]{2}([A-Za-z]{2}|[A-Za-z]{2}[0-9]{2})*$/
      this.setState({
        "validLocator": locatorRegex.test(value)
      })

    }

    if (name === "callsign") {
      //callsigns all uppercase
      value = value.toUpperCase()

      //validate callsign
      let callsignRegex = /^[A-Z0-9]{0,2}[0-9][A-Z]+$/
      this.setState({
        "validCallsign": callsignRegex.test(value)
      })

    }

    this.setState({
      [name]: value
    });
  }

  doLogin(e) {
    if (this.props.parentCallback)
      this.props.parentCallback({ callsign: this.state.callsign, locator: this.state.locator })
  }

  changeLanguage(e) {
    console.log("vuidhnsuoc")
    let lang = e.target.value;
    this.setState({ lang: lang })
    this.props.i18n.changeLanguage(lang);

    localStorage.setItem("lang", lang)
  }
}

export default withTranslation()(Login);