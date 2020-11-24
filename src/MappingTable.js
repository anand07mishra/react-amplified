import React from 'react'
import { Table } from 'antd';
import { Amplify, API } from 'aws-amplify';

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

const columns = [
    {
        title: 'File Name',
        dataIndex: 'fileName',
        key: 'fileName',
    },
    {
        title: 'Asset Url',
        dataIndex: 'assetUrl',
        key: 'assetUrl',
    }
];

class MappingTable extends React.Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    render() {

        API.get('CopyFileHandler-API', '/admin/asseturls', {}).then((result) => {
            this.setState({
                data: result.responseBody
            });
        }).catch(err => {
            console.log(err);
        });

        return (
            <Table columns={columns} dataSource={this.state.data} />
        );
    }
}

export default MappingTable
