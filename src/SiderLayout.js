import React from 'react';
import 'antd/dist/antd.css';
import {
  DesktopOutlined,
  HomeOutlined,
  YoutubeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import VideoList from './VideoList';
import UploadArea from './UploadArea';
import { Layout, Menu, Breadcrumb, Space, Card, Row, Col } from 'antd';



const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              RSI Video Solution
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Live
            </Menu.Item>
            <SubMenu key="sub1" icon={<YoutubeOutlined />} title="VOD">
              <Menu.Item key="3">Movies</Menu.Item>
              <Menu.Item key="4">TV Series</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<UserOutlined />} title="User">
              <Menu.Item key="5">Profile</Menu.Item>
              <Menu.Item key="6">Settings</Menu.Item>
              <Menu.Item key="7">Notifications</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Upload</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Space direction="vertical">
                <Row>
                  <Col span={24}>
                    <Card title="Upload">
                      <UploadArea />
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Card title="Video List" >
                      <VideoList />
                    </Card>
                  </Col>
                </Row>
              </Space>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>RSI Video Solution ©2020 Created by R Systems International Pvt. Ltd.</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default SiderLayout