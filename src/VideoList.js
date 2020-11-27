import React from 'react'
import 'antd/dist/antd.css';
import { Card, Descriptions, Button, Space, Drawer, Typography, message } from 'antd';
import { Storage, API, Amplify } from 'aws-amplify';
import { InfoCircleTwoTone } from '@ant-design/icons';
Amplify.configure({
    API: {
        endpoints: [
            {
                name: "CopyFileHandler-API",
                endpoint: "https://0yq213qelk.execute-api.us-west-2.amazonaws.com/user"
            }
        ]
    }
});

const { Text } = Typography;

const gridStyle = {
    width: '50%',
    textAlign: 'center',
};

const myInit = { // OPTIONAL
    header: { contentType: 'application/json' },  // OPTIONAL
    response: true,
};

class VideoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            uploadedList: [],
            data: [],
            loading: false
        }
    }

    showDrawer = (e) => {
        this.setState({ [e.currentTarget.id]: true });
    };

    onClose = (e) => {
        this.setState({ [e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.id]: false });
    };

    render() {

        API.get('CopyFileHandler-API', '/admin/asseturls', {}).then((result) => {
            this.setState({
                data: result.responseBody
            });
        }).catch(err => {
            console.log(err);
        });

        var videoName = {};

        this.state.data.map(item =>
            videoName[item.fileName] = item.assetUrl
        );

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
        var i = 0;
        if (error) {
            return (
                <div>Error: {error.message}</div>
            );
        } else {
            return (
                <div>
                    {uploadedList.map(item =>
                        <Card.Grid style={gridStyle} key={i++}>
                            <div className="site-drawer-render-in-current-wrapper">
                                <video style={{ width: 300, height: 180 }} src={"https://rsivideosolution-upload173311-dev.s3-us-west-2.amazonaws.com/public/" + item.key} type="video/mp4" controls></video><br />
                                <Button id={item.eTag.substr(1, 4)} icon={<InfoCircleTwoTone />} onClick={this.showDrawer}>
                                    {item.key}
                                </Button>
                                <Drawer
                                    id={item.eTag.substr(1, 4)}
                                    title={item.key}
                                    placement="bottom"
                                    closable={true}
                                    onClose={this.onClose}
                                    visible={this.state[item.eTag.substr(1, 4)]}
                                    getContainer={false}
                                    destroyOnClose={true}
                                    style={{ position: 'absolute' }}
                                ><Space direction="vertical">
                                        <Descriptions bordered layout="vertical" size="small">
                                            <Descriptions.Item label="Title">{item.key.split('.')[0]}</Descriptions.Item>
                                            <Descriptions.Item label="Size">{Math.round(item.size / 1000000)}MB</Descriptions.Item>
                                            <Descriptions.Item label="Format">{item.key.split('.').reverse()[0]}</Descriptions.Item>
                                        </Descriptions>
                                        {videoName[item.key.split('.')[0]] !== undefined ?
                                            <Text code>Transcoded URL: {videoName[item.key.split('.')[0]]}</Text>
                                            : null}
                                        <Space>
                                            <Button type="primary" ghost size='small'>Edit</Button>
                                            {videoName[item.key.split('.')[0]] === undefined ?
                                                <Button type="primary" disabled={this.state[item.eTag.substr(1, 6)]} size='small' loading={this.state.loading} onClick={() => {
                                                    this.setState({ loading: true });
                                                    API.get('CopyFileHandler-API', '/admin/processVideo?fileName=' + item.key, myInit).then((result) => {
                                                        console.log(result.data);
                                                        this.setState({
                                                            loading: false,
                                                            [item.eTag.substr(1, 6)]: true
                                                        });

                                                        message.loading(`Transcoding started... Playback URL will be ready after some time.`, 10);
                                                    }).catch(err => {
                                                        console.log(err);
                                                    })
                                                }}>Transcode</Button>
                                                : null}
                                            <Button type="primary" danger size='small' onClick={() => Storage.remove(item.key)
                                                .then(result => console.log(result))
                                                .catch(err => console.log(err))}>Delete</Button>
                                        </Space>
                                    </Space>
                                </Drawer>
                            </div>
                        </Card.Grid>
                    )
                    }
                </div >
            );
        }

    }
}

export default VideoList;
