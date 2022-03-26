import React, {useState} from 'react';
import { Card,Button } from 'antd';
import https from "../api/https";
import "../styles/information.css";
export default class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
        }

    }

    async componentWillMount(){
        const res = await fetch("http://localhost:8080/user_info");
        const data = await res.json();
        console.log(data);
        this.setState({
            username: data.username,
            email: data.email,
        });
    }
    
    render() {
        return (
            <Card title="基本信息" bordered={false}>
                <div className="card-item"> 
                    <label>用户名：</label>
                    <span>{this.state.username}</span>
                </div>
                <div className="card-item"> 
                    <label>邮箱：</label>
                    <span>{this.state.email}</span>
                </div>
            </Card>
        )

    }
}