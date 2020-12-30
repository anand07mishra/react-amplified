import React from 'react'
import { Table } from 'antd';
import { Amplify, API } from 'aws-amplify';

Amplify.configure({
    API: {
        endpoints: [
            {
                name: "AdminVODAPI",
                endpoint: "https://kccs8cd1ci.execute-api.us-west-2.amazonaws.com/user"
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

    componentDidMount() {
        API.get('AdminVODAPI', '/admin/asseturls', {}).then((result) => {
            this.setState({
                data: result.responseBody
            });
            console.log(result);
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Table columns={columns} dataSource={this.state.data} />
        );
    }
}

export default MappingTable
