import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, Row, Select, Typography, message} from 'antd';
import Session from "react-session-api";
const { Option } = Select;
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

export default function UpdateUser(){
    const [term, setTerm] = useState("");
    const [result, setResult] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [ user, setUser ] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const errorNotification = (errorMessage) => {
        messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    };

    const successNotification = () => {
        messageApi.open({
            type: 'success',
            content: 'User updated successfully',
        });
    };




    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        setTerm(value);

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/users/${term}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Session.get("token")}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setResult(data);

            } catch (error) {
                console.error('Error fetching data:', error.message);
            }

        };
        fetchData();
    }, [apiUrl, term]);

    const onFinish = async (values) => {
        try {
            console.log('Received values of form: ', values);

            const response = await fetch(`${apiUrl}/api/v1/users/${user.id}`,
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
                console.log('User updated successfully')
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

    const userSelection = (result) => {
        setUser(result)
    }


    return(
        <>
            {contextHolder}
            <Title style={{color: "#000000", textAlign: 'center'}}> Update User </Title>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Search
                    placeholder="search for user by username"
                    onSearch={onSearch}
                    style={{
                        width: 500
                    }}
                />
            </div>

            {result.length !== 0 && (
                <Row type="flex" justify="space-around" gutter={16}>
                    <Card title="Search Results">
                            <Col span={4} key={result.id}>

                                <Card.Grid onClick={() => userSelection(result)} bordered={"false"} title={result.username}
                                           style={gridStyle}>{result.username}</Card.Grid>

                            </Col>
                    </Card>
                </Row>
            )}

            <Form {...formItemLayout}
                  name="register"
                  onFinish={onFinish}
                  scrollToFirstError
            >

                <Form.Item name="firstName" label="First Name" hasFeedback>
                    <Input placeholder={user.length !== 0 ? `${user.firstName}` : "Pick a user"}/>
                </Form.Item>

                <Form.Item name="lastName" label="Last Name" hasFeedback>
                    <Input placeholder={user.length !== 0 ? `${user.lastName}` : "Pick a user"}/>
                </Form.Item>

                <Form.Item name="bio" label="Bio">
                    <TextArea rows={4} placeholder={user.length !== 0 ? `${user.bio}` : "Pick a user"}/>
                </Form.Item>

                <Form.Item name="avatarURL" label="Avatar">
                    <Input placeholder={user.length !== 0 ? `${user.avatarUrl}` : "Pick a user"}/>
                </Form.Item>

                <Form.Item
                    name="role"
                    label="User Role"
                >
                    <Select
                        placeholder={user.length !== 0 ? `${user.role}` : "Pick a user"}
                        allowClear
                    >
                        <Option value="admin">admin</Option>
                        <Option value="user">user</Option>
                        <Option value="verified">verified</Option>
                    </Select>
                </Form.Item>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Update User
                        </Button>
                    </Form.Item>
                </div>
            </Form>


        </>
    )
}