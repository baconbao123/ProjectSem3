import React, { useEffect, useState} from "react";
import {Container, Row, Card, Button, Col, Image} from "react-bootstrap";
// @ts-ignore
import loginImage from '@src/images/login.jpg';
import $axios from "@src/axios.ts";
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Checkbox
} from "@mui/material";
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
// @ts-ignore
import Cookies from "js-cookie"
import {useDispatch} from "react-redux";
import {setLoading, setToast, setUserEmail, setUserId, setUserName, setUserPhone} from "@src/Store/Slinces/appSlice.ts";


const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        checkToken()
    }, []);

    const checkToken = () => {
        dispatch(setLoading(true))
        $axios.get('/Auth').then(res => {
            window.history.go(-1)
        })
            .catch(err => {
                console.log(err)
                Cookies.remove("token")
                Cookies.remove("refreshToken")
                dispatch(setLoading(false))
            })

    }
    const login = () =>  {
        dispatch(setLoading(true))
        $axios.post('Auth/login', {email, password, remember}).then(
            (res) => {
                dispatch(setToast({status: "success", message: "Login successful"}))
                if (res.data.token) {
                    Cookies.set("token", res.data.token, {expires: 0.1});
                }
                if (res.data.refreshToken) {
                    Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 });
                }
                location.replace('/')
            }
            )
            .catch((err) => {
                dispatch(setToast({status: "error", message: "Login fail"}))
                console.log(err)
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }


    return (
      <Container fluid  className="d-flex justify-content-center align-items-center vw-100 vh-100" style={{backgroundColor: '#ccc'}}>
          <Card style={{ width: '68rem', height: '32rem'}}>
              <Card.Header>LOGIN</Card.Header>
              <Card.Body className="text-center d-flex justify-content-center">
                  <Row className="d-flex justify-content-center align-items-center">
                      <Col md={5} >
                          {/*Start email*/}
                          <Col className="mb-3 text-start">
                              <TextField fullWidth label="Email" variant="outlined" onChange={e => setEmail(e.target.value)}/>
                          </Col>
                          {/*Start password*/}
                          <Col className="mb-3 text-start">
                              <FormControl fullWidth variant="outlined">
                                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                  <OutlinedInput
                                      id="outlined-adornment-password"
                                      onChange={e => setPassword(e.target.value)}
                                      type={showPassword ? 'text' : 'password'}
                                      endAdornment={
                                          <InputAdornment position="end">
                                              <IconButton
                                                  aria-label="toggle password visibility"
                                                  onClick={() => setShowPassword(!showPassword)}
                                                  edge="end"
                                              >
                                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                              </IconButton>
                                          </InputAdornment>
                                      }
                                      label="Password"
                                  />
                              </FormControl>
                          </Col>
                          {/*Remember me*/}
                          <Col className="mb-3 text-start">
                              <FormGroup>
                                  <FormControlLabel control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} color="default" />} label="Remember me" />
                              </FormGroup>
                          </Col>
                      <Button onClick={login} className='w-100'>Login</Button>
                      </Col>
                      <Col md={7} className="d-flex justify-content-center align-items-center">
                          <Image src={loginImage} style={{width: '75%'}}/>
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
      </Container>
    )
}

export default Login;