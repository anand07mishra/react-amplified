import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Space, Button, Switch, Input, Form, Popconfirm, Modal, Descriptions, message, Spin } from 'antd';
import { API } from 'aws-amplify';
import ReactPlayer from 'react-player/lazy'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const apiName = 'LiveChannelHandler-API';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
            API.post(apiName, '/admin/live/updateChannel', {
              body: {
                "channelId": record.id,
                "channelName": record.name,
                "channelStatus": statusVal
              },
            }).then((result) => {
              console.log(result);
            }).catch(err => {
              console.log(err);
            })
            message.loading('Changing status of Channel...');
            this.toggle();
            setTimeout(function () { //Start the timer
              this.setState({ loading: false });//After 10 second, set render to true              
              message.info('Refresh the if Channel status is not IDLE or ON');
              window.location.reload();
            }.bind(this), 10000)
          }} />
          :
          <Switch checkedChildren='ON' unCheckedChildren={text !== 'RUNNING' ? text : null} onChange={() => {
            let statusVal = (text === 'IDLE') ? "ON" : "OFF";
            API.post(apiName, '/admin/live/updateChannel', {
              body: {
                "channelId": record.id,
                "channelName": record.name,
                "channelStatus": statusVal
              },
            }).then((result) => {
              console.log(result);
            }).catch(err => {
              console.log(err);
            })
            message.loading('Changing status of Channel...');
            this.toggle();
            setTimeout(function () { //Start the timer
              this.setState({ loading: false });//After 10 second, set render to true              
              message.info('Refresh the if Channel status is not IDLE or ON');
              window.location.reload();
            }.bind(this), 10000)
          }} />
      )
    },
    {
      title: 'Live Stream',
      dataIndex: 'id',
      key: 'livestream',
      render: (channnelId, record) => (
        <Button id={channnelId} disabled={(record.state !== 'RUNNING') ? true : false} type="primary" ghost size='medium' onClick={() => {
          API.post(apiName, '/admin/live/liveStreamChannel/', {
            body: {
              "channelId": channnelId
            },
          }).then((result) => {
            this.setState({
              modalData: result.responseBody
            });
            console.log(result);
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
      dataIndex: 'name',
      key: 'name',
      render: (channelName, record) => (
        <Popconfirm placement="left" title={`Are you sure to delete channel ${channelName}?`} onConfirm={() => {
          API.post(apiName, '/admin/live/deleteChannel', {
            body: {
              "channelId": record.id
            },
          }).then((result) => {
            console.log(result);
          }).catch(err => {
            console.log(err);
          })
          this.toggle();
          setTimeout(function () { //Start the timer
            this.setState({ loading: false });//After 4 second, set render to true              
            message.success('Channel deleted successfully!');
            window.location.reload();
          }.bind(this), 4000)
        }} okText="Confirm">
          <Button type="primary" disabled={(record.state === 'RUNNING') ? true : false} danger size='medium'>Delete</Button>
        </Popconfirm>
      ),
    }
    ];
    this.state = {
      visible: false,
      tableData: [],
      modalData: [],
      loading: false
    }
    this.toggle = value => {
      this.setState({ loading: value });
    };
  }

  onClose = (e) => {
    this.setState({
      visible: false,
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
      <Spin indicator={antIcon} spinning={this.state.loading} delay={500}>
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
            <Descriptions.Item label="Live Stream Player"><ReactPlayer pip={true} controls={true} width='500px' height='320px' url={this.state.modalData.channelCDNUrl} /></Descriptions.Item>
          </Descriptions>
        </Modal>
        <Space direction="vertical">
          <Button type="primary" icon={<PlusOutlined />} size='large' onClick={() => { this.props.history.push('/CreateChannel') }}>Create Channel</Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={this.state.tableData}
            columns={columns} />
        </Space >
      </Spin >
    );
  }
}

export default LiveTable