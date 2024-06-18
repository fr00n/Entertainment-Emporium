import './App.css';
import React from 'react';
import Nav from './components/nav.js';
import {Layout} from 'antd';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Account from './components/users/account';
import Movie from './components/media/movie';
import Home from './components/home';
import Tv from './components/media/tv'
import SearchedResults from './components/search'
import RegistrationForm from './components/users/register'
import Login from './components/users/login'
import Management from './components/management'
import AddMovie from "./components/crud/addMovie";
import AddTv from "./components/crud/addTv";
import UpdateMovie from "./components/crud/updateMovie";
import DeleteMovie from "./components/crud/deleteMovie";
import UpdateTv from "./components/crud/updateTv";
import DeleteTv from "./components/crud/deleteTv";
import CreateActors from "./components/crud/createActors";
import UpdateActor from "./components/crud/updateActor";
import DeleteActor from "./components/crud/deleteActor";
import CreateDirector from "./components/crud/createDirector";
import UpdateDirector from "./components/crud/updateDirector";
import DeleteDirector from "./components/crud/deleteDirector";
import UpdateUser from "./components/crud/updateUser";
import DeleteUser from "./components/crud/deleteUser";

const {Header, Content, Footer} = Layout;


const App = () => {
    return (
        <Router>
            <Layout>
                <Header>
                    < Nav/>
                </Header>
                <Content>
                    <Routes>
                        <Route path="/account" element={<Account/>}/>
                        <Route path="/movie/:id" element={<Movie/>}/>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/tv/:id" element={<Tv/>}/>
                        <Route path="/search" element={<SearchedResults/>}/>
                        <Route path="/register" element={< RegistrationForm/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/management" element={<Management/>}/>
                        <Route path="/addMovie" element={<AddMovie/>} />
                        <Route path="/addTv" element={<AddTv/>} />
                        <Route path="/updateMovie" element={<UpdateMovie/>} />
                        <Route path="/deleteMovie" element={<DeleteMovie/>} />
                        <Route path="/updateTv" element={<UpdateTv/>} />
                        <Route path="/deleteTv" element={<DeleteTv/>} />
                        <Route path="/createActor" element={<CreateActors/>} />
                        <Route path="/updateActor" element={<UpdateActor />} />
                        <Route path="/deleteActor" element={<DeleteActor />} />
                        <Route path="/addDirector" element={<CreateDirector/>} />
                        <Route path="/updateDirector" element={<UpdateDirector/>} />
                        <Route path="/deleteDirector" element={<DeleteDirector />} />
                        <Route path="/updateUser" element={<UpdateUser/>} />
                        <Route path="/deleteUser" element={<DeleteUser />} />


                    </Routes>
                </Content>
                <Footer style={{textAlign: 'center'}}>Created for Web API</Footer>
            </Layout>
        </Router>
    );
};
export default App;