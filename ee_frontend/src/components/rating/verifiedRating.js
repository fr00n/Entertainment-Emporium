import {Card} from "antd";
import DislikeOutlined from "@ant-design/icons/DislikeOutlined";
import RobotOutlined from "@ant-design/icons/RobotOutlined";
import TrophyOutlined from "@ant-design/icons/TrophyOutlined";
import React from "react";
const {Meta} = Card;

export default function VerifiedRating(data){
    let media = data.media;
    return(
        <>
            {media.verifiedPercentage !== null ?(
                <>
                    <Card
                        bordered={false} style={{width: 300}}
                        cover={media.verifiedPercentage > 50 ? <TrophyOutlined style={{fontSize: '100px'}}/> :
                            <DislikeOutlined style={{fontSize: '100px'}}/>}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Meta title={`Verified users gave a rating of ${media.verifiedPercentage}%`}/>
                        </div>
                    </Card>
                </>
            ) : (
                <>
                    <Card
                        bordered={false} style={{width: 300}}
                        cover={<RobotOutlined style={{fontSize: '100px'}}/>}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Meta title={'No verified reviews for this media!'}/>
                        </div>
                    </Card>
                </>
            )}
        </>
    )
}