import React from 'react';
import {Input} from 'antd';
import {useNavigate} from "react-router-dom";

const {Search} = Input;


export default function SearchBar() {
    const navigate = useNavigate();

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        navigate('/search', {state: {term: value}})
    }

    return (
        <>
            <Search
                placeholder="search for movies and tv shows now.."
                onSearch={onSearch}
                style={{
                    width: 500
                }}
            />
        </>
    )
}
