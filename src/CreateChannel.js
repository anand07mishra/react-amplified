import React from 'react';
import { Form, Input, Button, Radio, Select, Card, Space } from 'antd';
import { API } from 'aws-amplify';
import { InfoCircleOutlined } from '@ant-design/icons';

const filteredOptions = ['1920*1080_8000K', '1280*720_3300K', '960*540_2000K'];

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!',
};

class CreateChannel extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    }
  }

  formRef = React.createRef();

  onReset = () => {
    this.formRef.current.resetFields();
  };

  onFinish = (values) => {
    API.post('LiveChannelHandler-API', '/admin/live/createChannel', {
      body: {
        "channelName": values.channel.channel_name,
        "applicationName": values.channel.application_name,
        "applicationInstance": values.channel.instance_name,
        "inputType": values.channel.channel_input_type,
        "videoResolutions": values.channel.video_resolution
      }, // replace this with attributes you need
      headers: {}, // OPTIONAL
    }).then((result) => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    return (
      <Card title="Create Channel">
        <Form layout="vertical" ref={this.formRef} validateMessages={validateMessages} onFinish={this.onFinish}>
          <Form.Item
            name={['channel', 'channel_name']}
            label="Channel Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Channel Name" />
          </Form.Item>
          <Form.Item
            name={['channel', 'channel_input_type']}
            label="Channel Input Type"
            rules={[{ required: true, }]}
          >
            <Radio.Group>
              <Radio.Button value="RTMP_PUSH">RTMP_PUSH</Radio.Button>
              <Radio.Button value="MP4_FILE">MP4_FILE</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={['channel', 'application_name']}
            label="Application Name"
            rules={[
              {
                required: true,
              },
            ]}>
            <Input placeholder="Application Name Ex : test1" />
          </Form.Item>
          <Form.Item name={['channel', 'instance_name']} label="Instance Name"
            rules={[
              {
                required: true,
              },
            ]}>
            <Input placeholder="Instance Name Ex : live1" />
          </Form.Item>
          <Form.Item name={['channel', 'video_resolution']} label="Video Resolution"
            rules={[
              {
                required: true,
              },
            ]} tooltip={{ title: 'Please make sure to use video resolution equal to or greater than selected resolution, while doing the streaming.', icon: <InfoCircleOutlined /> }}>
            <Select
              mode="multiple"
              placeholder="Please select Video Resolution"
            >
              {filteredOptions.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
          </Button>
              <Button htmlType="button" onClick={this.onReset}>
                Reset
          </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default CreateChannel