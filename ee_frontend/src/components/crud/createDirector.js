import React from 'react';
import {Form, Input, Button, Typography, message} from 'antd';
import Session from "react-session-api";

const {Title} = Typography;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 6}},
    wrapperCol: {xs: {span: 24}, sm: {span: 12}}
};
const tailFormItemLayout = {
    wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}},
};

const firstNameRules = [
    {required: true, message: 'Please input directors first name'}
];

const lastNameRules = [
    {required: true, message: 'Please input directors last name'}
];


const avatarRules = [
    {required: true, message: 'Please input directors image'}
];






export default function CreateDirector() {
    const apiUrl = process.env.REACT_APP_API_URL;
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
            content: 'Producer created successfully',
        });
    };


    const onFinish = async (values) => {
        console.log('Recieved values of form: ', values);
        try {
            const response = await fetch(`${apiUrl}/api/v1/directors`,
                {
                    method: 'POST',
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
                console.log('Producer created successfully')
                successNotification();

            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }
    }


    return (
        <>
            {contextHolder}

            <Title style={{color: "#000000", textAlign: 'center'}}>Create A Director</Title>

            <Form {...formItemLayout}
                  name="register"
                  onFinish={onFinish}
                  scrollToFirstError
            >

                <Form.Item name="firstName" label="First Name" rules={firstNameRules} hasFeedback>
                    <Input/>
                </Form.Item>

                <Form.Item name="lastName" label="Last Name" rules={lastNameRules} hasFeedback>
                    <Input/>
                </Form.Item>

                <Form.Item name="avatarURL" label="Director Image" rules={avatarRules} hasFeedback>
                    <Input/>
                </Form.Item>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Create Director
                        </Button>
                    </Form.Item>
                </div>
            </Form>

        </>
    );
};