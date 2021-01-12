import React from 'react'
import VideoList from './VideoList';
import UploadArea from './UploadArea';
import { Space, Card, Row, Col } from 'antd';


export default function Playlist() {
    return (
        <Space direction="vertical">
            <Row>
                <Col span={24}>
                    <Card title="Upload" type="inner">
                        <UploadArea />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card title="Playlist" type="inner">
                        <VideoList />
                    </Card>
                </Col>
            </Row>
        </Space>
    )
}
