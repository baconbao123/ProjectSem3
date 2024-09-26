
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
import {MultiSelect} from "primereact/multiselect";
import { InputText } from 'primereact/inputtext';
interface ResourceAdd {
    loadDataTable: any,
    id?: any,
    form: string
}
const ResourceAdd : React.FC<ResourceAdd> = ({loadDataTable, form, id}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('')
    const [role, setRole] = useState([])
    const [status, setStatus] = useState([])
    const [error, setError] = useState({})
    const [roleList, setRoleList] = useState([])
    const [version, setVersion] = useState(0)
    useEffect(() => {
            loadData()
        if (form === 'edit') {
            loadDataInit()
        }
        console.log("check", roleList )

    }, [])
    const loadDataInit = () => {
        $axios.get(`User/${id}`).then(res => {
            console.log('Check data ', res.data.data)
            if (res.data.data && res.data.data.name) {
               setName(res.data.data.name)
            }
            if (res.data.data && res.data.data.email) {
                setEmail(res.data.data.email)
            }
            if (res.data.data && res.data.data.status) {
                setStatus(res.data.data.status)
            }
            if (res.data.data && res.data.data.phone) {
                setPhone(res.data.data.phone)
            }
            if (res.data.data && res.data.data.role) {
                setRole(res.data.data.role)
            }

            if (res.data.data && (res.data.data.Version || res.data.data.Version === 0)) {
                setVersion(res.data.data.Version)
            }
            dispatch(setLoading(false))

        })
            .catch((err) => {
                console.log(err)
                dispatch(setLoading(false))

            })
            .finally( () => {
            })
    }
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Common/role`).then(res => {

            if (res.data.data) {
              setRoleList(res.data.data)
                dispatch(setLoading(false))

            }
        })
            .catch((err) => {
                console.log(err)
                dispatch(setLoading(false))

            })
            .finally( () => {
            })
    }
    const dispatch = useDispatch();
    const addNew = () => {
        setError({})
        const dataRole = role.reduce((acc: any[] = [], item: any) => {
            acc.push(item.code);
            return acc; // Make sure to return the accumulator
        }, []);
        if (password !== cpassword) {
            setError({Password: ["Password not match"], CPassword: ["Password not match"]})
            return
        }
        const dataForm = {
            Password: password,
            Email: email,
            UserName: name,
            Phone: phone,
            Role: JSON.stringify(dataRole),
            Status: status ? 1 : 0,
        }
        console.log('Check data ', dataForm)
        dispatch(setLoading(true))
        $axios.post('User',dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Add new user successful'}))
            dispatch(setShowModal(false))
            dispatch(setLoading(false))

        })
            .catch(err => {
                console.log(err)
                console.log("check err", err.response.data.Errors)
                if (err.response.data.Errors) {
                    setError(err.response.data.Errors)
                }
                dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))
                dispatch(setLoading(false))

            })
            .finally( () => {
            })
    }
    const save = () => {
        setError({})
        let dataRole = role.reduce((acc: any[] = [], item: any) => {
            acc.push(item.code);
            return acc; // Make sure to return the accumulator
        }, []);
        if (dataRole.length === 0) dataRole = ''
        const dataForm = {
            Email: email,
            UserName: name,
            Phone: phone,
            Role: dataRole? JSON.stringify(dataRole) : '',
            Status: status ? 1 : 0,
            Version: version
        }
        console.log('Check data ', dataForm)
        dispatch(setLoading(true))
        $axios.put(`User/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Edit user successful'}))
            dispatch(setShowModal(false))
            dispatch(setLoading(false))
        })
            .catch(err => {
                console.log(err)
                console.log("check err", err.response.data.Errors)
                if (err.response.data.Errors) {
                    setError(err.response.data.Errors)
                }
                if (err.response.data.type === 'reload') (
                    dispatch(setToast({status: 'error', message: 'Error', data: err.response.data.message}))
                )
                else  {
                    dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))
                }
                dispatch(setLoading(false))
            })
            .finally( () => {

            })
    }

    const ShowError: React.FC = (key) => {
        let data = []
        if (error[key] && error[key].length > 0) {
            data = error[key]
        }
        return (
            <div className="text-danger mt-1">{ data[0] ? data[0] : '' } </div>
        )
    }

    return (
        <div className='container-fluid'>
            <div className='row  '>
                <div className='col-6'>
                    <div className=''>
                        <div className='label-form'>User name <span className='text-danger'>*</span></div>
                        <InputText value={name} className='p-inputtext-lg w-100' placeholder='Enter user name'
                                   onChange={e => setName(e.target.value)}/>
                    </div>
                    {ShowError('UserName')}
                </div>
                <div className='col-6'>
                    <div className=''>
                        <div className='label-form'>Phone <span className='text-danger'>*</span></div>
                        <InputText keyfilter="int" value={phone} className='p-inputtext-lg w-100' placeholder='Phone'
                                   onChange={e => setPhone(e.target.value)}/>
                    </div>
                    {ShowError('Phone')}
                </div>
            </div>
            <div className='row  '>
                <div className='col-6'>
                    <div className='mt-3'>
                        <div className='label-form'>Email <span className='text-danger'>*</span></div>
                        <InputText value={email} type='email' className='p-inputtext-lg w-100' placeholder='Enter email'
                                   onChange={e => setEmail(e.target.value)}/>
                    </div>
                    {ShowError('Email')}
                </div>
                <div className='col-6'>
                    <div className='mt-3'>
                        <div className='label-form'>Role <span className='text-danger'>*</span></div>
                        <MultiSelect value={role} onChange={(e) => setRole(e.value)} options={roleList}
                                     optionLabel="label"
                                     placeholder="Select role" maxSelectedLabels={3} className="w-full w-100  "
                                     display="chip"/>
                    </div>
                    {ShowError('Role')}
                </div>

            </div>
            {form !== 'edit' ? (
                <div className='row'>
                    <div className='col-6'>
                        <div className='mt-3'>
                            <div className='label-form'>Password <span className='text-danger'>*</span></div>
                            <InputText value={password} type='password' className='p-inputtext-lg w-100'
                                       placeholder='Enter password' onChange={e => setPassword(e.target.value)}/>
                        </div>
                        {ShowError('Password')}
                    </div>
                    <div className='col-6'>
                        <div className='mt-3'>
                            <div className='label-form'>Confirm password <span className='text-danger'>*</span></div>
                            <InputText value={cpassword} type='password' className='p-inputtext-lg w-100'
                                       placeholder='Enter confirm password'
                                       onChange={e => setCpassword(e.target.value)}/>
                        </div>
                        {ShowError('CPassword')}
                    </div>
                </div>
            ) : ''}

            <div className='row  '>
                <div className='col-6'>
                    <div className='mt-3'>
                        <div className='label-form'>Status <span className='text-danger'>*</span></div>
                        <div className="form-check form-switch">
                            <input checked={status} onChange={e => setStatus(e.target.checked)}
                                   className="form-check-input form-switch switch-input" type="checkbox"
                                   id="flexSwitchCheckDefault"/>
                        </div>
                        {ShowError('Status')}
                    </div>
                </div>
                <div className='col-6'>
                </div>
            </div>
            <div className=' group-btn'>
                <button onClick={() => dispatch(setShowModal(false))} type="button"
                        className="btn btn-outline-secondary">Cancel
                </button>
                {form === 'add' ?
                    (
                        <button onClick={() => addNew()} className='btn btn-general ps-3 pe-3'>Add new</button>

                    ) :
                    (
                        <button onClick={() => save()} className='btn btn-general ps-3 pe-3'>Save</button>
                    )
                }
            </div>

        </div>
    )
}

export default ResourceAdd