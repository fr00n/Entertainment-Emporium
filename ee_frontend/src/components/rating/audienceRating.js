import {Card} from "antd";
import FrownOutlined from "@ant-design/icons/FrownOutlined";
import MessageOutlined from "@ant-design/icons/MessageOutlined";
import SmileOutlined from "@ant-design/icons/SmileOutlined";
import React from "react";
const {Meta} = Card;

export default function AudienceRating(data){
    let media = data.media;
    return(
        <>
            {media.audiencePercentage !== null ?(
                <>
                    <Card
                        bordered={false} style={{width: 300}}
                        cover={media.audiencePercentage > 50 ? <SmileOutlined style={{fontSize: '100px'}}/> :
                            <FrownOutlined style={{fontSize: '100px'}}/>}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Meta title={`The audience gave a rating of ${media.audiencePercentage}%`}/>
                        </div>
                    </Card>
                </>
            ):(
                <>
                    <Card
                        bordered={false} style={{width: 300}}
                        cover={media.audiencePercentage > 50 ? <SmileOutlined style={{fontSize: '100px'}}/> :
                            <MessageOutlined style={{fontSize: '100px'}}/>}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Meta title={'No audience reviews for this media!'}/>
                        </div>
                    </Card>
                </>
            )}
        </>
    )
}