import React from 'react';

function LevelItem(props) {
  return <div class="level-item has-text-centered">
    <div>
      <p class="heading">{props.title}</p>
      <p class="title">{props.value}</p>
    </div>
  </div>
}

export { LevelItem};