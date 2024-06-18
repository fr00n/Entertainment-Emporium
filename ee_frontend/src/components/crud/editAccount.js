import React from 'react';
import {Form, Input, Button, Typography, message} from 'antd';
import Session from "react-session-api";

const {TextArea} = Input;

const {Title} = Typography;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 6}},
    wrapperCol: {xs: {span: 24}, sm: {span: 12}}
};
const tailFormItemLayout = {
    wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}},
};


const firstNameRules = [
    {message: 'Please input your first name!'}
];

const lastNameRules = [
    {message: 'Please input your last name!'}
];


export default function EditAccount(props) {
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
            content: 'Account edited successfully',
        });
    };


    const onFinish = async (values) => {
        console.log('Recieved values of form: ', values);

        try {
            const response = await fetch(`${apiUrl}/api/v1/users/${props.id}`,
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
                console.log('User updated succesfully')
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

            <Title style={{color: "#000000", textAlign: 'center'}}> Edit Your Account </Title>

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

                <Form.Item name="bio" label="Bio">
                    <TextArea rows={4}/>
                </Form.Item>

                <Form.Item name="avatarURL" label="Avatar">
                    <Input/>
                </Form.Item>


                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Update Account
                        </Button>
                    </Form.Item>
                </div>
            </Form>

        </>
    );
};