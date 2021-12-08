import React, {Component} from "react";
import axios from "axios";
import Modal from 'react-awesome-modal';
import './Showdata.css';
//import '../../server/app';
import {ip,port} from "../setIP/setting";

export default class Showdata extends Component{
    constructor() {
        super();
        this.state ={
            list:[],
            user_id: 0,
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: ""
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
        //console.log("hello show data");
    }
    componentDidMount() {
        //console.log("before get data");
        this.getData();
        //console.log("after get data");
    }
    getData = () => {
        console.log("before fetch data");
        fetch('/data')
            .then(res => res.json())
            .then(list => this.setState({ list }))
        console.log("after fetch data");
    }

    onDelete=(user)=>{
        const result = window.confirm(`จะลบข้อมูล ${user.user_firstname} ${user.user_lastname} ใช่หรือไม่?`);
        if (result) {
            let url = `https://localhost:3000/delete`;
            let data = {
                user_id: user.user_id
            };
            axios.put(url,data);
            setTimeout(()=>{this.componentDidMount()},1);
        }
    }

    openModal() {
        this.setState({
            visible : true
        });

    }
    closeModal() {
        this.setState({
            visible : false
        });
    }
    call=(user)=>{
        this.openModal();
        this.setState({
            user_id: user.user_id,
            user_firstname: user.user_firstname,
            user_lastname: user.user_lastname,
            user_email: user.user_email,
            user_phone: user.user_phone
        })
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        // let url = `https://localhost:3000/data`;
        // let data = {
        //     user_id: this.state.user_id,
        //     user_firstname: this.state.user_firstname,
        //     user_lastname: this.state.user_lastname,
        //     user_email: this.state.user_email,
        //     user_phone: this.state.user_phone
        // }
        // axios.put(url,data)
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
        axios.put(url,data)
        this.setState({
            user_id: 0,
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: ""
        });
	this.closeModal();
        setTimeout(()=>{this.componentDidMount()},1)
    }
    render() {
        let {list} = this.state;

        return (
            <div className="App">
                <h2 className="my-4">Users Information<br/></h2>
                <hr/>
                <div className="container p-3 my-3 bg-dark text-white">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                                {list.map((user) =>{
                                    return(
                                        <tr>
                                            <td>{user.user_id}</td>
                                            <td>{user.user_firstname}</td>
                                            <td>{user.user_lastname}</td>
                                            <td>{user.user_email}</td>
                                            <td>{user.user_phone}</td>
                                            <td><button type="button" class="btn btn-warning" onClick={()=>this.call(user)}>Edit</button></td>
                                            <td><button type="button" class="btn btn-danger"  onClick={()=>this.onDelete(user)}>Delete</button></td>
                                            <div className="box">
                                                <Modal visible={this.state.visible}
                                                    width="1200"
                                                    height="600"
                                                    effect="fadeInUp"
                                                    onClickAway={() => this.closeModal()}
                                                >
                                                    <form className="container" id='form'>
                                                        <div className="form-group">
                                                            <h3><label htmlFor="id">ID: {this.state.user_id}<br/></label></h3>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Firstname:</label>
                                                            <input type="text" className="form-control" id="user_firstname" onChange={this.handleChang} value={this.state.user_firstname}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Lasttname:</label>
                                                            <input type="text" className="form-control" id="user_lastname" onChange={this.handleChang} value={this.state.user_lastname}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Email:</label>
                                                            <input type="text" className="form-control" id="user_email" onChange={this.handleChang} value={this.state.user_email}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Phone Number:</label>
                                                            <input type="text" className="form-control" id="user_phone" onChange={this.handleChang} value={this.state.user_phone}/>
                                                        </div>
                                                        <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                                                    </form>
                                                </Modal>
                                            </div>
                                        </tr>
                                    )})}
                        </tbody>
                    </table>
                </div><br/>
            </div>
        );
    }
}
