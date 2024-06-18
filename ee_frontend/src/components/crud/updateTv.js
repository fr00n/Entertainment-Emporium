import React, {useEffect, useState} from 'react';
import {Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Row, Typography} from 'antd';
import Session from "react-session-api";

const {TextArea} = Input;
const {Title} = Typography;
const {Search} = Input;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 6}},
    wrapperCol: {xs: {span: 24}, sm: {span: 12}}
};
const tailFormItemLayout = {
    wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}},
};


const titleRules = [
    { message: 'Please enter title of the movie'}
];

const castRules = [
    {message: 'Please enter the cast id list e.g 1,2,3'}
];

const producerRules = [
    {message: 'Please enter the producer id list e.g 1,2,3'}
];

const descriptionRules = [
    { message: 'Please enter the description'}
];


const coverRules = [
    { message: 'Please enter url of image'}
];


export default function UpdateTv() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [messageApi, contextHolder] = message.useMessage();
    const [tv, setTv] = useState([]);
    const [term, setTerm] = useState("");
    const [results, setResults] = useState([]);

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        setTerm(value);

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


    const errorNotification = (errorMessage) => {
        messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    };

    const successNotification = () => {
        messageApi.open({
            type: 'success',
            content: 'Tv updated successfully',
        });
    };

    const tvSelection = (id) => {
        setTv(results[id])
    }


    const onFinish = async (values) => {
        try {
            console.log('Received values of form: ', values);
            if( values.releaseDate !== undefined ){
                const date = new Date(values.releaseDate);

                // Format the date in YYYY-MM-DD HH:MM:SS format
                values.releaseDate = date.toISOString().slice(0, 19).replace('T', ' ');
            }

            const response = await fetch(`${apiUrl}/api/v1/tv/${tv.id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(values),
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
                console.log('Tv updated successfully')
                successNotification();
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }
    }

    const gridStyle = {
        width: 150,
        textAlign: 'center',
    };


    return (
        <>
            {contextHolder}

            <Title style={{color: "#000000", textAlign: 'center'}}> Update Tv Show </Title>

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


            <Form {...formItemLayout}
                  name="register"
                  onFinish={onFinish}
                  scrollToFirstError
            >

                <Form.Item name="title" label="Title" rules={titleRules} hasFeedback>
                    <Input placeholder={tv.length !== 0 ? `${tv.title}` : "Pick a tv show"}/>
                </Form.Item>

                <Form.Item name="cast" label="Cast" rules={castRules} hasFeedback>
                    <Input placeholder={tv.length !== 0 ? `${tv.cast}` : "Pick a tv show"}/>
                </Form.Item>

                <Form.Item name="producers" label="Producers" rules={producerRules} hasFeedback>
                    <Input placeholder={tv.length !== 0 ? `${tv.producers}` : "Pick a tv show"}/>
                </Form.Item>

                <Form.Item name="releaseDate" label="Release Date">
                    <DatePicker/>
                </Form.Item>

                <Form.Item name="seasons" label="Seasons" hasFeedback>
                    <InputNumber placeholder={tv.length !== 0 ? tv.seasons : "Pick a tv show"}/>
                </Form.Item>

                <Form.Item name="description" label="Description" rules={descriptionRules} hasFeedback>
                    <TextArea rows={4} placeholder={tv.length !== 0 ? `${tv.description}` : "Pick a tv show"}/>
                </Form.Item>

                <Form.Item name="coverURL" label="Cover" rules={coverRules} hasFeedback>
                    <Input placeholder={tv.length !== 0 ? `${tv.coverURL}` : "Pick a tv show"}/>
                </Form.Item>


                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Update Tv Show
                        </Button>
                    </Form.Item>
                </div>
            </Form>


        </>
    );
};