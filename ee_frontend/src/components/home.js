import SearchBar from './searchBar.js'
import PopularMovies from './popularMovies.js'
import PopularTv from './popularTv.js'
import React from 'react';
import EmporiumTitle from './header.js'


export default function Home(props) {
    return (
        <>
            <EmporiumTitle/>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '5vh'
            }}>
                < SearchBar/>
            </div>
            <PopularMovies/>
            <PopularTv/>
        </>
    );
};
