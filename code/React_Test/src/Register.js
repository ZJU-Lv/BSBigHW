import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

const theme = createTheme();

export default function Register() {
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('name').length < 6) {
      alert("用户名不能少于6位！")
      return
    }
    if (data.get('password').length < 6) {
      alert("密码不能少于6位！")
      return
    }
    let have_at = false;
    let have_point = false;
    let pos_at = -1;
    let pos_point = -1;
    for (var i = 0; i < data.get('email').length; i++) {
      if (data.get('email')[i] === '.') {
        if (have_at === false) {
          alert("邮箱格式不正确!");
          return
        }
        else if (have_point === false) {
          have_point = true;
          pos_point = i;
        }
      }
      else if (data.get('email')[i] === '@') {
        if (i === 0 || i === data.get('email').length - 1) {
          alert("邮箱格式不正确!");
          return
        }
        else if (data.get('email')[i - 1] === '.' || data.get('email')[i + 1] === '.') {
          alert("邮箱格式不正确!");
          return
        }
        else if (have_at === false) {
          have_at = true;
          pos_at = i;
        }
      }
    }

    async function fetchData() {
      const getInformation = {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          password: data.get('password'),
        }),
      };
      const res = await fetch("http://localhost:8080/register", getInformation);
      const res_data = await res.json();
      if(res_data.unique==="name_false")
      {
        alert("该用户名已被注册！");
      }
      else if(res_data.unique==="email_false")
      {
        alert("该邮箱已被注册！");
      }
      else
      {
        alert("注册成功！");
        history.push('/login');
      }
    }
    fetchData()
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="User Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
