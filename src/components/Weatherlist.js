import React, { Component } from 'react';
import {SERVER_URL} from '../constants.js';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AddWeather from './AddWeather';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';

class Weatherlist extends Component {

  constructor(props) {
    super(props);
    this.state = { weathers: [], open: false, message: ''};
  }
  
    componentDidMount() {
      this.fetchWeathers();
    }
  
    // Fetch all weathers
    fetchWeathers = () => {
      // Read the token from the session storage
    // and include it to Authorization header
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + 'api/weathers', 
      {
        headers: {'Authorization': token}
      })
      .then((response) => response.json()) 
      .then((responseData) => { 
        this.setState({ 
          weathers: responseData._embedded.weathers,
        }); 
      })
      .catch(err => console.error(err)); 
    }

   // Delete weather
     onDelClick = (link) => {
      const token = sessionStorage.getItem("jwt");
      fetch(link, 
        { 
          method: 'DELETE',
          headers: {'Authorization': token}
        }
      )
      .then(res => {
        this.setState({open: true, message: 'Weather deleted'});
        this.fetchWeathers();
      })
      .catch(err => {
        this.setState({open: true, message: 'Error when deleting'});
        console.error(err)
      }) 
    }

    confirmDelete = (link) => {
      confirmAlert({
        message: 'Are you sure to delete?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.onDelClick(link)
          },
          {
            label: 'No',
          }
        ]
      })
    }

    // Add new weather
    addWeather(weather) {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + 'api/weathers', 
      { method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(weather)
      })
      .then(res => this.fetchWeathers())
      .catch(err => console.error(err))
    } 

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
      // Update weather
    updateWeather(weather, link) {
      const token = sessionStorage.getItem("jwt");
      fetch(link, 
      { method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(weather)
      })
      .then( res =>
        this.setState({open: true, message: 'Changes saved'})
      )
      .catch( err => 
        this.setState({open: true, message: 'Error when saving'})
      )
    }

    handleClose = (event, reason) => {
      this.setState({ open: false });
    };

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.weathers];
          data[cellInfo.index][cellInfo.column.id] = 
          e.target.innerHTML;
          this.setState({ weathers: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.weathers[cellInfo.index][cellInfo.column.id]
        }} 
      />
    );
  }

    render() {
      const columns = [{
        Header: 'Date',
        accessor: 'date',
        Cell: this.renderEditable
      }, {
        Header: 'Location',
        accessor: 'location',
        Cell: this.renderEditable
      }, {
        Header: 'Temperature',
        accessor: 'temperature',
        Cell: this.renderEditable,       
      }, {
        Header: 'Description',
        accessor: 'description',
        Cell: this.renderEditable
      }, {
        id: 'savebutton',
        sortable: false,
        filterable: false,
        width: 100,
        accessor: '_links.self.href',
        Cell: ({value, row}) => (<Button size="small" variant="text" color="primary" 
          onClick={()=>{this.updateWeather(row, value)}}>Save</Button>)
      }, {
        id: 'delbutton',
        sortable: false,
        filterable: false,
        width: 100,
        accessor: '_links.self.href',
        Cell: ({value}) => (<Button size="small" variant="text" color="secondary" 
          onClick={()=>{this.confirmDelete(value)}}>Delete</Button>)
      }]

    // Weatherlist.js render() method
    return (
      <div className="App">
        <Grid container>
          <Grid item>
            <AddWeather addWeather={this.addWeather} fetchWeathers={this.fetchWeathers}/>
          </Grid>
        </Grid>  
        <ReactTable data={this.state.weathers} columns={columns} 
          filterable={true} pageSize={10}/>
        <Snackbar 
          style = {{width: 300, color: 'green'}}
          open={this.state.open} onClose={this.handleClose} 
          autoHideDuration={1500} message={this.state.message} />
      </div>
    );
    }
  }

export default Weatherlist;