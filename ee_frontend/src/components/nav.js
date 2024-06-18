import React, { useState } from 'react';
import {Menu} from 'antd';
import {Link, useNavigate } from "react-router-dom";
import Session from 'react-session-api';


function Nav(props) {
    const navigate = useNavigate();
    const [current, setCurrent] = useState("1")


    const onClick = (e) => {
        setCurrent(e.key);
    };
    const logout = (e) => {
        Session.clear();
        setCurrent("1");
        navigate('/');
    }


    return (
        <>
            <div className="logo"/>
            <Menu theme="dark" mode="horizontal" onClick={onClick} selectedKeys={[current]}>
                <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                {Session.get("username") ? (
                    <>
                        <Menu.Item key="2"><Link to="/account">Account</Link></Menu.Item>
                        <Menu.Item key="6" onClick={logout}>Log out</Menu.Item>
                        {Session.get("role") === 'admin' && (
                            <>
                                <Menu.Item key="5"><Link to="/management"> Management </Link></Menu.Item>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Menu.Item key="3"><Link to="/register">Sign Up</Link></Menu.Item>
                        <Menu.Item key="4"><Link to="/login"> Login </Link></Menu.Item>
                    </>
                )}
            </Menu>
        </>
    );
}

export default Nav;