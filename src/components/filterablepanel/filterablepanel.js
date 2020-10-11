import React from 'react'
import { withTranslation } from 'react-i18next';

class FilterablePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredOptions: [],
      filter: "",
      selectedIndex: 0

    }

    this.handleInput = this.handleInput.bind(this);
    this.filterCountries = this.doFilterOptions.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

  }

  componentDidMount() {
    this.filterInput.focus();
    this.doFilterOptions()
  }

  handleInput(e) {
    const target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    if (name === "filter") {
      setTimeout(() => {
        this.doFilterOptions()
      }, 0);
    }
  }

  doFilterOptions() {
    let cnt = 0
    let filteredOptions = []

    let i = 0
    for (let option of this.props.options) {
      let cf = this.state.filter ? this.state.filter.toUpperCase() : ""
      if (cf === "" || option.toUpperCase().includes(cf)) {
        filteredOptions.push({ value: option, key: i })
        cnt++
      }
      if (cnt > this.props.maxcnt)
        break

      i++
    }

    this.setState({ filteredOptions: filteredOptions })
  }

  onKeyDown(e) {
    if (e.key === "Escape")
      this.notifyParent(null)

    else if (e.key === "Enter")
      this.notifyParent(this.state.filteredOptions[this.state.selectedIndex].key)

    else {
      let si = this.state.selectedIndex
      if (e.key === 'ArrowDown')
        si++
      else if (e.key === 'ArrowUp')
        si--

      const cmax = Math.min(this.state.filteredOptions.length, this.props.maxcnt)

      if (si < 0) si = 0
      else if (si >= cmax) {
        si = cmax - 1
      }

      if (si !== this.state.selectedIndex)
        this.setState({ selectedIndex: si })
    }
  }

  render() {
    let options = []

    let i = 0


    if (!this.props.modal) {
      for (let c of this.state.filteredOptions) {
        options.push(<a href="#"
          className={"panel-block " + (i === this.state.selectedIndex ? "is-active" : "")}
          onClick={() => { this.notifyParent(c.key) }}
          key={c.key} > {c.value}</ a >)
        i++
      }
      return <div className="panel">
        <p className="panel-heading">{this.props.title}</p>
        <div className="panel-block">
          <p className="control has-icons-left">
            <input className="input" type="text" placeholder=""
              ref={(input) => { this.filterInput = input; }}
              name="filter" value={this.state.filter} onChange={this.handleInput} onKeyDown={this.onKeyDown} />
            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
        <div >
          {options}
        </div>
      </div>;
    } else {
      for (let c of this.state.filteredOptions) {
        options.push(<a href="#" style={{ borderBottom: "1px solid #333" }}
          className={" panel-block " + (i === this.state.selectedIndex ? "is-active" : "")}
          onClick={() => { this.notifyParent(c.key) }}
          key={c.key} > {c.value}</ a >)
        i++
      }
      return <div className="modal is-active">
        <div onClick={() => { this.notifyParent(null) }} className="modal-background" style={{ backgroundColor: "black", opacity: 0.8 }}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title}</p>

            <button onClick={() => { this.notifyParent(null) }} className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body" style={{ padding: 0, backgroundColor: "#121212" }}>
            <input className="input" type="text" placeholder=""
              ref={(input) => { this.filterInput = input; }}
              name="filter" value={this.state.filter} onChange={this.handleInput} onKeyDown={this.onKeyDown} />
            {options}
          </section>
          {/* <footer className="modal-card-foot">
            <button className="button is-success">Save changes</button>
            <button className="button">Cancel</button>
          </footer> */}
        </div>
      </div>;
    }

  }


  notifyParent(index) {
    if (this.props.parentHandler)
      this.props.parentHandler(index)
  }
}

FilterablePanel.defaultProps = {
  maxcnt: 2000,
  modal: false
}

export default withTranslation()(FilterablePanel);
