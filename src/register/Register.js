import React, {Component} from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // idkey:"",
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: ""
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    handleClicked(){
        let url = `https://localhost:3000/data`;
        let data = {
            user_id: this.state.user_id,
            user_firstname: this.state.user_firstname,
            user_lastname: this.state.user_lastname,
            user_email: this.state.user_email,
            user_phone: this.state.user_phone
        }
        axios.post(url, data);
        this.setState({
            // user_id: "",
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: ""
        });
        this.props.history.push('/Showdata');
    }

    render() {
        return(
            <div>
                <div className="App">
                <h2 className="my-4">Register<br/></h2>
                    <hr/>
                </div>
                <form className="container">
                    <div className="form-group">
                        <label className="text-white" >First Name</label>
                        <input type="text" className="form-control" id="user_firstname" onChange={this.handleChang} value={this.state.user_firstname}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white"  >Last Name</label>
                        <input type="text" className="form-control" id="user_lastname" onChange={this.handleChang} value={this.state.user_lastname}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white"  >Email</label>
                        <input type="email" className="form-control" id="user_email" onChange={this.handleChang} value={this.state.user_email}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white"  >Phone Number</label>
                        <input type="text" className="form-control" id="user_phone" onChange={this.handleChang} value={this.state.user_phone}/>
                    </div>
                    {/* <div className="form-group">
                        <label className="text-white"  htmlFor="id">Id</label>
                        <input type="text" className="form-control" size="10" id="idkey" onChange={this.handleChang} value={this.state.idkey}/>
                    </div> */}
                    <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                </form>
            </div>
        );
    }
}

export default function WithRouter(props) {
    const history = useHistory();
    return (<Register {...props} history={history} />);
}
