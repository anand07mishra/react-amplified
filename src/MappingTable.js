import React from 'react'
import { Table } from 'antd';
import { API } from 'aws-amplify';

const apiName = 'AdminVODAPI';

const myInit = {
    header: { contentType: 'application/json' },
};

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
        API.get(apiName, '/admin/asseturls', myInit).then((result) => {
            this.setState({
                data: result.responseBody
            });
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
