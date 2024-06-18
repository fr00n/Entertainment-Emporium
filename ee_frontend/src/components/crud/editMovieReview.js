import {Button, Form, Input, message, Rate, Typography} from "antd";
import React from "react";
import Session from "react-session-api";
const {Title} = Typography;


const {TextArea} = Input;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 6}},
    wrapperCol: {xs: {span: 24}, sm: {span: 12}}
};
const tailFormItemLayout = {
    wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}},
};

export default function EditMovieReview(data) {
    let review = data.review[0];
    let movie = data.movie;
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
            content: 'Review edited successfully',
        });
    };

    const deleteReview = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/movieReviews/${review.id}`,
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
                console.log('Review Deleted successfully')
                successNotification();
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }
    }
    const onFinish = async (values) => {
        values.movieId = movie.id;
        console.log()
        console.log('Success:', values);
        try {
            const response = await fetch(`${apiUrl}/api/v1/movieReviews/${review.id}`,
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
                console.log('Movie review created successfully')
                successNotification();

            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }

    };


    return (
        <>
            {contextHolder}
            <Title level={3} style={{color: "#000000", textAlign: 'center'}}>Edit your review</Title>
            <Form {...formItemLayout}
                  name="register"
                  onFinish={onFinish}
                  scrollToFirstError
            >
                <Form.Item name="score" label="Score" hasFeedback>
                    <Rate defaultValue={review.score}/>
                </Form.Item>

                <Form.Item name="text" label="Review Description" hasFeedback>
                    <TextArea rows={4} placeholder={review.text}/>
                </Form.Item>


                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Update Review
                        </Button>
                    </Form.Item>
                </div>
            </Form>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Button danger onClick={() => deleteReview()}>Delete Your Review</Button>
            </div>
        </>
    )
}