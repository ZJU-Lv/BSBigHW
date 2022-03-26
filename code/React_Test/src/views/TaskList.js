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
  
  export default class TaskList extends React.Component {
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
        const res = await fetch('http://localhost:8080/all_task')
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
                <TableCell>{creator[i]}</TableCell>
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
                    <Button variant="contained" onClick={() => this.seeTask(task_id[i])}>任务详情</Button>
                </TableCell>
              </TableRow>
        )
    }


    render(){
    return (
      <Card title="任务列表" bordered={false}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>示图</TableCell>
              <TableCell>任务名</TableCell>
              <TableCell>创建者</TableCell>
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

// export default class TaskList extends React.Component {


//     render() {
//         return (
//         <Card title="任务列表" bordered={false}>
//             {/* <Search
//                 placeholder="请输入搜索关键词"
//                 enterButton="查询"
//                 className="search"
//                 onSearch={value => this.searchServiceList(value)}
//             />
//             <div style={{ fontSize: 16,marginBottom:20 }}>
//                 <Button 
//                     type="primary"
//                     onClick={() => this.onBatchDelete()}
//                 >批量删除</Button>
//                 <Button type="primary" onClick={this.jump} style={{ float:'right' }}>创建服务号</Button>
//             </div>
//             <Table
//                 rowKey={item => item.id }
//                 onRow={(record)=>{
//                     return{
//                         onClick:()=>{
//                             let selectedRow = JSON.parse(JSON.stringify(selectedRowKeys));
//                             let idx = selectedRow.indexOf(record.id);
//                             if (idx == -1) selectedRow.push(record.id);
//                             else selectedRow.splice(idx, 1);
//                             this.setState({
//                                 selectedRowKeys:selectedRow
//                             })
//                         }
//                     }
//                 }}
//                 columns={columns}
//                 customRow={"setRow"}
//                 dataSource={serviceList}
//                 pagination={{
//                     total: pageTotal,
//                     current: current,
//                     pageSize: pageSize,
//                     onChange: this.goPage,
//                     showSizeChanger:false
//                 }}
//             /> */}
//         </Card>
//         )
//     }
// }