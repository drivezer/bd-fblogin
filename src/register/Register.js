import React, {Component} from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_province: [],
            list_district: [],
            list_subdistrict: [],
            list_village: [],
            // idkey:"",
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: "",
            user_created_by: "",
            user_province_id: "",
            user_district_id: "",
            user_sub_district_id: "",
            user_village_id: ""
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
        
    }

    componentDidMount() {
        document.getElementById('user_district_id').disabled = true;
        document.getElementById('user_sub_district_id').disabled = true;
        document.getElementById('user_village_id').disabled = true;

        this.getProvinces();
    }
    
    _baseURL = '';

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
    }

    handleClicked(){
        const resLocalStorage = JSON.parse(localStorage.getItem('remember'));

        let url = `${this._baseURL}/data`;
        let data = {
            user_id: this.state.user_id,
            user_firstname: this.state.user_firstname,
            user_lastname: this.state.user_lastname,
            user_email: this.state.user_email,
            user_phone: this.state.user_phone,
            user_created_by: resLocalStorage.email,
            user_province_id: this.state.user_province_id,
            user_district_id: this.state.user_district_id,
            user_sub_district_id: this.state.user_sub_district_id,
            user_village_id: this.state.user_village_id,
        }
        axios.post(url, data);
        this.setState({
            // user_id: "",
            user_firstname: "",
            user_lastname: "",
            user_email: "",
            user_phone: "",
            user_created_by: "",
            user_province_id: "",
            user_district_id: "",
            user_sub_district_id: "",
            user_village_id: ""
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
                    <div className="row">
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">ชื่อ</label>
                                <input type="text" className="form-control" id="user_firstname" onChange={this.handleChang} value={this.state.user_firstname}/>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">นามสกุล</label>
                                <input type="text" className="form-control" id="user_lastname" onChange={this.handleChang} value={this.state.user_lastname}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">อีเมล</label>
                                <input type="email" className="form-control" id="user_email" onChange={this.handleChang} value={this.state.user_email}/>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">เบอร์โทรศัพท์</label>
                                <input type="text" className="form-control" id="user_phone" onChange={this.handleChang} value={this.state.user_phone}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">หมู่บ้าน</label>
                                <select className="form-control" id="user_village_id" onChange={this.handleChang} >
                                    <option value={0}></option>
                                    {
                                        this.state.list_village.map((item) => {
                                            return(
                                                <option value={item.villageId}>{item.villageName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">ตำบล</label>
                                <select className="form-control" id="user_sub_district_id" onChange={this.handleChang} >
                                    <option value={0}></option>
                                    {
                                        this.state.list_subdistrict.map((item) => {
                                            return(
                                                <option value={item.subdistrictId}>{item.subdistrictName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">อำเภอ</label>
                                <select className="form-control" id="user_district_id" onChange={this.handleChang} >
                                    <option value={0}></option>
                                    {
                                        this.state.list_district.map((item) => {
                                            return(
                                                <option value={item.districtId}>{item.districtName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">จังหวัด</label>
                                <select className="form-control" id="user_province_id" onChange={this.handleChang}>
                                    <option value={0}></option>
                                    {
                                        this.state.list_province.map((item) => {
                                            return(
                                                <option value={item.provinceId}>{item.provinceName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.handleClicked}>บันทึก</button>
                </form>
            </div>
        );
    }
}

export default function WithRouter(props) {
    const history = useHistory();
    return (<Register {...props} history={history} />);
}
