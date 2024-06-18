import {Card, Col, Result, Row} from "antd";
import MehOutlined from "@ant-design/icons/MehOutlined";
import React from "react";
const {Meta} = Card;
export default function Cast(data){
    let cast = data.cast;
    return(
        <>
            <Row type="flex" justify="space-around" gutter={16}>
                {cast.length !== 0 ? (
                    <>
                        {cast.length > 1 ? (
                            <>
                                {cast.map((member) => (
                                    <Col span={4} key={member.id}>

                                        <Card bordered={false} style={{width: 200}}
                                              cover={<img src={member.avatarURL} alt={`${member.firstName} ${member.lastName}`}/>}>
                                            <Meta title={`${member.firstName} ${member.lastName}`}/>
                                        </Card>

                                    </Col>
                                ))}
                            </>
                        ) : (
                            <>
                                <Col span={4} key={cast.id}>

                                    <Card bordered={false} style={{width: 200}}
                                          cover={<img src={cast.avatarURL} alt={`${cast.firstName} ${cast.lastName}`}/>}>
                                        <Meta title={`${cast.firstName} ${cast.lastName}`}/>
                                    </Card>

                                </Col>
                            </>
                        )}
                    </>
                ):(
                    <>
                        <Result
                            icon={<MehOutlined/>}
                            title="There are no cast members attached to this yet"
                        />
                    </>
                )}

            </Row>
        </>
    )

}