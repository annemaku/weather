import React from 'react';
import SkyLight from 'react-skylight';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DatePicker from 'react-date-picker';

class AddWeather extends React.Component {

    constructor(props) {
        super(props);
        this.state = {weatherdate: '', location: '', temperature: '', description: '', date: new Date()};
     }

    handleChange = (event) => {
      this.setState(
        {[event.target.name]: event.target.value}
      );
    }

    onChange = weatherdate => this.setState({ weatherdate })

    // Save weather and close modal form
    handleSubmit = (event) => {
        event.preventDefault();
        var newWeather = {weatherdate: this.state.weatherdate, location: this.state.location, 
        temperature: this.state.temperature, description: this.state.description};
        this.props.addWeather(newWeather); 
        this.refs.addDialog.hide(); 
    }

    // Cancel and close modal form
    cancelSubmit = (event) => {
    event.preventDefault(); 
    this.refs.addDialog.hide(); 
    }    
   
    render() {
        return (
          <div>
            <SkyLight hideOnOverlayClicked ref="addDialog">
              <h3>New weather</h3>
              <form>
                  <DatePicker
                  onChange={this.onChange}
                  value={this.state.weatherdate}
                />
                <br/>
                <TextField label="Location" placeholder="Location" 
                  name="location" onChange={this.handleChange}/><br/>
                <TextField label="Temperature" placeholder="Temperature" 
                  name="temperature" onChange={this.handleChange}/><br/>
                <TextField label="Description" placeholder="Description" 
                  name="description" onChange={this.handleChange}/><br/>
                <Button variant="outlined" color="primary" 
                  onClick={this.handleSubmit}>Save</Button> 
                <Button variant="outlined" color="secondary" 
                  onClick={this.cancelSubmit}>Cancel</Button> 
              </form> 
            </SkyLight>
            <div>
               <Button variant="contained" color="primary" 
                  style={{'margin': '10px'}} 
                  onClick={() => this.refs.addDialog.show()}>New Weather</Button>
            </div>
          </div> 
        );
    }
}

export default AddWeather;