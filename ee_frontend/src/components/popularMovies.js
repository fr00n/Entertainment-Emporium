import React, {useState, useEffect} from 'react';
import {Card, Col, Row} from 'antd';
import {Link} from "react-router-dom";

const {Meta} = Card;


export default function PopularMovies() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/movies/1/4/audiencePercentage/DESC`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setMovies(data.movies);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                console.log(error.message)
            }
            return () => {
                // Clean up the side effect
                console.log("data unmount")
                setMovies([]);

            };
        };

        fetchData();
    }, [apiUrl]);


    return (
        <>
            <h1 style={{textAlign: 'center'}}> The Hottest Movies Right Now! </h1>
            <Row type="flex" justify="space-around" gutter={16}>
                {movies.map((movie) => (
                    <Col span={4} key={movie.id}>
                            <Link to={movie.links.self}>
                                <Card bordered={false} title={movie.title} style={{width: 300}}
                                      cover={<img src={movie.coverURL} alt={`Cover for movie ${movie.title}`}/>}>
                                    <Meta description={movie.description}/>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
        </>
    )
}

