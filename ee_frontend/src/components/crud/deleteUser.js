import {Button, Card, Col, Flex, Input, Row, Space, Typography, message} from "antd";
import React, {useEffect, useState} from "react";
import Session from "react-session-api";
const {Title} = Typography;
const {Meta} = Card;
const {Search} = Input;

export default function DeleteUser(){
    const [ result, setResult ] = useState([]);
    const [term, setTerm ] = useState([]);
    const [ user, setUser ] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const apiUrl = process.env.REACT_APP_API_URL;


    const errorNotification = (errorMessage) => {
        messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    };

    const successNotification = () => {
        messageApi.open({
            type: 'success',
            content: 'User deleted successfully',
        });
    };

    const gridStyle = {
        width: 150,
        textAlign: 'center',
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

    const userSelection = (result) => {
        setUser(result)
    }

    const deleteUser = async (id) => {
        try {

            const response = await fetch(`${apiUrl}/api/v1/users/${user.id}`,
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
                console.log('User updated successfully')
                successNotification();
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }
    }

    return(
        <>
            {contextHolder}
            <Title style={{color: "#000000", textAlign: 'center'}}> Delete User </Title>

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
            {user.length !== 0 && (
                <>
                    <Space>

                        <Col span={4} key={user.id}>
                            <Card bordered={false} title={user.username} style={{width: 300}}
                                  cover={<img src={user.avatarURL} alt={`Cover for user ${user.username}`}/>}>
                                <Meta description={`${user.firstName} ${user.lastName}`}/>
                            </Card>
                        </Col>
                        <Flex vertical align="flex-end" justify="space-between" style={{padding: 32}}>
                            <Title level={3} type="danger">Are you sure you want to delete this user?</Title>
                            <Button danger onClick={() => deleteUser(user.id)}>Delete</Button>
                        </Flex>
                    </Space>
                </>
            )}
        </>
    )
}