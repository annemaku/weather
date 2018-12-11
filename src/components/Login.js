import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Weatherlist from './Weatherlist';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {username: '', password: '', 
    isAuthenticated: false, open: false};
  }

  handleChange = (event) => {
    this.setState({[event.target.name] : event.target.value});
  }

  login = () => {
    const user = {username: this.state.username, 
        password: this.state.password};
        console.log('before fetch', user)
    fetch('http://localhost:8080/login', {
      method: 'POST',
      body: JSON.stringify(user)
    })
    .then(res => {
      const jwtToken = res.headers.get('Authorization');
      console.log('saatiin vastaus', res)
      if (jwtToken !== null) {
        sessionStorage.setItem("jwt", jwtToken);
        console.log('get jwtToken')
        this.setState({isAuthenticated: true});
      }
      else {
        this.setState({open: true});
      }
    })
    .catch(err => console.error(err)) 
  }

  handleClose = (event) => {
    this.setState({ open: false });
  }

  logout = () => {
    sessionStorage.removeItem("jwt");
    this.setState({isAuthenticated: false});
  }

render() {
  if (this.state.isAuthenticated === true) {
    return (<Weatherlist />)
  }
  else {
    return (
      <div>
        <TextField type="text" name="username" 
         placeholder="Username" 
        onChange={this.handleChange} /><br/> 
        <TextField type="password" name="password" 
         placeholder="Password" 
        onChange={this.handleChange} /><br/><br/> 
        <Button variant="contained" color="primary" 
         onClick={this.login}>
          Login
        </Button>
        <Snackbar 
          open={this.state.open} onClose={this.handleClose} 
          autoHideDuration={1500} 
          message='Check your username and password' />
      </div>
    );
  }
}
}

export default Login;
