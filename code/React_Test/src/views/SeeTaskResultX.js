import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ReactPictureMarker from 'react-picture-marker';
import { defaultPositions } from 'ui-picture-bd-marker/lib/config'
import { useHistory } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function SeeTaskResultX() {
    const history = useHistory();

    let marker = null;

    const [initialData, setInitialData] = useState([]);

    const [imageName, setImageName] = useState('Lizu.jpeg');
    const [taskName, setTaskName] = useState('');
    const [taskRequirement, setTaskRequirement] = useState('');
    const [receiver, setReceiver] = useState('');
    const [xx, setXx] = useState(false);

    const defaultOptions = {
        deviceType: 'both',//both | mouse | touch
        blurOtherDots: false,//高亮当前选框，隐藏其他选框的操作点
        blurOtherDotsShowTags: false,//在blurOtherDots生效下，隐藏其他选框的标签
        editable: false,
        showTags: true,
        supportDelKey: false,//支持键盘删除键
        tagLocation: defaultPositions.bottom,//bottom|out_bottom
        trashPositionStart: 1,// 删除图标在前还是后（leading|trailing）值 ，bool值
        boundReachPercent: 0.01,//选框最大到达边界（0.01%），单位：百分比
    }

    const onMarkerRef = (ref) => {
        marker = ref.current//简单marker包装对象
        //   marker.getMarker() //获取真实marker对象，api参照ui-picture-bd-marker
    }

    const preImage = () => {
        fetch('http://localhost:8080/sub_image_num');
        history.push('/user/seeTaskResult')
        console.log(imageName.current)
    }

    const nextImage = () => {
        fetch('http://localhost:8080/add_image_num');
        history.push('/user/seeTaskResult')
    }

    const DownloadPASCALVOC = () => {
        async function fetchData() {
            const res = await fetch('http://localhost:8080/download_PASCALVOC');
            const data = await res.json();
            alert('导出成功！请到"'+data.download_path+'"文件夹查看结果');
        }
        fetchData()
    }

    const DownloadCOCO = () => {
        async function fetchData() {
            const res = await fetch('http://localhost:8080/download_COCO');
            const data = await res.json();
            alert('导出成功！请到"'+data.download_path+'"文件夹查看结果');
        }
        fetchData()
    }

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('http://localhost:8080/marking_get_info');
            const data = await res.json();
            setImageName(data.image_name)
            setTaskName(data.task_name)
            setTaskRequirement(data.task_requirement)
            setReceiver(data.receiver)
        }
        async function fetchInitialData() {
            const res = await fetch('http://localhost:8080/mark_initial_data');
            const data = await res.json();
            console.log(data)

            let initial_data = []
            for(var i=0;i<data.length;i++)
            {
                initial_data.push(
                    {
                        "tag": "tag",
                        "uuid": data[i].uuid,
                        "tagName": data[i].tagName,
                        "position":
                        {
                            "x": data[i].x,
                            "y": data[i].y,
                            "x1": data[i].xm,
                            "y1": data[i].ym
                        }
                    }
                )
            }
            setInitialData(initial_data)
        }
        async function InitialFunction() {
            await fetchData()
            await fetchInitialData() 
            setXx(true)   
        }
        InitialFunction()
    },[])

    if (xx)
        return (
            <div>
                <Stack direction="row" spacing={10}>
                    <div style={{ width: '60%' }}>
                        <Stack spacing={2}>
                            <Chip label='标注结果' color="success"></Chip>
                            <br />
                            <ReactPictureMarker
                                onMarkerRef={onMarkerRef}
                                imgUrl={require("../image/" + imageName)}
                                uniqueKey={`${+new Date()}`}
                                width={'100%'} // 百分比或实际值
                                ratio={16 / 9} //长宽比 默认16：9
                                defaultValue={initialData}
                                config={
                                    {
                                        options: {
                                            ...defaultOptions
                                        },
                                        onAnnoContextMenu: function (annoData, element, key) {
                                            console.log("🦁onAnnoContextMenu🦁 data=", annoData);
                                        },
                                        onAnnoRemoved: function (annoData, key) {
                                            console.log("🦁onAnnoRemoved🦁 data=", annoData);
                                            const getInformation = {
                                                method: "POST",
                                                headers: {
                                                    "Access-Control-Allow-Origin": "*",
                                                    "Content-type": "application/json;charset=utf-8",
                                                },
                                                body: JSON.stringify({
                                                    uuid: annoData.uuid,
                                                    name: annoData.tagName,
                                                    x: annoData.position.x,
                                                    y: annoData.position.y,
                                                    xm: annoData.position.x1,
                                                    ym: annoData.position.y1,
                                                }),
                                            };
                                            fetch("http://localhost:8080/delete_tag", getInformation)
                                            return true;
                                        },
                                        onAnnoAdded: function (insertItem, element, key) {
                                            console.log("🦁onAnnoAdded🦁 data=", insertItem);
                                            let is_initial = false;
                                            for(var i=0;i<initialData.length;i++)
                                            {
                                                if(insertItem.uuid===initialData[i].uuid)
                                                is_initial = true;
                                            }
                                            if(is_initial===false)
                                            {
                                                const getInformation = {
                                                    method: "POST",
                                                    headers: {
                                                        "Access-Control-Allow-Origin": "*",
                                                        "Content-type": "application/json;charset=utf-8",
                                                    },
                                                    body: JSON.stringify({
                                                        uuid: insertItem.uuid,
                                                        name: insertItem.tagName,
                                                        x: insertItem.position.x,
                                                        y: insertItem.position.y,
                                                        xm: insertItem.position.x1,
                                                        ym: insertItem.position.y1,
                                                    }),
                                                };
                                                fetch("http://localhost:8080/add_tag", getInformation)
                                            }
                                        },
                                        onAnnoChanged: function (newValue, oldValue, key) {
                                            const getInformation = {
                                                method: "POST",
                                                headers: {
                                                    "Access-Control-Allow-Origin": "*",
                                                    "Content-type": "application/json;charset=utf-8",
                                                },
                                                body: JSON.stringify({
                                                    uuid: newValue.uuid,
                                                    name: newValue.tagName,
                                                    x: newValue.position.x,
                                                    y: newValue.position.y,
                                                    xm: newValue.position.x1,
                                                    ym: newValue.position.y1,
                                                }),
                                            };
                                            fetch("http://localhost:8080/change_tag", getInformation)
                                        },
                                        onAnnoDataFullLoaded: function (key) {
                                            console.log("🦁onAnnoDataFullLoaded🦁 data=", key);
                                        },
                                        onAnnoSelected: function (value, element, key) {
                                            console.log("🦁onAnnoSelected🦁 data=", value);
                                        },
                                        onUpdated: function (data) {
                                            console.log("onUpdated data=", data);
                                        }
                                    }
                                }
                            />
                            <div>
                                <Button onClick={(e) => { preImage() }}>上一张图片</Button>
                                <Button onClick={(e) => { nextImage() }}>下一张图片</Button>
                            </div>
                        </Stack>
                    </div>

                    <div style={{ width: '30%' }}>
                        <Stack spacing={2}>
                            <Chip label={taskName} color="primary"></Chip>
                            <Chip label={'完成者: ' + receiver} color="warning"></Chip>
                            <Typography component="h1" variant="h8">
                                <strong>以下是本次任务的标注要求：</strong>
                            </Typography>
                            <TextField id="filled-basic" variant="filled" value={taskRequirement} multiline />
                            <Button
                                onClick={(e) => { DownloadPASCALVOC() }}
                                fullWidth
                                variant="contained"
                                color="error"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                导出数据集<br/>(PASCAL VOC格式)
                            </Button>
                            <Button
                                onClick={(e) => { DownloadCOCO() }}
                                fullWidth
                                variant="contained"
                                color="error"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                导出数据集<br/>(COCO格式)
                            </Button>
                        </Stack>
                    </div>
                </Stack>
            </div>
        );
    else
        return (<div></div>)
}
