import React, {useState, useEffect} from 'react';
import {Card, Col, Row} from 'antd';
import {Link} from "react-router-dom";

const {Meta} = Card;


export default function PopularTv() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [tv, setTv] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/tv/1/4/audiencePercentage/DESC`,
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
                setTv(data.tv);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [apiUrl]);

    return (
        <>
            <div>
                <h1 style={{textAlign: 'center'}}> The Hottest Tv Shows Right Now! </h1>
                <Row type="flex" justify="space-around" gutter={16}>
                    {tv.map((show) => (
                        <Col span={4} key={show.id}>
                            <Link to={show.links.self}>
                                <Card bordered={false} title={show.title} style={{width: 300}}
                                      cover={<img src={show.coverURL} alt={`Cover of tv show ${show.title}`}/>}>
                                    <Meta description={show.description}/>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}

