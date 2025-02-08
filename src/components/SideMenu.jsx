import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const SideMenu = ({ collapsed }) => (
  <Sider collapsible collapsed={collapsed}>
    <div className="logo" />
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        <Link to="/customers">Customers</Link>
      </Menu.Item>
    </Menu>
  </Sider>
);

export default SideMenu;