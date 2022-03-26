import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import {
    FolderOutlined,
    UserOutlined,
    TeamOutlined,
    MessageOutlined,
    BarChartOutlined,
    PieChartOutlined,
    AreaChartOutlined,
    SlidersOutlined,
    MenuOutlined,
    HeartOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

class Aside extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo" />
                <Menu 
                    theme="dark" 
                    mode="inline"
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.props.pathname]}
                >
                    
                    <SubMenu key="sub1" icon={<FolderOutlined />} title="图片标注工具">
                    <Menu.Item key="/information" icon={<UserOutlined />}>
                        <Link to={'/user/information'} >基本信息</Link>
                    </Menu.Item>
                    <Menu.Item key="/createTask" icon={<AppstoreOutlined />}>
                        <Link to={'/user/createTask'} >新建任务(图片)</Link>
                    </Menu.Item>
                    <Menu.Item key="/createVideoTask" icon={<AppstoreAddOutlined />}>
                        <Link to={'/user/createVideoTask'} >新建任务(视频)</Link>
                    </Menu.Item>
                    <Menu.Item key="/taskList" icon={<MenuOutlined />}>
                        <Link to={'/user/taskList'} >任务列表</Link>
                    </Menu.Item>
                    <Menu.Item key="/myTask" icon={<MessageOutlined />}>
                        <Link to={'/user/myTask'} >我领取的任务</Link>
                    </Menu.Item>
                    <Menu.Item key="/myCreateTask" icon={<SlidersOutlined />}>
                        <Link to={'/user/myCreateTask'} >我创建的任务</Link>
                    </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )

    }
}

export default Aside;