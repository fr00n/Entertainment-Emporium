import React, {useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {Divider, Image, Typography, Flex, Space, Pagination } from 'antd';
import Cast from "../people/cast";
import Directors from "../people/directors";
import VerifiedRating from "../rating/verifiedRating";
import AudienceRating from "../rating/audienceRating";
import TvReview from "../reviews/TvReview";
import Session from "react-session-api";
import CreateTvReview from "../crud/createTvReview";
import EditTvReview from "../crud/editTvReview";

const {Title} = Typography;

export default function Tv(props) {
    let {id} = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [tv, setTv] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [cast, setCast] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [directorIds, setDirectorIds] = useState([]);
    const [actorIds, setActorIds] =useState([]);
    const [releaseDate, setReleaseDate] = useState("");
    const [ userReview, setUserReview ] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewLimit, setReviewLimit] = useState(4);
    const [totalReviewPages, setTotalReviewPages ] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/tv/${id}`,
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
                setTv(data);
                setDirectorIds(data.producers);
                setActorIds(data.cast);

                if (data.releaseDate !== null || true){
                    const date = new Date(data.releaseDate);

                    const day = date.getUTCDate();
                    const month = date.toLocaleString('en-US', { month: 'long' });
                    const year = date.getUTCFullYear();

                    setReleaseDate(`${day} ${month} ${year}`);
                }


            } catch (error) {
                console.error('Error fetching data:', error.message);
            }

        };
        fetchData();
    }, [id, apiUrl]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (actorIds === null || actorIds === undefined){
                    setCast([]);
                    throw new Error("No actors attached to this tv show")
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
    }, [actorIds, apiUrl]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (directorIds === null || directorIds === undefined){
                    setDirectors([]);
                    throw new Error("No directors attached to this tv shows")
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
    }, [directorIds, apiUrl]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/tvReviews/${tv.id}/${reviewPage}/${reviewLimit}/ASC`,
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
            setReviews(data.reviews);
            setReviewPage(data.page);
            setReviewLimit(data.limit);
            setTotalReviewPages((Math.ceil(data.count / data.limit))*10);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }, [tv, apiUrl, reviewPage, reviewLimit]);

    useEffect(() => {
        if (tv) {
            fetchReviews();
        }
    }, [tv, fetchReviews, apiUrl]);

    useEffect(() => {
        if(Session.get("username")){
            const fetchData = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/tvReviews/${Session.get("username")}/${tv.id}`,
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
    }, [tv]);


    const onPageChange = (page) =>{
        setReviewPage(page);
    }


    return (
        <>
            <Title style={{color: "#000000", textAlign: 'center'}}>{tv.title}</Title>

            <Flex gap={"small"} style={{padding: 32}}>
                <Image
                    width={500}
                    src={tv.coverURL}
                />
                <Flex vertical align="flex-end" justify="space-between" style={{padding: 32}}>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <p style={{fontSize: '20px'}}> {tv.description} </p>
                        <p style={{fontSize: '20px'}}> Seasons: {tv.seasons} </p>
                        <p style={{fontSize: '20px'}}> Release Date: {releaseDate} </p>
                        <Space>
                            <VerifiedRating media={tv}/>
                            <AudienceRating media={tv}/>
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

            <TvReview reviews={reviews}/>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '10vh'
            }}>
                {reviews.length !== 0 && (
                    <Pagination defaultCurrent={reviewPage} onChange={onPageChange} total={totalReviewPages}/>
                )}

            </div>

            {Session.get("username") ? (
                <>
                    {userReview.length !== 0 ? (
                        <>
                            <EditTvReview review={userReview} tv={tv}/>
                        </>
                    ) : (
                        <>
                            <CreateTvReview tv={tv}/>
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

