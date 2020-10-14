import React from 'react'

function MyCard(props) {
  return <div className="card">
    <div className="card-header has-background-primary-dark has-text-dark">
      <div className="card-header-title has-text-dark">
        {props.title}
      </div>
      <div className="card-header-icon">
        <span className="icon ">
          <i className={"fas fa-" + props.icon}></i>
        </span>
      </div>
    </div>

    <div className="card-content">
      {props.children}
    </div>
  </div>
}

export { MyCard }


// import { MyCard } from '../mycard'

// return <MyCard title= icon="sun">

// </MyCard>