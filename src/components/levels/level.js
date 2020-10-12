import React from 'react';

function Level(props) {
  return <nav className="level">
    {props.data.map((x) => {
      return <LevelItem title={x.title} value={x.value} key={x.title} />
    })}
  </nav>
}

function LevelItem(props) {
  return <div class="level-item has-text-centered">
    <div>
      <p class="heading">{props.title}</p>
      <p class="title">{props.value}</p>
    </div>
  </div>
}
export { Level, LevelItem };