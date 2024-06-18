import React, {useEffect, useState} from "react";
import {Card, Col, Input, Row, Typography, Flex, Space, Button, message} from 'antd';
import Session from "react-session-api";

const {Search} = Input;
const {Title} = Typography;
const {Meta} = Card;


export default function DeleteTv() {
    const [messageApi, contextHolder] = message.useMessage();
    const [results, setResults] = useState([]);
    const [tv, setTv] = useState([]);
    const [term, setTerm] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;


    const gridStyle = {
        width: 150,
        textAlign: 'center',
    };

    const tvSelection = (id) => {
        setTv(results[id])
    };

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        setTerm(value);

    }

    const errorNotification = (errorMessage) => {
        messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    };

    const successNotification = () => {
        messageApi.open({
            type: 'success',
            content: 'Tv Show deleted successfully',
        });
    };
    const deleteTv = async (id) => {
        try {

            const response = await fetch(`${apiUrl}/api/v1/tv/${tv.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Session.get("token")}`
                    }
                }
            );

            let server = await response.json();

            console.log("server:", server)
            if (!response.ok) {
                throw new Error(server.error);

            } else {
                console.log('Tv Show deleted successfully')
                successNotification();
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/tv/${term}`,
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
                setResults(data);

            } catch (error) {
                console.error('Error fetching data:', error.message);
            }

        };
        fetchData();
    }, [term, apiUrl]);
    return (
        <>
            {contextHolder}
            <Title style={{color: "#000000", textAlign: 'center'}}> Delete Tv Shows </Title>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Search
                    placeholder="search for tv shows"
                    onSearch={onSearch}
                    style={{
                        width: 500
                    }}
                />
            </div>

            {results.length && (
                <Row type="flex" justify="space-around" gutter={16}>
                    <Card title="Search Results">
                        {results.map((result, index) => (
                            <Col span={4} key={result.id}>

                                <Card.Grid onClick={() => tvSelection(index)} bordered={"false"} title={result.title}
                                           style={gridStyle}>{result.title}</Card.Grid>

                            </Col>
                        ))}
                    </Card>
                </Row>
            )}

            {tv.length !== 0 && (
                <>
                    <Space>

                        <Col span={4} key={tv.id}>
                            <Card bordered={false} title={tv.title} style={{width: 300}}
                                  cover={<img src={tv.coverURL} alt={`Cover for tv show ${tv.title}`}/>}>
                                <Meta description={tv.description}/>
                            </Card>
                        </Col>
                        <Flex vertical align="flex-end" justify="space-between" style={{padding: 32}}>
                            <Title level={3} type="danger">Are you sure you want to delete this Tv Show?</Title>
                            <Button danger onClick={() => deleteTv(tv.id)}>Delete</Button>
                        </Flex>
                    </Space>
                </>
            )}
        </>
    )
}