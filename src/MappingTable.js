import React from 'react'
import { Table } from 'antd';
import { Amplify, API } from 'aws-amplify';

Amplify.configure({
    API: {
        endpoints: [
            {
                name: "CopyFileHandler-API",
                endpoint: "https://jsonplaceholder.typicode.com"
            }
        ]
    }
});

const columns = [
    {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Body',
        dataIndex: 'body',
        key: 'body',
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
        API.get('CopyFileHandler-API', '/posts', {}).then((result) => {
            this.setState({
                data: result
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
