import {Card, Col, Rate, Result, Row, message} from "antd";
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import MehOutlined from "@ant-design/icons/MehOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import React from "react";
import Session from "react-session-api";

const {Meta} = Card;

export default function MovieReview(data){
    let reviews = data.reviews;
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
            content: 'Review deleted successfully',
        });
    };

    const deleteReview = async(id) =>{
        try {
            const response = await fetch(`${apiUrl}/api/v1/movieReviews/${id}`,
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
    return(
        <>
            {contextHolder}
            {reviews.length !== 0 ? (
                <>
                    {Session.get("role") === "admin" ? (
                        <>
                            <Row type="flex" justify="space-around" gutter={16}>

                                {reviews.map((review) =>

                                    <Col span={4} key={review.id}>
                                        <Card bordered={false} style={{width: 300}}
                                              cover={<Rate disabled defaultValue={review.score}/>}
                                              actions={[
                                                  <DeleteOutlined style={{color: 'red'}} key="delete" onClick={() => deleteReview(review.id)}/>
                                              ]} >
                                            <Meta avatar={review.verified ? <CheckOutlined/> : < UserOutlined/>}
                                                  title={`${review.username}`} description={`${review.text}`}/>
                                        </Card>
                                    </Col>

                                )}
                            </Row>
                        </>
                    ) : (
                        <>
                            <Row type="flex" justify="space-around" gutter={16}>

                                {reviews.map((review) =>

                                    <Col span={4} key={review.id}>
                                        <Card bordered={false} style={{width: 300}}
                                              cover={<Rate disabled defaultValue={review.score}/>}>
                                            <Meta avatar={review.verified ? <CheckOutlined/> : < UserOutlined/>}
                                                  title={`${review.username}`} description={`${review.text}`}/>
                                        </Card>
                                    </Col>

                                )}
                            </Row>
                        </>
                    )}

                </>
            ) : (
                <Result
                    icon={<MehOutlined/>}
                    title="There are no reviews for this movie yet, be the first..."
                />
            )}
        </>
    )
}