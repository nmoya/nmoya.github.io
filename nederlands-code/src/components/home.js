import React from 'react';
import {
    Link,
} from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Welkom! Kies jouew werkworden collectie:</h1>
            {/* Remember to give different URLs to each button and add to the router above */}
            {/* <Link to="/basiswerkwoorden"><button class="btn btn-primary" type="submit">Basiswerkwoorden (Oranje)</button></Link> */}
            <br></br><br></br><br></br>
            <Link to={`/werkworden`}><button class="btn btn-primary" type="submit">Basiswerkwoorden (Oranje)</button></Link>
            <br></br>
            <br></br>
            <Link to={`/h1`}><button class="btn btn-primary" type="submit">Hoofdstuck 1 werkworden</button></Link>
            <br></br>
            <br></br>
            <Link to={`/h2`}><button class="btn btn-primary" type="submit">Hoofdstuck 2 werkworden</button></Link>
            <br></br>
            <br></br>
            <Link to={`/h3`}><button class="btn btn-primary" type="submit">Hoofdstuck 3 werkworden</button></Link>
        </div>
    );
}

export default Home;