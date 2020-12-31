import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, InputNumber, Button, Radio } from 'antd';
import { Select } from 'antd';
import { Storage, API, Amplify } from 'aws-amplify';
import { InfoCircleTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './index.css';
import { Tooltip } from 'antd';

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "LiveChannelHandler-API",
        endpoint: "https://11pz449in4.execute-api.us-west-2.amazonaws.com/live"
      }
    ]
  }
});
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: '${label} is required!'
};

const Demo = () => {  
  const onFinish = (values) => {
    console.log(values);
  };
};


const OPTIONS = ['1920*1080_8000K', '1280*720_3300K', '960*540_2000K'];
const { Option } = Select;


class CreateChannel extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  state = {
    selectedItems: [],
  };

  state = {
    value: 1,
  };


  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onFinish = (values) => {
    console.log("Inside finish");
    console.log(values);
    console.log(values.channel.channel_name);
    console.log(values.channel.channel_input_type);
    console.log(values.channel.application_name);
    console.log(values.channel.instance_name);
    console.log(values.channel.video_resolution);

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

  onChange = (value) => {
    console.log(`selected ${value}`);
  }

  onBlur = () => {
    console.log('blur');
  }

  onFocus = () => {
    console.log('focus');
  }

  onSearch = (val) => {
    console.log('search:', val);
  }


  render() {
    const { selectedItems } = this.state;
    const filteredOptions = ['1920*1080_8000K', '1280*720_3300K', '960*540_2000K'];
    return (
      <Form {...layout} name="nest-messages" ref={this.formRef} validateMessages={validateMessages} onFinish={this.onFinish}>
        <Form.Item
          name={['channel', 'channel_name']}
          alignment="left" label="Channel Name &nbsp;&nbsp;&nbsp;&nbsp;"
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
          alignment="left" label="Channel InputType"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a channel input type"
            optionFilterProp="children"
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onSearch={this.onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="RTMP_PUSH">RTMP_PUSH</Option>
          </Select>

        </Form.Item>
        <Form.Item
          name={['channel', 'application_name']}
          alignment="left" label="Application Name"
          rules={[
            {
              required: true,
            },
          ]}>
          <Input placeholder="Application Name Ex : test1" />
        </Form.Item>
        <Form.Item name={['channel', 'instance_name']} label="Instance Name&nbsp;&nbsp;&nbsp;&nbsp;" alignment="left"
          rules={[
            {
              required: true,
            },
          ]}>
          <Input placeholder="Instance Name Ex : live1" />
        </Form.Item>
        <Tooltip placement="topLeft" title="Please make sure to use video resolution equal to or greater than selected resolution, while doing the streaming.">
          <Form.Item name={['channel', 'video_resolution']} label="Video Resolution" alignment="left"
            rules={[
              {
                required: true,
              },
            ]}>
            <Select
              mode="multiple"
              placeholder="Please select Video Resolution"
              value={selectedItems}
              onChange={this.handleChange}
              style={{ width: '100%' }}
            >
              {filteredOptions.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Tooltip>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>         
        </Form.Item>
      </Form>
    );
  }
}

export default CreateChannel