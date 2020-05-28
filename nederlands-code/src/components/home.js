import React from 'react'
import {
  Link
} from 'react-router-dom'
import './home.css'

function Home () {
  return (
    <div className="container">
      <div className="row">
        <div className="col"><h1>Welkom! Kies jouw opdracht:</h1></div>
      </div>
      <div className="row">
        <div className="col">
          <h2>Werkworden</h2>
          {/* Remember to give different URLs to each button and add to the router in App.js */}
          <ul className="list-unstyleld">
            <li className="list-group-item list-group-item-action rounded-top"><Link to={'/werkwoorden/basis'}>Basiswerkwoorden (Oranje)</Link></li>
            <li className="list-group-item list-group-item-action"><Link to={'/werkwoorden/h1'}>Hoofdstuck 1 werkworden</Link></li>
            <li className="list-group-item list-group-item-action"><Link to={'/werkwoorden/h2'}>Hoofdstuck 2 werkworden</Link></li>
            <li className="list-group-item list-group-item-action rounded-bottom"><Link to={'/werkwoorden/h3'}>Hoofdstuck 3 werkworden</Link></li>
          </ul>
        </div>
        <div className="col">
          <h2 className="col">Vocabulaire</h2>
          <ul className="list-unstyleld">
            <li className="list-group-item list-group-item-action rounded-top rounded-bottom">Under construction</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
