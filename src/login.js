import React from 'react'
import { withTranslation } from 'react-i18next';

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

  render() {
    return <section className="hero is-fullheight is-medium is-primary is-bold">
      <div className="hero-body">
        <div className="container">

          <div className="columns  is-centered "    >
            <div className="column is-half " >
              <h1 className="title" >{this.props.t('LOGIN.WELCOME')}</h1>
              <h2 >{this.props.t('LOGIN.WELCOME2')}</h2>
              <form action="#">
                <div className="field">
                  <label className="label" htmlFor="callsign">{this.props.t('LOGIN.CALLSIGN')}</label>
                  <div className="control  has-icons-left has-icons-right">
                    <input type="text" className={"input " + (this.state.validCallsign ? "is-success" : "is-danger")} name="callsign" value={this.state.callsign} onChange={this.handleInput}></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-user"></i>
                    </span>
                    <span className={"icon is-small is-right " + (this.state.validCallsign ? "is-hidden" : "")}>
                      <i className={"fas fa-exclamation-triangle "}></i>
                    </span>
                  </div>
                </div>
                <div className="field ">
                  <label className="label" htmlFor="locator">{this.props.t('LOGIN.LOCATOR')}</label>
                  <div className="control  has-icons-left has-icons-right">
                    <input className={"input " + (this.state.validCallsign ? "is-success" : "is-danger")} type="text" name="locator" value={this.state.locator} onChange={this.handleInput}></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-globe"></i>
                    </span>
                    <span className={"icon is-small is-right " + (this.state.validCallsign ? "is-hidden" : "")}>
                      <i className="fas fa-exclamation-triangle " ></i>
                    </span>
                  </div>

                </div>
                <div className="field">
                  <label className="label" htmlFor="language">{this.props.t('LOGIN.LANGUAGE')}</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select name="language" value={this.state.lang} onChange={this.changeLanguage} >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field ">
                  <div className="control ">
                    <button disabled={!(this.state.validCallsign && this.state.validLocator)}
                      className="button is-medium is-fullwidth " name="setData" onClick={this.doLogin}>{this.props.t('LOGIN.BUTTON')}</button>
                  </div>
                </div>
              </form>
              <div className="content">{this.props.t('LOGIN.PRIVACYPOLICY')}</div>

            </div>
          </div>
        </div>
      </div></section>
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
    let lang = e.target.value;
    this.setState({ lang: lang })
    this.props.i18n.changeLanguage(lang);

    localStorage.setItem("lang", lang)
  }
}

export default withTranslation()(Login);