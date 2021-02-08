import React from 'react';
import {
  Route,
  NavLink,
  BrowserRouter
} from 'react-router-dom';
import 'antd/dist/antd.css';
import {
  DesktopOutlined,
  HomeOutlined,
  YoutubeOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Playlist from './Playlist';
import MappingTable from './MappingTable';
import LiveTable from './LiveTable';
import CreateChannel from './CreateChannel';
import Home from './Home';
import { Auth } from 'aws-amplify';

import { Layout, Menu } from 'antd';

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
        <BrowserRouter>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <NavLink to="/">RSI Video Solution</NavLink>
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                <NavLink to="/LiveTable">Live</NavLink>
              </Menu.Item>
              <SubMenu key="sub1" icon={<YoutubeOutlined />} title="VOD">
                <Menu.Item key="3"><NavLink to="/Playlist">Playlist</NavLink></Menu.Item>
                <Menu.Item key="4"><NavLink to="/MappingTable">Mapping</NavLink></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<UserOutlined />} title="User">
                <Menu.Item key="5">Profile</Menu.Item>
                <Menu.Item key="6">Settings</Menu.Item>
                <Menu.Item key="7">Notifications</Menu.Item>
              </SubMenu>
              <Menu.Item key="8" icon={<LogoutOutlined />} onClick={() => {
                Auth.signOut()
                  .catch(err => console.log(err));
                window.location.reload();
              }}>
                Signout
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: '0 16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Route exact path="/" component={Home} />
                <Route exact path="/Playlist" component={Playlist} />
                <Route exact path="/MappingTable" component={MappingTable} />
                <Route exact path="/LiveTable" component={LiveTable} />
                <Route exact path="/CreateChannel" component={CreateChannel} />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>RSI Video Solution ©2020 Created by R Systems International Pvt. Ltd.</Footer>
          </Layout>
        </BrowserRouter>
      </Layout>
    );
  }
}

export default SiderLayout;