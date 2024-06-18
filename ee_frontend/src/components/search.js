import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {Card, Col, Row, Button, Result} from 'antd';
import MehOutlined from "@ant-design/icons/MehOutlined";
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import {useState, useEffect, useCallback} from "react";
import {trackPromise, usePromiseTracker} from 'react-promise-tracker';


export default function SearchedResults(props) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const location = useLocation();
    let term = location.state.term
    const [movies, setMovies] = useState([]);
    const [tv, setTv] = useState([]);


    const fetchMovies = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/movies/${term}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log('Movie Data:', data);
            setMovies(data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }, [term, apiUrl]);


    const fetchTv = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/tv/${term}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log('Tv Data:', data);
            setTv(data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }, [term, apiUrl]);

    useEffect(() => {
        if (term) {
            trackPromise(fetchMovies());
            trackPromise(fetchTv());
        }
    }, [term, fetchTv, fetchMovies]);

    const gridStyle = {
        width: 150,
        textAlign: 'center',
    };

    const {promiseInProgress} = usePromiseTracker();

    return (
        <>
            {promiseInProgress ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh'
                    }}>
                        <LoadingOutlined style={{fontSize: '200px'}}/>
                    </div>
                ) :
                (<>
                    {movies.length || tv.length !== 0 ? (
                        <>
                            <Row type="flex" justify="space-around" gutter={16}>
                                <Card title="Movie Results">
                                    {movies.map((movie) => (
                                        <Col span={4} key={movie.id}>
                                            <Link to={`/movie/${movie.id}`}>
                                                <Card.Grid bordered={false} title={movie.title} style={gridStyle}
                                                           cover={<img src={movie.coverURL}
                                                                       alt={`Cover of ${movie.title}`}/>}>{movie.title}</Card.Grid>
                                            </Link>
                                        </Col>
                                    ))}
                                </Card>
                            </Row>
                            <Row type="flex" justify="space-around" gutter={16}>
                                <Card title="Tv Results">
                                    {tv.map((show) => (
                                        <Col span={4} key={show.id}>
                                            <Link to={`/tv/${show.id}`}>
                                                <Card.Grid bordered={false} title={show.title} style={gridStyle}
                                                           cover={<img src={show.coverURL}
                                                                       alt={`Cover of ${show.title}`}/>}>{show.title}</Card.Grid>
                                            </Link>
                                        </Col>
                                    ))}
                                </Card>
                            </Row>
                        </>
                    ) : (
                        <Result
                            icon={<MehOutlined/>}
                            title="Uh oh, theres no Tv Shows or Movies by that name"
                            extra={<Link to={"/"}><Button type="primary">Home</Button></Link>}
                        />
                    )}

                </>)}
        </>
    )
}
