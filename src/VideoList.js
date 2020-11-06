import React from 'react'
import 'antd/dist/antd.css';
import { Card, Popover, Descriptions, Badge } from 'antd';

const gridStyle = {
    width: '30%',
    textAlign: 'center',
};

const content = (
    <Descriptions
        title="Info"
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
    >
        <Descriptions.Item label="Video Title">Video Name</Descriptions.Item>
        <Descriptions.Item label="Resolution">1920 x 1080</Descriptions.Item>
        <Descriptions.Item label="Bitrate">85k</Descriptions.Item>
        <Descriptions.Item label="Encoder">H.264</Descriptions.Item>
        <Descriptions.Item label="Codec">mp4</Descriptions.Item>
        <Descriptions.Item label="Status"><Badge status="processing" />In Progress</Descriptions.Item>
    </Descriptions>
);

function VideoList() {
    return (
        <Card title="Video List">
            <Popover content={content}>
                <Card.Grid style={gridStyle}>
                    <video id="video" src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" controls></video><br />
                    <p>Video 1</p>
                </Card.Grid>
            </Popover>
            <Popover content={content}>
                <Card.Grid style={gridStyle}>
                    <video id="video" src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" controls></video><br />
                    <p>Video 2</p>
                </Card.Grid>
            </Popover>
            <Popover content={content}>
                <Card.Grid style={gridStyle}>
                    <video id="video" src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" controls></video><br />
                    <p>Video 3</p>
                </Card.Grid>
            </Popover>
            <Popover content={content}>
                <Card.Grid style={gridStyle}>
                    <video id="video" src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" controls></video><br />
                    <p>Video 4</p>
                </Card.Grid>
            </Popover>
            <Popover content={content}>
                <Card.Grid style={gridStyle}>
                    <video id="video" src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" controls></video><br />
                    <p>Video 5</p>
                </Card.Grid>
            </Popover>
            <Popover content={content}>
                <Card.Grid style={gridStyle}>
                    <video id="video" src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" controls></video><br />
                    <p>Video 6</p>
                </Card.Grid>
            </Popover>
        </Card>
    )
}

export default VideoList
