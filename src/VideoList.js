import React from 'react'
import 'antd/dist/antd.css';
import { Card, Descriptions, Button, Space, Drawer } from 'antd';
import { Storage, API } from 'aws-amplify';

const gridStyle = {
    width: '50%',
    textAlign: 'center',
};

const apiName = 'processVideo'; // replace this with your api name.
const path = '/admin'; //replace this with the path you have configured on your API
const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
    response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {  // OPTIONAL
        firstName: 'Transcoding',
        lastName: 'Started...',
    },
};

class VideoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            uploadedList: []
        }
    }

    showDrawer = (e) => {
        this.setState({ [e.currentTarget.id]: true });
    };

    onClose = (e) => {
        this.setState({ [e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.id]: false });
    };

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
                                <Button id={item.eTag.substr(1, 4)} onClick={this.showDrawer}>
                                    {item.key}
                                </Button>
                                <Drawer
                                    id={item.eTag.substr(1, 4)}
                                    title={item.key}
                                    placement="bottom"
                                    closable={true}
                                    onClose={this.onClose}
                                    visible={this.state.[item.eTag.substr(1, 4)]}
                                    getContainer={false}
                                    destroyOnClose={true}
                                    style={{ position: 'absolute' }}
                                >
                                    <Descriptions bordered layout="vertical" size="large">
                                        <Descriptions.Item label="Video Title">{item.key}</Descriptions.Item>
                                        <Descriptions.Item label="Size">{Math.round(item.size / 1000000)}MB</Descriptions.Item>
                                    </Descriptions>
                                    <br />
                                    <Space>
                                        <Button type="primary" onClick={() =>
                                            API.get(apiName, path, myInit)
                                                .then(response => {
                                                    console.log(response);
                                                })
                                                .catch(error => {
                                                    console.log(error.response);
                                                })}>Edit</Button>
                                        <Button type="primary">Trancode</Button>
                                        <Button type="primary" danger onClick={() => Storage.remove(item.key)
                                            .then(result => console.log(result))
                                            .catch(err => console.log(err))}>Delete</Button>
                                    </Space>
                                </Drawer>
                            </div>
                        </Card.Grid>
                    )}
                </div>
            );
        }

    }
}

export default VideoList;
