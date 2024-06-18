import React from 'react';
import {useNavigate} from "react-router-dom";
import {Form, Input, Button, Typography, message} from 'antd';

const {Title} = Typography;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 6}},
    wrapperCol: {xs: {span: 24}, sm: {span: 12}}
};
const tailFormItemLayout = {
    wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}},
};

const passwordRules = [
    {required: true, message: 'Please input your password!'}
];

const firstNameRules = [
    {required: true, message: 'Please input your first name!'}
];

const lastNameRules = [
    {required: true, message: 'Please input your last name!'}
];


const confirmRules = [
    {required: true, message: 'Please confirm your password!'},
    // rules can include function handlers in which you can apply additional logic
    ({getFieldValue}) => ({
        validator(rule, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject('The two passwords that you entered do not match!');
        }
    })
];

const usernameRules = [
    {required: true, message: 'Please input your username!', whitespace: true}
]


export default function RegistrationForm() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [messageApi, contextHolder] = message.useMessage();


    const errorNotification = (errorMessage) => {
        messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    };


    const onFinish = async (values) => {
        console.log('Recieved values of form: ', values);
        const {confirm, ...data} = values;
        try {
            const response = await fetch(`${apiUrl}/api/v1/users`,
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            let server = await response.json();

            console.log("server:", server)
            if (!response.ok) {
                throw new Error(server.error);

            } else {
                console.log('User created succesfully')
                navigate('/login')
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }
    }


    return (
        <>
            {contextHolder}

            <Title style={{color: "#000000", textAlign: 'center'}}> Become a member now! </Title>

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

                <Form.Item name="username" label="Username" rules={usernameRules} hasFeedback>
                    <Input/>
                </Form.Item>

                <Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
                    <Input.Password/>
                </Form.Item>

                <Form.Item name="confirm" label="Confirm Password" dependencies={['password']}
                           hasFeedback rules={confirmRules}>
                    <Input.Password/>
                </Form.Item>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </div>
            </Form>

        </>
    );
};
  
 
