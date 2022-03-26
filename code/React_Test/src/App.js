import React, {Component} from 'react'
import { Layout,Modal } from 'antd';
import moment from 'moment';
import Routes from './routes';
import Aside from './components/Aside';
import { createBrowserHistory } from 'history';
import './utils';
import './App.css';
import "./styles/base.css";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;

export default class App extends Component {
  state = {
    username: localStorage.getItem("username"),
    orgCode: localStorage.getItem("orgCode"),
    roleName: localStorage.getItem("roleId"),
    date: moment().format('YYYY-MM-DD'),// 当前时间
    collapsed: false,
    visible: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });

    fetch('http://localhost:8080/exit');
    const history = createBrowserHistory({forceRefresh: true});
    history.push('/login');
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    
    return (
      <Layout>
        <Aside pathname={this.props.location.pathname} collapsed={this.state.collapsed} />
        <Layout>
          <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
            <div className="app-title">
              <span>日期：{this.state.date}</span>
              <span></span>
              <span></span>
              <span></span>
              <span><label className="logout" onClick={this.showModal} >退出登录</label></span>
            </div>
          </Header>
          <Content className="site-layout-background" style={{ margin: 20,padding: 20}}>
            <Routes />
          </Content>
        </Layout>
        <Modal
          title="提示"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>确认退出登录？</p>
        </Modal>
      </Layout>
      
    );
  }
}