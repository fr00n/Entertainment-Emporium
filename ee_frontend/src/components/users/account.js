import React, {useEffect, useState} from 'react';
import Session from 'react-session-api';
import {Image, Typography, Flex, FloatButton, Space, Divider} from 'antd';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EditAccount from "../crud/editAccount";

const {Title} = Typography;


export default function Account(props) {
    const [user, setUser] = useState([])
    const [edit, setEdit] = useState(false)
    const apiUrl = process.env.REACT_APP_API_URL;


    const onClick = (e) => {
        if (edit) {
            setEdit(false)
        } else {
            setEdit(true)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/users/${Session.get("username")}`,
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
                setUser(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }

        };
        fetchData();
    }, [edit, apiUrl]);

    return (
        <>
            <FloatButton
                icon={<EditOutlined/>}
                onClick={onClick}
                type="primary"
                style={{
                    right: 94,
                }}
            />
            {edit ? (
                <>
                    <EditAccount id={user.id}/>
                </>
            ) : (
                <>
                    <Title style={{color: "#000000", textAlign: 'center'}}>{user.firstName} {user.lastName}</Title>
                    <Flex gap={"small"} style={{padding: 32}}>
                        <Image
                            width={500}
                            src={user.avatarURL}
                        />

                        <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                            <p style={{fontSize: '20px'}}> {user.bio} </p>
                        </Space>

                    </Flex>
                </>
            )}
            <Divider/>
        </>
    );
}

