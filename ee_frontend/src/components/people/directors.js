import {Card, Col, Result, Row} from "antd";
import MehOutlined from "@ant-design/icons/MehOutlined";
import React from "react";
const {Meta} = Card;

export default function Directors(data){
    let directors = data.directors;
    return(
        <>
            <Row type="flex" justify="space-around" gutter={16}>
                {directors.length !== 0 ? (
                    <>
                        {directors.length > 1 ? (
                            <>
                                {directors.map((member) => (
                                    <Col span={4} key={member.id}>

                                        <Card bordered={false} style={{width: 200}}
                                              cover={<img src={member.avatarURL} alt={`${member.firstName} ${member.lastName}`}/>}>
                                            <Meta title={`${member.firstName} ${member.lastName}`}/>
                                        </Card>

                                    </Col>
                                ))}
                            </>
                        ):(
                            <>
                                {directors && (
                                    <Col span={4} key={directors.id}>

                                        <Card bordered={false} style={{width: 200}}
                                              cover={<img src={directors.avatarURL} alt={`${directors.firstName} ${directors.lastName}`}/>}>
                                            <Meta title={`${directors.firstName} ${directors.lastName}`}/>
                                        </Card>

                                    </Col>
                                )}
                            </>
                        )}
                    </>
                ):(
                    <>
                        <Result
                            icon={<MehOutlined/>}
                            title="There are no directors attached to this yet"
                        />
                    </>
                )}
            </Row>
        </>
    )
}