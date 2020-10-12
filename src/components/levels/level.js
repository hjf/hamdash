import React from 'react';

function Level(props) {
  return <nav className="level">
    {props.data.map((x) => {
      return <LevelItem title={x.title} value={x.value} key={x.title} />
    })}
  </nav>
}

function LevelItem(props) {
  return <div className="level-item has-text-centered">
    <div>
      <p className="heading">{props.title}</p>
      <p className="title">{props.value}</p>
    </div>
  </div>
}
export { Level, LevelItem };