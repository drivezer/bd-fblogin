import React, {Component} from "react";
import axios from "axios";
import Modal from 'react-awesome-modal';
import './Showdata.css';

export default class Showdata extends Component{
    constructor() {
        super();
        this.state ={
            list:[],
            list_province: [],
            list_district: [],
            list_subdistrict: [],
            list_village: [],
            user_id: 0,
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: "",
            user_created_by: "",
            updated_at: "",
            user_province_id: "",
            user_district_id: "",
            user_sub_district_id: "",
            user_village_id: "",
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
        //console.log("hello show data");
    }

    _baseURL = '';

    componentDidMount() {
        setTimeout( () => {
            this.getData();
        }, 1);
    }
    getData = () => {
        console.log("before fetch data");
        fetch('/data')
            .then(res => res.json())
            .then(list => {
                this.setState({ list });
            })
        console.log("after fetch data");
    }

    onDelete=(user)=>{
        const result = window.confirm(`จะลบข้อมูล ${user.user_firstname} ${user.user_lastname} ใช่หรือไม่?`);
        if (result) {
            let url = `${this._baseURL}/delete`;
            let data = {
                user_id: user.user_id
            };
            axios.put(url,data);
            this.componentDidMount();
        }
    }

    getProvinces() {
        axios.get('/provinces')
        .then(res => {
            this.setState(() => ({list_province: res.data}));
        });
    }

    getDistricts(value) {
        axios.get(`/districts?provinceId=${value}`)
        .then(res => {
            this.setState(() => ({list_district: res.data}));
        });
    }

    getSubDistricts(value) {
        axios.get(`/subdistricts?districtId=${value}`)
        .then(res => {
            this.setState(() => ({list_subdistrict: res.data}));
        });
    }

    getVillage(value) {
        axios.get(`/villages?subdistrictId=${value}`)
        .then(res => {
            this.setState(() => ({list_village: res.data}));
        });
    }

    openModal(user) {
        this.getProvinces();
        this.getDistricts(user.provinceId);
        this.getSubDistricts(user.districtId);
        this.getVillage(user.subdistrictId);

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
        this.openModal(user);
        this.setState({
            user_id: user.user_id,
            user_firstname: user.user_firstname,
            user_lastname: user.user_lastname,
            user_email: user.user_email,
            user_phone: user.user_phone,
            user_created_by: user.user_created_by,
            updated_at: user.updated_at,
            user_province_id: user.user_province_id,
            user_district_id: user.user_district_id,
            user_sub_district_id: user.user_sub_district_id,
            user_village_id: user.user_village_id,
        })
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });

        switch(e.target.id) {
            case 'user_province_id':
                this.getDistricts(e.target.value);
                this.state.list_subdistrict = [];
                this.state.list_village = [];
                document.getElementById('user_district_id').disabled = e.target.value === "0" ? true : false;
                document.getElementById('user_sub_district_id').disabled = true;
                document.getElementById('user_village_id').disabled = true;
                break;
            case 'user_district_id':
                this.getSubDistricts(e.target.value);
                this.state.list_village = [];
                document.getElementById('user_sub_district_id').disabled = e.target.value === "0" ? true : false;
                document.getElementById('user_village_id').disabled = true;
                break;
            case 'user_sub_district_id':
                this.getVillage(e.target.value);
                document.getElementById('user_village_id').disabled = e.target.value === "0" ? true : false;
                break;
        }
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

