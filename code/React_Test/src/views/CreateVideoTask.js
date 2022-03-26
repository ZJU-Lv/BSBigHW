import React, { PureComponent } from 'react'
import { Card as CARD, Tabs } from 'antd';
import { createBrowserHistory } from 'history';
import "../styles/createTask.css";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default class CreateVideoTask extends PureComponent {
    state = {
        name: '',
        path: '',
        preview: null,
        data: null,
        screenshot_num: 0,

        task_name: '',
        task_requirement: ''
    }

    handleSelect = event => {
        event.preventDefault()
        this.fileInput.click()
    }

    changeName = (e) => {
        this.setState({ name: e.target.value })
    }

    changePath = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        let src, preview, type = file.type;
        if (/^image\/\S+$/.test(type)) {

            src = URL.createObjectURL(file)
            preview = <img src={src} alt='' />

        } else if (/^video\/\S+$/.test(type)) {

            src = URL.createObjectURL(file)
            preview = <video src={src} width='600' height='400' autoPlay loop controls />

        } else if (/^text\/\S+$/.test(type)) {
            const self = this;
            const reader = new FileReader();
            reader.readAsText(file);
            //注：onload是异步函数，此处需独立处理
            reader.onload = function (e) {
                preview = <textarea value={this.result} readOnly></textarea>
                self.setState({ path: file.name, data: file, preview: preview })
            }
            return;
        }
        this.setState({ path: file.name, data: file, preview: preview })
    }

    upload = () => {

        const data = this.state.data;
        if (!data) {
            console.log('未选择文件');
            return;
        }

        //此处的url应该是服务端提供的上传文件api 
        // const url = 'http://localhost:3000/api/upload';
        const url = 'http://192.168.155.207:3000/api/containers/common/upload';

        const form = new FormData();

        //此处的file字段由服务端的api决定，可以是其它值
        form.append('file', data);

        fetch(url, {
            method: 'POST',
            body: form
        }).then(res => {
            console.log(res)
        })
    }

    cancel = () => {
        this.props.closeOverlay();
    }

    Screenshot = () => {
        var video = document.getElementsByTagName('video')[0];
        video.crossorigin = 'anonymous'
        var canvas = document.getElementById('canvas');
        var cobj = canvas.getContext('2d'); //获取绘图环境
        cobj.drawImage(video, 0, 0, 600, 400);
        let base64 = canvas.toDataURL('image/jpeg', 1)
        console.log(base64)

        const getInformation = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                imgByte: base64,
            }),
        };
        fetch("http://localhost:8080/base64_image", getInformation)

        this.setState({
            screenshot_num: this.state.screenshot_num+1
        })
    }

    NameChangeEvent(e) {
        this.setState({
            task_name: e.target.value
        })
    }

    RequirementChangeEvent(e) {
        this.setState({
            task_requirement: e.target.value
        })
    }

    handleUpload = event => {
        const history = createBrowserHistory({ forceRefresh: true })
        const getInformation = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                name: this.state.task_name,
                requirement: this.state.task_requirement,
            }),
        };
        fetch("http://localhost:8080/create_video_task", getInformation)
        alert('创建任务成功')
        history.push('/user/taskList')
    }

    render() {
        const { name, path, preview } = this.state;
        return (
            <CARD title="新建任务" bordered={false}>
                <Stack spacing={8}>
                    <div>
                        <input
                            ref={el => { this.fileInput = el }}
                            className='hide'
                            type='file'
                            accept='video/*'
                            multiple={false}
                            onChange={this.changePath}
                        />
                        <Stack direction="row" spacing={3}>
                            <button className='btn-select' onClick={this.handleSelect}>选择视频</button>
                        </Stack>
                        {
                            this.state.preview ?
                                <div className='media'>
                                    <Stack direction="row" spacing={3}>
                                        {preview}
                                        <canvas id="canvas" width="600" height="400" backgroundColor='#ccc'></canvas>
                                    </Stack>
                                </div>
                                : null
                        }
                        <Stack direction="row" spacing={3}>
                            <Button size="medium" variant='contained' onClick={this.Screenshot}>截图</Button>
                            <Typography variant="h6" component="div">
                                (已截取 {this.state.screenshot_num} 张图片)
                            </Typography>
                        </Stack>
                    </div>

                    <div>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="task_name"
                            label="任务名称"
                            name="task_name"
                            autoComplete="task name"
                            variant="outlined"
                            onChange={(e) => this.NameChangeEvent(e)}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="task_requirement"
                            label="任务内容"
                            name="task_requirement"
                            autoComplete="task requirement"
                            variant="standard"
                            onChange={(e) => this.RequirementChangeEvent(e)}
                            multiline
                        />
                        <button className='btn-upload' onClick={this.handleUpload}>创建任务</button>
                    </div>
                </Stack>
            </CARD>
        )
    }
}