import React from 'react';
import {Form, Input, Button, Typography, message, DatePicker, InputNumber} from 'antd';
import Session from "react-session-api";
import {useNavigate} from "react-router-dom";


const { TextArea } = Input;
const {Title} = Typography;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 6}},
    wrapperCol: {xs: {span: 24}, sm: {span: 12}}
};
const tailFormItemLayout = {
    wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}},
};


const titleRules = [
    {required: true, message: 'Please enter title of the movie'}
];

const castRules = [
    {message: 'Please enter the cast id list e.g 1,2,3'}
];

const producerRules = [
    {message: 'Please enter the producer id list e.g 1,2,3'}
];

const descriptionRules = [
    {required: true, message: 'Please enter the description'}
];

const runtimeRules = [
    {required: true, message: 'Please enter the runtime of movie in minutes'}
];

const coverRules = [
    {required: true, message: 'Please enter url of image'}
];

const releaseDateRules  = [
    {required: true, message: 'Please the release date of the movie'}
];



export default function AddMovie() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();


    const errorNotification = (errorMessage) => {
        messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    };

    const successNotification = () => {
        messageApi.open({
            type: 'success',
            content: 'Movie created successfully',
        });
    };


    const onFinish = async (values) => {
        try {
            console.log('Received values of form: ', values);
            const date = new Date(values.releaseDate);

            // Format the date in YYYY-MM-DD HH:MM:SS format
            const formattedDateTime = date.toISOString().slice(0, 19).replace('T', ' ');
            console.log(formattedDateTime);

            values.releaseDate = formattedDateTime;

            const response = await fetch(`${apiUrl}/api/v1/movies`,
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
                console.log('Movie created succesfully');
                successNotification();
                navigate(server.links.self);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }
    }


    return (
        <>
            {contextHolder}

            <Title style={{color: "#000000", textAlign: 'center'}}> Add New Movie </Title>

            <Form {...formItemLayout}
                  name="register"
                  onFinish={onFinish}
                  scrollToFirstError
            >

                <Form.Item name="title" label="Title" rules={titleRules} hasFeedback>
                    <Input/>
                </Form.Item>

                <Form.Item name="cast" label="Cast" rules={castRules} hasFeedback>
                    <Input/>
                </Form.Item>

                <Form.Item name="producers" label="Producers" rules={producerRules} hasFeedback>
                    <Input/>
                </Form.Item>

                <Form.Item name="releaseDate" label="Release Date" rules={releaseDateRules} hasFeedback>
                    <DatePicker />
                </Form.Item>

                <Form.Item name="runtime" label="Run TIme" rules={runtimeRules} hasFeedback>
                    <InputNumber/>
                </Form.Item>

                <Form.Item name="description" label="Description" rules={descriptionRules} hasFeedback>
                    <TextArea rows={4}/>
                </Form.Item>

                <Form.Item name="coverURL" label="Cover" rules={coverRules} hasFeedback>
                    <Input/>
                </Form.Item>


                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Add Movie
                        </Button>
                    </Form.Item>
                </div>
            </Form>

        </>
    );
};