import React from 'react';
import Session from 'react-session-api';
import {useNavigate} from "react-router-dom";


import { Form, Input, Button, Typography, message } from 'antd';
const { Title } = Typography;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};
const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

const passwordRules = [
    { required: true, message: 'Please input your password!' }
];

const usernameRules = [
    { required: true, message: 'Please input your username!', whitespace: true }
];

export default function Login () {

  const [messageApi, contextHolder] = message.useMessage();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();




  const errorNotification = (errorMessage) => {
    messageApi.open({
      type: 'error',
      content: errorMessage,
    });
  };

  const onFinish = async (values) => {
    console.log('Recieved values of form: ', values);
    try {
      const response = await fetch(`${apiUrl}/api/v1/login`,
      {
        method: 'POST',
        body: JSON.stringify(values),
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
        console.log('User logged in succesfully')
        Session.set("username", server.username);
        Session.set("role", server.role);
        Session.set("token", server.token);
        navigate(server.links.self)
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      errorNotification(error.message);
    }
  }
  return(
    <>
      {contextHolder}
      <Title style = {{color: "#000000", textAlign: 'center'}}> Log in to your account </Title>

      <Form {...formItemLayout}  
        name="login"
        onFinish={onFinish} 
        scrollToFirstError
      > 

        <Form.Item name="username" label="Username" rules={usernameRules} hasFeedback >
              <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={passwordRules} hasFeedback >
              <Input.Password />
        </Form.Item>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>

          <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                    Login
              </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};
