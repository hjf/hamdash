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
    this.clickHandler = this.clickHandler.bind(this);

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

    const filter = this.state.filter ? this.state.filter.toUpperCase() : ""
    let filteredOptions = this.props.options.filter((option) => (filter === "" || option.value.toUpperCase().includes(filter)) && cnt++ < this.props.maxcnt)

    this.setState({ filteredOptions: filteredOptions })
  }

  onKeyDown(e) {
    if (e.key === "Escape")
      this.clickHandler(null)

    else if (e.key === "Enter")
      this.clickHandler(this.state.filteredOptions[this.state.selectedIndex].key)

    else {
      let nextSelectedIndex = this.state.selectedIndex
      if (e.key === 'ArrowDown')
        nextSelectedIndex++
      else if (e.key === 'ArrowUp')
        nextSelectedIndex--

      const cmax = Math.min(this.state.filteredOptions.length, this.props.maxcnt)

      if (nextSelectedIndex < 0) nextSelectedIndex = 0
      else if (nextSelectedIndex >= cmax) {
        nextSelectedIndex = cmax - 1
      }

      if (nextSelectedIndex !== this.state.selectedIndex)
        this.setState({ selectedIndex: nextSelectedIndex })
    }
  }

  render() {
    if (!this.props.modal) {
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
          <PanelItems options={this.state.filteredOptions} selectedIndex={this.state.selectedIndex} handler={this.clickHandler} />
        </div>
      </div>;
    } else {

      return <div className="modal is-active">
        <div onClick={this.clickHandler} className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title}</p>

            <button onClick={this.clickHandler} className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body filterable-panel-body " >
            <input className="input" type="text" placeholder=""
              ref={(input) => { this.filterInput = input; }}
              name="filter" value={this.state.filter} onChange={this.handleInput} onKeyDown={this.onKeyDown} />
            <PanelItems options={this.state.filteredOptions} selectedIndex={this.state.selectedIndex} handler={this.clickHandler} />
          </section>
          {/* <footer className="modal-card-foot">
            <button className="button is-success">Save changes</button>
            <button className="button">Cancel</button>
          </footer> */}
        </div>
      </div>;
    }
  }

  clickHandler(e) {
    if (this.props.parentHandler) {
      let index = null

      if (e && e.target && e.target.getAttribute)
        index = e.target.getAttribute("data-index");

      this.props.parentHandler(index)
    }
  }
}

function PanelItems(props) {
  let i = 0;
  return props.options.map((c) => {
    return <a href="#"
      className={" panel-block " + (i++ === props.selectedIndex ? "is-active" : "")}
      onClick={props.handler}
      data-index={c.key}
      key={c.key} > {c.value}</ a >
  })
}

FilterablePanel.defaultProps = {
  maxcnt: 8,
  modal: false
}

export default withTranslation()(FilterablePanel);
