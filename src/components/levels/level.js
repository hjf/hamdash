import React from 'react';
import { LevelItem } from './levelitem'

function Level(props) {
  return <nav className="level">
    {props.data.map((x) => { console.log(x); return <LevelItem title={x.title} value={x.value} key={x.title}   ></LevelItem> })}
  </nav>
}

export { Level};