import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createBrowserHistory } from 'history';

const theme = createTheme();

export default class SeeTask extends React.Component {
  state = {
      ImageNames: [],
      TaskName: '任务1',
      TaskRequirement: '标注人脸',
      CreatorName: 'lzy',
      IsReceived: '',
  }

  async componentWillMount(){
    const res = await fetch('http://localhost:8080/task_info')
    const data = await res.json()

    let {ImageNames = [], TaskName, TaskRequirement, CreatorName, IsReceived} = this.state;
    TaskName = data[0].task_name;
    TaskRequirement = data[0].task_requirement;
    CreatorName = data[0].creator_name;
    IsReceived = data[0].is_received;
    for(var i=1;i<data.length;i++)
    {
        ImageNames.push(data[i].image_name);
    }
    this.setState({ImageNames, TaskName, TaskRequirement, CreatorName, IsReceived});
  }

  async ReceiveTask(){
      if(this.state.IsReceived==='false')
      {
        const res = await fetch('http://localhost:8080/receive_task');
        const data = await res.json()
        if(data.self==='false')
        {
          alert('领取任务成功！');
          const history = createBrowserHistory({forceRefresh: true});
          history.push('/user/taskList');
        }
        else
        {
          alert('自己不能领取自己的任务！');
        }
      }
      else
      {
          alert('任务已被领取，不能重复领取！');
      }
  }

  render(){
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '60vh' }}>
      <Stack direction="row" spacing={10}>
        <Card>
        <Stack spacing={5}>
        <Chip label="图片列表" color="success"></Chip>
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {this.state.ImageNames.map((item) => (
                <ImageListItem key={item}>
                <img
                    src={require('../image/'+item)}
                    srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt="task"
                    loading="lazy"
                />
                </ImageListItem>
            ))}
        </ImageList>
        </Stack>
        </Card>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Stack spacing={3}>
            <Chip label={this.state.TaskName} color="primary"></Chip>
            <Chip label={'创建者: '+this.state.CreatorName} color="warning"></Chip>
            <Typography component="h1" variant="h8">
                    <strong>以下是本次任务的标注要求：</strong>
            </Typography>
            <TextField id="filled-basic" variant="filled" value={this.state.TaskRequirement} multiline sx={{ width: 400 }}/>
            <Box sx={{ mt: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color={this.state.IsReceived==='false' ? 'primary' : 'warning'}
                onClick={() => this.ReceiveTask()}
              >
                {this.state.IsReceived==='false' ? '领取任务' : '任务已被领取'}
              </Button>
            </Box>
            </Stack>
          </Box>
        </Grid>
        </Stack>
      </Grid>
    </ThemeProvider>
  );
  }
}