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
import {Button} from "@material-ui/core";

function App() {
    const [isLogged, setIsLogged] = useState<boolean>(Boolean(sessionStorage.getItem("isLogged") || false));
    const [role, setRole] = useState<string|null>(sessionStorage.getItem("role"));
    const [user, setUser] = useState<string|null>(sessionStorage.getItem("user"));
    const [authToken, setAuthToken] = useState<string|null>(sessionStorage.getItem("authToken"));

    React.useEffect(() => {
        sessionStorage.setItem("isLogged", String(isLogged));
    }, [isLogged])

    React.useEffect(() => {
        if (user) {
            sessionStorage.setItem("user", user);
        } else {
            sessionStorage.removeItem("user");
        }
    }, [user])

    React.useEffect(() => {
        if (role) {
            sessionStorage.setItem("role", role);
        } else {
            sessionStorage.removeItem("role");
        }
    }, [role])

    React.useEffect(() => {
        if (authToken) {
            sessionStorage.setItem("authToken", authToken);
        } else {
            sessionStorage.removeItem("authToken");
        }
    }, [authToken]);

    function logout() {
        setIsLogged(false);
        setRole(null);
        setUser(null);
        setAuthToken(null);
    }

    function login(role: string, user: string, authToken: string): void {
        setIsLogged(true);
        setRole(role);
        setUser(user);
        setAuthToken(authToken);
    }

    return (
        <div className="App">
            <Router>
                <div className="header">
                    <nav>
                        <ul className="navigation">
                            <li>
                                <Button size="small">
                                    <Link to="/">
                                        Home
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button size="small">
                                    <Link to="/films">
                                        Films
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button size="small">
                                    <Link to="/persons">
                                        Persons
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button size="small">
                                    <Link to="/users">
                                        Users
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button size="small">
                                    <Link to="/categories">
                                        Categories
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button size="small">
                                    <Link to="/countries">
                                        Countries
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button size="small">
                                    <Link to="/studios">
                                        Studios
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button size="small">
                                    <Link to="/languages">
                                        Languages
                                    </Link>
                                </Button>
                            </li>
                            {!isLogged ? (
                                <li className="login-register-nav">
                                    <Button size="small">
                                        <Link to="/login">
                                            Login
                                        </Link>
                                    </Button>
                                </li>
                            ) : ""}
                            {!isLogged ? (
                                <li className="login-register-nav">
                                    <Button size="small">
                                        <Link to="/register">
                                            Register
                                        </Link>
                                    </Button>
                                </li>
                            ) : ""}
                            {isLogged ? (
                                <li className="login-register-nav">
                                    <Button size="small" onClick={logout}>
                                        Logout
                                    </Button>
                                </li>
                            ) : ""}
                            {isLogged && role !== "ADMIN" ? (
                                <li className="login-register-nav">
                                    <Button size="small">
                                        <Link to={"/users/" + user}>
                                            Profile
                                        </Link>
                                    </Button>
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
                                <FilmFormRouteWrapper authToken={authToken}/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/films/edit/:id">
                            {role === "ADMIN" ? (
                                <FilmFormRouteWrapper authToken={authToken}/>
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
                                <PersonFormRouteWrapper authToken={authToken}/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/persons/edit/:id">
                            {role === "ADMIN" ? (
                                <PersonFormRouteWrapper authToken={authToken}/>
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
                                <FormRouteWrapper authToken={authToken} link="/countries"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/countries/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper authToken={authToken} link="/countries"/>
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
                                <FormRouteWrapper authToken={authToken} link="/categories"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/categories/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper authToken={authToken} link="/categories"/>
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
                                <FormRouteWrapper authToken={authToken} link="/studios"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/studios/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper authToken={authToken} link="/studios"/>
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
                                <FormRouteWrapper authToken={authToken} link="/languages"/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/languages/edit/:id">
                            {role === "ADMIN" ? (
                                <FormRouteWrapper authToken={authToken} link="/languages"/>
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
                                <ReviewFormRouteWrapper authToken={authToken} currentUserId={user}/>
                            ) : (
                                <Redirect to="/"/>
                            )}
                        </Route>
                        <Route path="/reviews/film/edit/:id">
                            {isLogged || role === "ADMIN" ? (
                                <ReviewFormRouteWrapper authToken={authToken} currentUserId={user}/>
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
                            <UserFormRouteWrapper authToken={authToken} currentUserId={user} canEdit={role === "ADMIN"}/>
                        </Route>
                        <Route path="/users/:id">
                            <UserRouteWrapper canEdit={role === "ADMIN"} currentUserId={user}/>
                        </Route>
                        <Route path="/login">
                            <LoginForm authHandler={login}/>
                        </Route>
                        <Route path="/register">
                            <UserFormRouteWrapper authToken={authToken} currentUserId={user} canEdit={role === "ADMIN"}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
