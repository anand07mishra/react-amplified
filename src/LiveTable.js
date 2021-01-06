import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Space, Button, Switch, Input, Form, Popconfirm, Modal, Descriptions } from 'antd';
import { API } from 'aws-amplify';
import { NavLink } from 'react-router-dom';
import ReactPlayer from 'react-player/lazy'

const apiName = 'LiveChannelHandler-API';

const myInit = {
  header: { contentType: 'application/json' },
};

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

class LiveTable extends React.Component {
  constructor() {
    super();
    this.columns = [{
      title: 'Channel Name',
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.name.length - b.name.length,
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => (
        text === 'RUNNING' ?
          <Switch checkedChildren='ON' unCheckedChildren={text !== 'RUNNING' ? text : null} defaultChecked onChange={() => {
            let statusVal = (text === 'IDLE') ? "ON" : "OFF";
            console.log(`Current Channel Status ${statusVal}`);
            API.post(apiName, '/admin/live/updateChannel', {
              body: {
                "channelId": record.id,
                "channelName": record.name,
                "channelStatus": "OFF"
              },
            }).then((result) => {
              console.log(result);
            }).catch(err => {
              console.log(err);
            })
          }} />
          :
          <Switch checkedChildren='ON' unCheckedChildren={text !== 'RUNNING' ? text : null} onChange={() => {
            let statusVal = (text === 'IDLE') ? "ON" : "OFF";
            console.log(`Current Channel Status ${statusVal}`);
            API.post(apiName, '/admin/live/updateChannel', {
              body: {
                "channelId": record.id,
                "channelName": record.name,
                "channelStatus": "OFF"
              },
            }).then((result) => {
              console.log(result);
            }).catch(err => {
              console.log(err);
            })
          }} />
      )
    },
    {
      title: 'Created',
      dataIndex: 'codec',
      key: 'codec',
    },
    {
      title: 'Live Stream',
      dataIndex: 'id',
      key: 'livestream',
      render: (channnelId) => (
        <Button id={channnelId} type="primary" ghost size='medium' onClick={() => {
          API.post(apiName, '/admin/live/liveStreamChannel/', {
            body: {
              "channelId": channnelId
            },
          }).then((result) => {
            this.setState({
              modalData: result.responseBody
            });
          }).catch(err => {
            console.log(err);
          });
          this.setState({
            visible: true,
          });
        }}>Live Stream</Button>
      )
    },
    {
      title: 'Action',
      key: '',
      render: (record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
          <Button type="primary" danger size='medium'>Delete</Button>
        </Popconfirm>
      ),
    }
    ];
    this.state = {
      visible: false,
      tableData: [],
      modalData: []
    }
  }

  onClose = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  componentDidMount() {
    API.get('LiveChannelHandler-API', '/admin/live/listChannels', myInit).then((result) => {
      this.setState({
        tableData: result.responseBody.channels
      });
    }).catch(err => {
      console.log(err);
    });
  }


  render() {
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <Space direction="vertical">
        <Modal
          title="Live Channel Details"
          centered
          visible={this.state.visible}
          onCancel={this.onClose}
          footer={null}
          width={600}
        >
          <Descriptions title={this.state.modalData.channelName} layout="vertical" bordered>
            <Descriptions.Item label="RTMP URL">{this.state.modalData.rtmpServerUrl}</Descriptions.Item>
            <Descriptions.Item label="Stream Key">{this.state.modalData.streamKey}</Descriptions.Item>
          </Descriptions>
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="Live Stream Player"><ReactPlayer pip={true} controls={true} width='500px' height='320px' url="https://b6d76811d0c6e6deca3d996b9ed217a8.egress.mediapackage-vod.us-west-2.amazonaws.com/out/v1/e083073b210e4b31991bd9ea953a5762/961f20833e764911bcec6ed14eea7438/a2fb3565f1e04cd4b4a4d2a8fe4a6ab8/index.m3u8" /></Descriptions.Item>
          </Descriptions>
        </Modal>
        <Button type="primary"><NavLink to="/CreateChannel">Create Channel</NavLink></Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.state.tableData}
          columns={columns} />
      </Space >
    );
  }
}

export default LiveTable