import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, message, Row, Typography} from 'antd';
import Session from "react-session-api";

const {Title} = Typography;
const {Search} = Input;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 6}},
    wrapperCol: {xs: {span: 24}, sm: {span: 12}}
};
const tailFormItemLayout = {
    wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}},
};


const firstNameRules = [
    {message: 'Please input directors first name'}
];

const lastNameRules = [
    {message: 'Please input directors last name'}
];


const avatarRules = [
    {message: 'Please input directors image'}
];



export default function UpdateDirector() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [messageApi, contextHolder] = message.useMessage();
    const [director, setDirector] = useState([]);
    const [term, setTerm] = useState("");
    const [results, setResults] = useState([]);

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        setTerm(value);

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/directors/search/${term}`,
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
            content: 'Director updated successfully',
        });
    };

    const directorSelection = (id) => {
        setDirector(results[id])
    }


    const onFinish = async (values) => {
        try {

            const response = await fetch(`${apiUrl}/api/v1/directors/${director.id}`,
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
                console.log('Director updated successfully')
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

            <Title style={{color: "#000000", textAlign: 'center'}}> Update Director </Title>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Search
                    placeholder="search for directors by last name"
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

                                <Card.Grid onClick={() => directorSelection(index)} bordered={"false"} title={`${result.firstName} ${result.lastName}`}
                                           style={gridStyle}>{result.firstName} {result.lastName}</Card.Grid>

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

                <Form.Item name="firstName" label="First Name" rules={firstNameRules} hasFeedback>
                    <Input placeholder={director.length !== 0 ? `${director.firstName}` : "Pick a director"}/>
                </Form.Item>

                <Form.Item name="lastName" label="Last Name" rules={lastNameRules} hasFeedback>
                    <Input placeholder={director.length !== 0 ? `${director.lastName}` : "Pick a director"}/>
                </Form.Item>

                <Form.Item name="avatarURL" label="Director Image" rules={avatarRules} hasFeedback>
                    <Input placeholder={director.length !== 0 ? `${director.avatarURL}` : "Pick an director"}/>
                </Form.Item>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Update Director
                        </Button>
                    </Form.Item>
                </div>
            </Form>


        </>
    );
};