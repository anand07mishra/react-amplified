import React from 'react'
import 'antd/dist/antd.css';
import { Card, Row, Col, Descriptions, Badge, Button, Space } from 'antd';
import { Storage } from 'aws-amplify';

const gridStyle = {
    width: '50%',
    textAlign: 'center',
};

class VideoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            uploadedList: []
        }
    }
    render() {
        Storage.list('') // for listing ALL files without prefix, pass '' instead
            .then(
                (result) => {
                    this.setState({
                        uploadedList: result
                    });
                },
                (error) => {
                    this.setState({ error });
                }
            );
        const { error, uploadedList } = this.state;
        var { videoName, videoSize } = this.state;
        if (error) {
            return (
                <div>Error: {error.message}</div>
            );
        } else {
            return (
                <Row>
                    <Col span={16}>
                        <Card title="Video List" >
                            {uploadedList && uploadedList.map(item =>
                                <Card.Grid style={gridStyle}>
                                    <video style={{ width: 300 }} src={"https://rsivideosolution-upload173311-dev.s3-us-west-2.amazonaws.com/public/" + item.key} type="video/mp4" controls></video><br />
                                    <p>{item.key}</p>
                                    {videoName = item.key}
                                    {videoSize = item.size}
                                </Card.Grid>
                            )}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Info">
                            <Descriptions bordered layout="vertical" size="large" extra={<Space><Button type="primary">Edit</Button><Button type="primary">Trancode</Button><Button type="primary" danger>Delete</Button></Space>}>
                                <Descriptions.Item label="Video Title">{videoName}</Descriptions.Item>
                                <Descriptions.Item label="Size">{Math.round(videoSize/1000000)}MB</Descriptions.Item>
                                <Descriptions.Item label="Status"><Badge status="processing" />In Progress</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row >
            );
        }

    }
}

export default VideoList;