    getDateTimeFormatted = (data) => {
        const date = new Date(data);
        const resultDate = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const resultTime = date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${resultDate} ${resultTime}`;
    }

    handleClicked(){
        let url = `${this._baseURL}/data`;
        let data = {
            user_id: this.state.user_id,
            user_firstname: this.state.user_firstname,
            user_lastname: this.state.user_lastname,
            user_email: this.state.user_email,
            user_phone: this.state.user_phone,
            user_province_id: this.state.user_province_id,
            user_district_id: this.state.user_district_id,
            user_sub_district_id: this.state.user_sub_district_id,
            user_village_id: this.state.user_village_id,
        }
        axios.put(url,data)
        this.setState({
            user_id: 0,
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: "",
            user_created_by: "",
            updated_at: "",
            user_province_id: "",
            user_district_id: "",
            user_sub_district_id: "",
            user_village_id: "",
        });
	this.closeModal();
        setTimeout(()=>{this.componentDidMount()},1)
    }
    render() {
        let {list} = this.state;

        return (
            <div className="App">
                <h2 className="my-4">Users Information จำนวนทั้งหมด {this.state.list.length} รายการ</h2>
                <hr/>
                <div className="container p-3 my-3 bg-dark text-white">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th>ไอดี</th>
                                <th>ชื่อ - นามสกุล</th>
                                <th>รายละเอียด</th>
                                <th>สร้างโดย</th>
                                <th>ปรับเปลี่ยนล่าสุด</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                                {list.map((user) =>{
                                    return(
                                        <tr>
                                            <td>{user.user_id}</td>
                                            <td>{user.user_firstname} {user.user_lastname}</td>
                                            <td>
                                                <ul className="text-left">
                                                    <li>อีเมล {user.user_email}</li>
                                                    <li>เบอร์โทรศัพท์ {user.user_phone}</li>
                                                    <li>หมู่บ้าน {user.villageName}</li>
                                                    <li>ตำบล {user.subdistrictName}</li>
                                                    <li>อำเภอ {user.districtName}</li>
                                                    <li>จังหวัด {user.provinceName}</li>
                                                </ul>
                                            </td>
                                            <td>{user.user_created_by}</td>
                                            <td>{this.getDateTimeFormatted(user.updated_at)}</td>
                                            <td>
                                                <button type="button" class="btn btn-warning m-2" onClick={()=>this.call(user)}>Edit</button>
                                                <button type="button" class="btn btn-danger m-2"  onClick={()=>this.onDelete(user)}>Delete</button>
                                            </td>
                                            <div className="box">
                                                <Modal visible={this.state.visible}
                                                    width="1200"
                                                    height="600"
                                                    effect="fadeInUp"
                                                    onClickAway={() => this.closeModal()}
                                                >
                                                    <form className="container" id='form'>
                                                        <div className="form-group">
                                                            <h3><label htmlFor="id">ไอดี: {this.state.user_id}<br/></label></h3>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>ชื่อ:</label>
                                                                    <input type="text" className="form-control" id="user_firstname" onChange={this.handleChang} value={this.state.user_firstname}/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>นามสกุล:</label>
                                                                    <input type="text" className="form-control" id="user_lastname" onChange={this.handleChang} value={this.state.user_lastname}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>อีเมล:</label>
                                                                    <input type="text" className="form-control" id="user_email" onChange={this.handleChang} value={this.state.user_email}/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>เบอร์โทรศัพท์:</label>
                                                                    <input type="text" className="form-control" id="user_phone" onChange={this.handleChang} value={this.state.user_phone}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>หมู่บ้าน</label>
                                                                    <select className="form-control" id="user_village_id" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_village.map((item) => {
                                                                                return(
                                                                                    <option value={item.villageId} selected={item.villageId == this.state.user_village_id}>{item.villageName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>ตำบล</label>
                                                                    <select className="form-control" id="user_sub_district_id" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_subdistrict.map((item) => {
                                                                                return(
                                                                                    <option value={item.subdistrictId} selected={item.subdistrictId == this.state.user_sub_district_id}>{item.subdistrictName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>อำเภอ</label>
                                                                    <select className="form-control" id="user_district_id" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_district.map((item) => {
                                                                                return(
                                                                                    <option value={item.districtId} selected={item.districtId == this.state.user_district_id}>{item.districtName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>จังหวัด</label>
                                                                    <select className="form-control" id="user_province_id" onChange={this.handleChang}>
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_province.map((item) => {
                                                                                return(
                                                                                    <option value={item.provinceId} selected={item.provinceId == this.state.user_province_id}>{item.provinceName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="id">สร้างโดย: {this.state.user_created_by}<br/></label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="id">ปรับเปลี่ยนล่าสุด: {this.getDateTimeFormatted(this.state.updated_at)}<br/></label>
                                                        </div>
                                                        <button type="button" className="btn btn-primary" onClick={this.handleClicked}>บันทึก</button>
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
