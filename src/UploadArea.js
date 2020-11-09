import React from 'react';
import 'antd/dist/antd.css';
import { Storage } from 'aws-amplify';
import { Upload, message, Spin } from 'antd';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

class UploadArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false };
        this.toggle = value => {
            this.setState({ loading: value });
        };
    }
    handleUpload = (info) => {
        Storage.put(info.name, info, {
            progressCallback(progress) {
                var percnt = Math.round((progress.loaded / progress.total) * 100);
                if (percnt % 10 === 0) {
                    message.destroy();
                    message.loading(`Upload in progress...${percnt}%`);
                }
            },
        })
            .then(result => this.handleError())
            .catch(err => console.log('Error in uploading!'));
    };

    handleError = () => {
        message.success('Upload Completed');
        this.setState({ loading: false });
        window.location.reload();
    };

    render() {
        const container = (
            <Dragger accept='video/mp4' action={this.handleUpload} onChange={this.toggle}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
            </p>
            </Dragger>
        );

        const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

        return (
            <Spin indicator={antIcon} spinning={this.state.loading} delay={500}>
                {container}
            </Spin>
        );
    }
}

export default UploadArea;