import React from 'react';
import { Card, Tabs } from 'antd';
import { createBrowserHistory } from 'history';
import "../styles/createTask.css";

import TextField from '@mui/material/TextField';

export default class CreateTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      preview: false,
      previewImg: null,
      deleteFile: '',

      name: '',
      requirement: ''
    }
  }

  handleSelect = event => {
    event.preventDefault()
    this.fileInput.click()
  }
  handleDragOver = event => {
    event.preventDefault()
    event.stopPropagation()
  }
  handleDrop = event => {
    event.preventDefault()
    event.stopPropagation()
    const { files } = this.state
    Array.prototype.forEach.call(event.dataTransfer.files, file => {
      const src = URL.createObjectURL(file)
      file.src = src
      this.setState({
        files: [...files, file]
      })
      this.fileInput.value = ''
    })
  }
  handleUpload = event => {
    const history = createBrowserHistory({ forceRefresh: true })
    event.preventDefault()
    const { files } = this.state
    if (files.length === 0) {
      this.fileInput.click()
      return
    }

    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append("files", file, file.name)
    })
    this.AsyncFetch(formData);

    const xhr = new XMLHttpRequest()
    xhr.timeout = 3000
    xhr.open('POST', 'upload')
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percent = event.loaded / event.total
        console.log(percent)
      }
    }
    xhr.onload = () => {
      if (xhr.status === 200 && xhr.readyState === 4) {
        alert('创建任务成功')
      } else {
        alert('创建任务失败')
      }
    }
    // xhr.send(formData)
    alert('创建任务成功')
    this.setState({
      files: []
    })
    this.fileInput.value = ''

    history.push('/user/taskList')
  }

  async AsyncFetch(formData) {
    await fetch('http://localhost:8080/upload_image', {
      method: 'POST',
      body: formData
    })


    const getInformation = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        name: this.state.name,
        requirement: this.state.requirement,
      }),
    };
    await fetch("http://localhost:8080/create_task", getInformation)
  }

  handleDelete = event => {
    event.preventDefault()
    event.stopPropagation()
    const { target: { dataset: { index } } } = event
    const { files } = this.state

    const newFiles = files.filter((file, index2) => {
      if (index2 === +index) {
        URL.revokeObjectURL(file.src)
        return false
      }
      return true
    })
    this.setState({
      files: newFiles
    })
  }
  handleChange = event => {
    event.preventDefault()
    const { files } = this.state
    Array.prototype.forEach.call(this.fileInput.files, file => {
      const src = URL.createObjectURL(file)
      file.src = src
      this.setState({
        files: [...files, file]
      })
      this.fileInput.value = ''
    })
  }
  showPreview = event => {
    const { currentTarget: { dataset: { index } } } = event
    const { files } = this.state
    this.setState({
      preview: true,
      previewImg: {
        name: files[+index].name,
        src: files[+index].src
      }
    })
  }
  hidePreview = event => {
    this.setState({
      preview: false,
      previewImg: null
    })
  }
  handleImgDragStart = event => {
    const { dataTransfer, currentTarget: { dataset: { index } } } = event
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/plain', index)
    event.currentTarget.style.borderColor = '#0000FF'
    this.dustbin.style.borderColor = '#FF0000'
    this.setState({
      deleteFile: ''
    })
  }
  handleImgDrag = event => {

  }
  handleImgDragEnd = event => {
    const { dataTransfer } = event
    dataTransfer.clearData('text/plain')
    event.currentTarget.style.borderColor = '#000000'
    this.dustbin.style.borderColor = '#CCCCCC'
  }
  componentWillMount() {
    document.ondragover = event => {
      event.preventDefault()
      event.stopPropagation()
    }
    document.ondrop = event => {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  componentWillUnmount() {
    const { files } = this.state
    files.forEach(file => {
      URL.revokeObjectURL(file.src)
    })
  }

  NameChangeEvent(e) {
    this.setState({
      name: e.target.value
    })
  }

  RequirementChangeEvent(e) {
    this.setState({
      requirement: e.target.value
    })
  }

  render() {
    return (
      <Card title="新建任务" bordered={false}>
        <div className="app">
          <div className='right'>
            <input
              ref={el => { this.fileInput = el }}
              className='hide'
              type='file'
              accept='image/*'
              multiple={true}
              onChange={this.handleChange}
            />
            {
              this.state.files.map((file, index) => {
                return (
                  <div
                    key={index}
                    className='img-wrap'
                    onClick={this.showPreview}
                    data-index={index}
                    draggable={true}
                    onDragStart={this.handleImgDragStart}
                    onDragEnd={this.handleImgDragEnd}
                  >
                    <div className='close' onClick={this.handleDelete} data-index={index}></div>
                    <img draggable={false} alt={file.name} src={file.src} />
                  </div>
                )
              })
            }
            <button className='btn-select' onClick={this.handleSelect} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>选择图片</button>
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
        </div>
      </Card>
    );
  }
}