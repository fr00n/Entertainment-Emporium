import React, {useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {Divider, Image, Typography, Flex, Space, Pagination} from 'antd';
import Cast from '../people/cast';
import Directors from "../people/directors";
import VerifiedRating from "../rating/verifiedRating";
import AudienceRating from "../rating/audienceRating";
import CreateMovieReview from "../crud/createMovieReview";
import EditMovieReview from "../crud/editMovieReview";
import Session from "react-session-api";
import MovieReview from "../reviews/MovieReview";

const {Title} = Typography;

export default function Movie(props) {
    let {id} = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [movie, setMovie] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [cast, setCast] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [releaseDate, setReleaseDate] = useState("");
    const [directorIds, setDirectorIds] = useState([]);
    const [actorIds, setActorIds] = useState([]);
    const [userReview, setUserReview] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewLimit, setReviewLimit] = useState(4);
    const [totalReviewPages, setTotalReviewPages ] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id === undefined) {
                    throw new Error('No movie id provided')
                }
                const response = await fetch(`${apiUrl}/api/v1/movies/${id}`,
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
                setMovie(data);

                if (data.releaseDate !== null || true) {
                    const date = new Date(data.releaseDate);

                    const day = date.getUTCDate();
                    const month = date.toLocaleString('en-US', {month: 'long'});
                    const year = date.getUTCFullYear();

                    setReleaseDate(`${day} ${month} ${year}`);
                }

                setDirectorIds(data.producers);
                setActorIds(data.cast);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }

        };
        fetchData();
    }, [id, apiUrl]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (actorIds === null || actorIds === undefined) {
                    setCast([]);
                    throw new Error("No actors attached to movie")
                }
                const response = await fetch(`${apiUrl}/api/v1/actors/${actorIds}`,
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
                setCast(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }

        };
        fetchData();
    }, [movie, actorIds, apiUrl]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (directorIds === null || directorIds === undefined) {
                    setDirectors([]);
                    throw new Error("No directors attached to movie")
                }
                const response = await fetch(`${apiUrl}/api/v1/directors/${directorIds}`,
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
                setDirectors(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }

        };
        fetchData();
    }, [movie, directorIds, apiUrl]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/movieReviews/${movie.id}/${reviewPage}/${reviewLimit}/ASC`,
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
            console.log(data)
            setReviews(data.reviews);
            setReviewPage(data.page);
            setReviewLimit(data.limit);
            setTotalReviewPages((Math.ceil(data.count / data.limit))*10);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }, [movie, apiUrl, reviewPage,reviewLimit]);

    useEffect(() => {
        if (Session.get("username")) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/movieReviews/${Session.get("username")}/${movie.id}`,
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
                    setUserReview(data);
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }

            };
            fetchData();
        }
    }, [movie, apiUrl]);

    useEffect(() => {
        if (movie) {
            fetchReviews();
        }
    }, [movie, fetchReviews, apiUrl]);


    const onPageChange = (page) =>{
        setReviewPage(page);
    }

    return (
        <>
            <Title style={{color: "#000000", textAlign: 'center'}}>{movie.title}</Title>

            <Flex gap={"small"} style={{padding: 32}}>
                <Image
                    width={500}
                    src={movie.coverURL}
                />
                <Flex vertical align="flex-end" justify="space-between" style={{padding: 32}}>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <p style={{fontSize: '20px'}}> {movie.description} </p>
                        <p style={{fontSize: '20px'}}> Runtime: {movie.runtime} minutes </p>
                        <p style={{fontSize: '20px'}}> Release Date: {releaseDate} </p>

                        <Space>

                            <VerifiedRating media={movie}/>

                            <AudienceRating media={movie}/>


                        </Space>
                    </Space>
                </Flex>
            </Flex>

            <Divider/>

            <Title style={{color: "#000000", textAlign: 'center'}}>Cast</Title>

            <Cast cast={cast}/>

            <Title style={{color: "#000000", textAlign: 'center'}}>Directors</Title>

            <Directors directors={directors}/>

            <Divider/>

            <Title style={{color: "#000000", textAlign: 'center'}}>Reviews</Title>

            <MovieReview reviews={reviews}/>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '10vh'
            }}>

                <Pagination defaultCurrent={reviewPage} onChange={onPageChange} total={totalReviewPages}/>
            </div>
            {Session.get("username") ? (
                <>
                    {userReview.length !== 0 ? (
                        <>
                            <EditMovieReview review={userReview} movie={movie}/>
                        </>
                    ) : (
                        <>
                            <CreateMovieReview movie={movie}/>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Title style={{color: "#000000", textAlign: 'center'}}>Log in or Register to make a review!</Title>

                </>
            )}
        </>
    );
}

