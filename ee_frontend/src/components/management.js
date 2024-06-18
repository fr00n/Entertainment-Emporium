import {Card, Space, Typography} from "antd";
import {Link} from "react-router-dom";
import EditOutlined from "@ant-design/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import FileAddOutlined from "@ant-design/icons/FileAddOutlined";
import StarOutlined from "@ant-design/icons/StarOutlined";
import SignatureOutlined from "@ant-design/icons/SignatureOutlined";
import ScissorOutlined from "@ant-design/icons/ScissorOutlined";
import UserAddOutlined from "@ant-design/icons/UserAddOutlined";
import UserDeleteOutlined from "@ant-design/icons/UserDeleteOutlined";
import React from "react";

const {Meta} = Card;
const {Title} = Typography;

export default function Management() {


    let movie = {
        "name": "Movie",
        "addLink": "/addMovie",
        "updateLink": "/updateMovie",
        "deleteLink": "/deleteMovie"
    }

    let tv = {
        "name": "Tv Show",
        "addLink": "/addTv",
        "updateLink": "/updateTv",
        "deleteLink": "/deleteTv"
    }

    let actors = {
        "name": "Actors",
        "addLink": "/createActor",
        "updateLink": "/updateActor",
        "deleteLink": "/deleteActor"
    }

    let producers = {
        "name": "Directors",
        "addLink": "/addDirector",
        "updateLink": "/updateDirector",
        "deleteLink": "/deleteDirector"
    }

    let users ={
        "name": "Users",
        "updateLink": "/updateUser",
        "deleteLink": "/deleteUser"
    }
    const mediaPortals = [movie, tv]
    const peoplePortals = [actors, producers]


    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <Title style={{color: "#000000", textAlign: 'center'}}>Media Management</Title>
                    {mediaPortals.map((portal) => (
                        <Space>
                            <Link to={portal.addLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<FileAddOutlined style={{fontSize: '100px'}}/>}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Create New ${portal.name}`}/>
                                    </div>
                                </Card>
                            </Link>

                            <Link to={portal.updateLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<EditOutlined style={{fontSize: '100px'}}/>}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Update ${portal.name}`}/>
                                    </div>
                                </Card>
                            </Link>

                            <Link to={portal.deleteLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<DeleteOutlined style={{fontSize: '100px'}}/>}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Delete ${portal.name}`}/>
                                    </div>
                                </Card>
                            </Link>
                        </Space>
                    ))}

                    <Title style={{color: "#000000", textAlign: 'center'}}>People Management</Title>
                    {peoplePortals.map((portal) => (
                        <Space>
                            <Link to={portal.addLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<StarOutlined style={{fontSize: '100px'}}/>}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Create New ${portal.name}`}/>
                                    </div>
                                </Card>
                            </Link>

                            <Link to={portal.updateLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<SignatureOutlined style={{fontSize: '100px'}}/>}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Update ${portal.name}`}/>
                                    </div>
                                </Card>
                            </Link>

                            <Link to={portal.deleteLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<ScissorOutlined style={{fontSize: '100px'}}/>}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Delete ${portal.name}`}/>
                                    </div>
                                </Card>
                            </Link>
                        </Space>
                    ))}

                    <Title style={{color: "#000000", textAlign: 'center'}}>User Management</Title>

                        <Space>

                            <Link to={users.updateLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<UserAddOutlined style={{fontSize: '100px'}}/>}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Update ${users.name}`}/>
                                    </div>
                                </Card>
                            </Link>

                            <Link to={users.deleteLink}>
                                <Card
                                    bordered={false} style={{width: 300}}
                                    cover={<UserDeleteOutlined style={{fontSize: '100px'}}/>}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Meta title={`Delete ${users.name}`}/>
                                    </div>
                                </Card>
                            </Link>
                        </Space>


                </Space>
            </div>
        </>
    )
};