import React, {useState} from 'react';
import './App.css';
import HelloMessage from './components/HelloMessage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import FilmRouteWrapper from "./components/films/Film";
import FilterableFilmList from "./components/films/FilterableFilmList";
import FilmFormRouteWrapper from "./components/films/FilmForm"
import PersonRouteWrapper from "./components/persons/Person";
import FilterablePersonList from "./components/persons/FilterablePersonList";
import PersonFormRouteWrapper from "./components/persons/PersonForm";
import EntityRouteWrapper from "./components/simple/Entity";
import List from "./components/simple/List";
import FormRouteWrapper from "./components/simple/Form";

function App() {
    const [isLogged, setIsLogged] = useState<boolean>(false);

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
                            <li>
                                <Link to="/users">
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/countries">
                                    Countries
                                </Link>
                            </li>
                            <li>
                                <Link to="/studios">
                                    Studios
                                </Link>
                            </li>
                            <li>
                                <Link to="/languages">
                                    Languages
                                </Link>
                            </li>
                            {!isLogged ? (
                                <li className="login-register-nav">
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </li>
                            ) : ""}
                            {!isLogged ? (
                                <li className="login-register-nav">
                                    <Link to="/register">
                                        Register
                                    </Link>
                                </li>
                            ) : ""}
                        </ul>
                    </nav>
                </div>
                <div className="content">
                    <Switch>
                        <Route exact path="/">
                            <HelloMessage/>
                        </Route>
                        <Route exact path="/films">
                            <FilterableFilmList canEditOrAdd={true}/>
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
                        <Route exact path="/persons">
                            <FilterablePersonList canEditOrAdd={true}/>
                        </Route>
                        <Route path="/persons/new">
                            <PersonFormRouteWrapper/>
                        </Route>
                        <Route path="/persons/edit/:id">
                            <PersonFormRouteWrapper/>
                        </Route>
                        <Route path="/persons/:id">
                            <PersonRouteWrapper/>
                        </Route>
                        <Route exact path="/countries">
                            <List link="/countries" canEditOrAdd={true}/>
                        </Route>
                        <Route path="/countries/new">
                            <FormRouteWrapper link="/countries"/>
                        </Route>
                        <Route path="/countries/edit/:id">
                            <FormRouteWrapper link="/countries"/>
                        </Route>
                        <Route path="/countries/:id">
                            <EntityRouteWrapper link="/countries"/>
                        </Route>
                        <Route exact path="/categories">
                            <List link="/categories" canEditOrAdd={true}/>
                        </Route>
                        <Route path="/categories/new">
                            <FormRouteWrapper link="/categories"/>
                        </Route>
                        <Route path="/categories/edit/:id">
                            <FormRouteWrapper link="/categories"/>
                        </Route>
                        <Route path="/categories/:id">
                            <EntityRouteWrapper link="/categories"/>
                        </Route>
                        <Route exact path="/studios">
                            <List link="/studios" canEditOrAdd={true}/>
                        </Route>
                        <Route path="/studios/new">
                            <FormRouteWrapper link="/studios"/>
                        </Route>
                        <Route path="/studios/edit/:id">
                            <FormRouteWrapper link="/studios"/>
                        </Route>
                        <Route path="/studios/:id">
                            <EntityRouteWrapper link="/studios"/>
                        </Route>
                        <Route exact path="/languages">
                            <List link="/languages" canEditOrAdd={true}/>
                        </Route>
                        <Route path="/languages/new">
                            <FormRouteWrapper link="/languages"/>
                        </Route>
                        <Route path="/languages/edit/:id">
                            <FormRouteWrapper link="/languages"/>
                        </Route>
                        <Route path="/languages/:id">
                            <EntityRouteWrapper link="/languages"/>
                        </Route>
                        <Route path="/reviews/user/:id">

                        </Route>
                        <Route path="/reviews/film/add/:id">

                        </Route>
                        <Route path="/reviews/film/:id">

                        </Route>
                        <Route exact path="/users">
                            Users
                        </Route>
                        <Route path="/users/:id">

                        </Route>

                        <Route path="/login">
                            <PersonFormRouteWrapper/>
                        </Route>
                        <Route path="/register">
                            <PersonFormRouteWrapper/>
                        </Route>

                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
