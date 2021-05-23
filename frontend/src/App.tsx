import React, {useState} from 'react';
import './App.css';
import HelloMessage from './components/HelloMessage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
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
import FilterableReviewListRouteWrapper from "./components/reviews/FilterableReviewList";
import ReviewFormRouteWrapper from "./components/reviews/ReviewForm";
import UserRouteWrapper from "./components/users/User";
import FilterableUserList from "./components/users/FilterableUserList";
import UserFormRouteWrapper from "./components/users/UserForm";
import LoginForm from "./components/users/LoginForm";
import {logout} from "./components/users/Logout";

function App() {
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [role, setRole] = useState<string>("ADMIN");
    const [user, setUser] = useState<string>("1");
    const [authToken, setAuthToken] = useState<string>('');

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
                            {isLogged ? (
                                <li className="login-register-nav">
                                    <Link to="/logout">
                                        Logout
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
                            <FilterableFilmList canEditOrAdd={role === "ADMIN"}/>
                        </Route>
                        <Route path="/films/new">
                            {role === "ADMIN" ? (
                                <FilmFormRouteWrapper/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/films/edit/:id">
                            {role === "ADMIN" ? (
                                <FilmFormRouteWrapper/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/films/:id">
                            <FilmRouteWrapper currentUserId={user} canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route exact path="/persons">
                            <FilterablePersonList canEditOrAdd={role === "ADMIN"}/>
                        </Route>
                        <Route path="/persons/new">
                            {role === "ADMIN" ? (
                                <PersonFormRouteWrapper/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/persons/edit/:id">
                            {role === "ADMIN" ? (
                                <PersonFormRouteWrapper/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/persons/:id">
                            <PersonRouteWrapper canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route exact path="/countries">
                            <List link="/countries" canEditOrAdd={role === "ADMIN"}/>
                        </Route>
                        <Route path="/countries/new">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/countries"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/countries/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/countries"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/countries/:id">
                            <EntityRouteWrapper link="/countries" canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route exact path="/categories">
                            <List link="/categories" canEditOrAdd={role === "ADMIN"}/>
                        </Route>
                        <Route path="/categories/new">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/categories"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/categories/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/categories"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/categories/:id">
                            <EntityRouteWrapper link="/categories" canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route exact path="/studios">
                            <List link="/studios" canEditOrAdd={role === "ADMIN"}/>
                        </Route>
                        <Route path="/studios/new">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/studios"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/studios/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/studios"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/studios/:id">
                            <EntityRouteWrapper link="/studios" canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route exact path="/languages">
                            <List link="/languages" canEditOrAdd={role === "ADMIN"}/>
                        </Route>
                        <Route path="/languages/new">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/languages"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/languages/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper link="/languages"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/languages/:id">
                            <EntityRouteWrapper link="/languages" canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route path="/reviews/user/:id">
                            <FilterableReviewListRouteWrapper canEditOrAdd={role === "ADMIN"} known={"user"}
                                                              currentUserId={user}/>
                        </Route>
                        <Route path="/reviews/film/add/:id">
                            {isLogged ? (
                                <ReviewFormRouteWrapper currentUserId={user}/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/reviews/film/edit/:id">
                            {isLogged || role === "ADMIN" ? (
                                <ReviewFormRouteWrapper currentUserId={user}/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/reviews/film/:id">
                            <FilterableReviewListRouteWrapper canEditOrAdd={role === "ADMIN"} known={"film"}
                                                              currentUserId={user}/>
                        </Route>
                        <Route exact path="/users">
                            <FilterableUserList canEditOrAdd={role === "ADMIN"}/>
                        </Route>
                        <Route path="/users/edit/:id">
                            <UserFormRouteWrapper currentUserId={user} canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route path="/users/:id">
                            <UserRouteWrapper canEdit={role === "ADMIN"} currentUserId={user}/>
                        </Route>
                        <Route path="/login">
                            <LoginForm authHandler={() => {}}/>
                        </Route>
                        <Route path="/register">
                            <UserFormRouteWrapper currentUserId={user} canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route path="/logout">
                            {logout()}
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
