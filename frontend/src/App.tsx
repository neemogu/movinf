import React from 'react';
import './App.css';
import HelloMessage from './components/HelloMessage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import FilmRouteWrapper from "./components/films/Film";
import FilterableFilmList from "./components/films/FilterableFilmList";
import FilmFormRouteWrapper from "./components/films/FilmForm"

function App() {
    return (
        <div className="App">
            <Router>
                <div className="header">
                    <nav>
                        <ul className="navigation">
                            <li>
                                <Link to="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/films">
                                    Films
                                </Link>
                            </li>
                            <li>
                                <Link to="/persons">
                                    Persons
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="content">
                    <Switch>
                        <Route exact path="/">
                            <HelloMessage/>
                        </Route>
                        <Route exact path="/films">
                            <FilterableFilmList/>
                        </Route>
                        <Route path="/films/new">
                            <FilmFormRouteWrapper/>
                        </Route>
                        <Route path="/films/edit/:id">
                            <FilmFormRouteWrapper/>
                        </Route>
                        <Route path="/films/:id">
                            <FilmRouteWrapper/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
