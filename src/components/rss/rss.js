import React from 'react';
import { withTranslation } from 'react-i18next';
import dayjs from '../../time'

let Parser = require('rss-parser');


class RSS extends React.Component {
  intervalHandler = null
  constructor(props) {
    super(props)
    this.state = { error: null, news: [], title: "" }
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (!this.intervalHandler)
      setInterval(() => {
        this.refresh();
      }, 60000);
    this.refresh();
  }

  componentWillUnmount() {
    if (this.intervalHandler)
      clearInterval(this.intervalHandler)
  }

  render() {

    return <div className="card">
      <div className="card-header">
        <div className="card-header-title">
          {this.state.title}
        </div>
        <div className="card-header-icon">
          <span className="icon ">
            <i className="fas fa-newspaper"></i>
          </span>
        </div>
      </div>
      <div className="card-content ">
        {this.state.news && this.state.news.map((x) => {
          return <NewsItem title={x.title} snippet={x.contentSnippet} key={x.guid} date={x.isoDate} link={x.link}/>
        })}
      </div>
    </div>

  }

  async refresh() {
    const parser = new Parser();

    try {
      let feed = await parser.parseURL('https://cors-anywhere.herokuapp.com/https://www.arrl.org/news/rss');

      this.setState({ news: feed.items, title: this.props.title || feed.title || "" })

      feed.items.forEach(item => {
        console.log(item)
      });

    } catch (error) {
      this.setState({ error: JSON.stringify(error) })
    }

  }
}

function NewsItem(props) {
  return <article className="media">
    <figure className="media-left">
      <p className="image is-64x64">
        <img src="https://bulma.io/images/placeholders/128x128.png" />
      </p>
    </figure>
    <div className="media-content">
      <div className="content">
        <p>
          <a href={props.link}><strong>{props.title}</strong></a> <small>by ARRL</small> <small>{dayjs(props.date).fromNow()}</small>
          <br />
          {props.snippet}
        </p>
      </div>
      <nav className="level is-mobile">
        <div className="level-left">
          <a className="level-item">
            <span className="icon is-small"><i className="fas fa-reply"></i></span>
          </a>
          <a className="level-item">
            <span className="icon is-small"><i className="fas fa-retweet"></i></span>
          </a>
          <a className="level-item">
            <span className="icon is-small"><i className="fas fa-heart"></i></span>
          </a>
        </div>
      </nav>
    </div>
    <div className="media-right">
      <button className="delete"></button>
    </div>
  </article>
}

export default withTranslation()(RSS);
