import {Button, Form, Input, Rate, message, Typography} from "antd";
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
const textRules = [
    {required: true, message: 'Please input your review'}
];

export default function CreateTvReview(data){

    let tv = data.tv;
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
            content: 'Review created successfully',
        });
    };


    const onFinish = async (values) => {
        console.log('Success:', values);
        values.tvId = tv.id;
        try {
            const response = await fetch(`${apiUrl}/api/v1/tvReviews`,
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
                console.log('Tv review created successfully')
                successNotification();

            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            errorNotification(error.message);
        }

    };


    return(
        <>
            {contextHolder}
            <Title level={3} style={{color: "#000000", textAlign: 'center'}}>Create a Review</Title>
            <Form {...formItemLayout}
                  name="register"
                  onFinish={onFinish}
                  scrollToFirstError
            >
                <Form.Item name="score" label="Score" hasFeedback>
                    <Rate defaultValue={0} />
                </Form.Item>

                <Form.Item name="text" label="Review Description" rules={textRules} hasFeedback>
                    <TextArea rows={4} placeholder={"Write a review now..."}/>
                </Form.Item>


                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Create Review
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    )
}