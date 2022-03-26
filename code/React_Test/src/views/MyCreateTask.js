import React from 'react';
import { Card,Space,Input,Modal,message } from 'antd';
import { createBrowserHistory } from 'history';
import "../styles/createTask.css";
import "../styles/img/top.png";

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { url } from 'video.js';
  
  export default class MyCreateTask extends React.Component {
    state = {
        image_url: [],
        task_name: [],
        creator: [],
        is_received: [],
        is_finished: [],
        task_id: [],
        index: [],
    }

    async componentWillMount(){
        const res = await fetch('http://localhost:8080/my_create_task')
        const data = await res.json()

        let {image_url = [], task_name = [], creator = [], is_received = [], is_finished = [], task_id = [], index = []} = this.state;
        for(var i=0;i<data.length;i++)
        {
            console.log(data[i].is_received);
            image_url.push(data[i].image_name);
            task_name.push(data[i].task_name);
            creator.push(data[i].creator);
            is_received.push(data[i].is_received);
            is_finished.push(data[i].is_finished);
            task_id.push(data[i].task_id);
            index.push(i);
        }
        this.setState({image_url, task_name, creator, is_received, is_finished, task_id, index});
    }

    seeTask(i){
      const getInformation = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            taskid: i,
        }),
      };
      fetch("http://localhost:8080/see_task", getInformation);
      const history = createBrowserHistory({forceRefresh: true});
      history.push('/user/seeTask')
    }

    seeTaskResult(i){
      const getInformation = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            taskid: i,
        }),
      };
      fetch("http://localhost:8080/begin_mark", getInformation);
      const history = createBrowserHistory({forceRefresh: true});
      history.push('/user/seeTaskResult')
    }

    createData(i){
        let {image_url = [], task_name = [], creator = [], is_received = [], is_finished = [], task_id = []} = this.state;
        return(
            <TableRow
                key={task_name[i]}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                    <img src={require('../image/'+image_url[i])} alt="task image" width="80" height="80"></img>
                </TableCell>
                <TableCell>{task_name[i]}</TableCell>
                <TableCell>
                  <Button variant="contained" color={is_received[i]==='true' ? 'error' : 'success'}>
                    {is_received[i]==='true' ? '是' : '否'}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color={is_finished[i]==='true' ? 'error' : 'success'}>
                    {is_finished[i]==='true' ? '是' : '否'}
                  </Button>
                </TableCell>
                <TableCell>
                    <Button variant="contained" color={is_finished[i]==='false' ? 'primary' : 'error'} onClick={is_finished[i]==='false' ? () => this.seeTask(task_id[i]) : () => this.seeTaskResult(task_id[i])}>
                        {is_finished[i]==='false' ? '任务详情' : '查看结果'}
                    </Button>
                </TableCell>
              </TableRow>
        )
    }


    render(){
    return (
      <Card title="我创建的任务" bordered={false}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>示图</TableCell>
              <TableCell>任务名</TableCell>
              <TableCell>是否已被领取</TableCell>
              <TableCell>是否已完成</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.index.map((i) => (
                this.createData(i)
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Card>
    );
    }
  }
