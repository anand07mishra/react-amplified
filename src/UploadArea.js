import React from 'react';
import 'antd/dist/antd.css';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

import { Upload, message, Spin } from 'antd';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';

Amplify.configure(awsconfig);

const { Dragger } = Upload;

const props = {
    accept: 'video/mp4',
    customRequest(info) {
        Storage.put(info.file.name, info.file, {
            progressCallback(progress) {
                var percnt = Math.round((progress.loaded / progress.total) * 100);
                message.loading(`Upload in progress...${percnt}%`, 0.01);
            },
        })
            .then(result => message.success('Upload Completed'))
            .catch(err => message.error('Error in uploading!'));
    },
};

class UploadArea extends React.Component {
    state = { loading: false };

    toggle = value => {
        this.setState({ loading: value });
    };

    render() {
        const container = (
            <Dragger {...props} onSuccess={this.toggle}>
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