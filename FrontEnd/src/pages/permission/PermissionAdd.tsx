import {FormControl, Switch, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
interface ResourceAdd {
    loadDataTable: any,
    id?: any,
    form: string
}
const ResourceAdd : React.FC<ResourceAdd> = ({loadDataTable, form, id}) => {
    const [error, setError] = useState({})
    const [action, setAction] = useState([])
    const [resource, setResource] = useState([])
    const [data, setData] = useState([])
    const [items, setItems] = useState([])
    const token = Cookies.get("token")
    useEffect(() => {
            loadData()
            loadAction()
            loadResource()
    }, [])
    useEffect(() => {
        if (action.length > 0 && data.length >0 && resource.length > 0){
           let dataInit = []
            resource.map((item : any) => {
                action.map((item2: any) => {
                    const checked = data.filter((item3: any) => item3.resource_id === item.Id && item3.action_id === item2.Id).length > 0
                    dataInit.push(
                        {   resource_id: item.Id,
                            resource_name: item.Name,
                            action_id: item2.Id,
                            action_name: item2.Name,
                            checked: checked
                        })
                })
            })
           setItems(dataInit)
        }
    }, [action, data, resource]);
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Permission/${id}`).then(res => {
            if (res.data.data) {
                setData(res.data.data)
            }

        })
            .catch((err) => {
                console.log(err)
            })
            .finally( () => {
                dispatch(setLoading(false))
            })
    }
    const loadAction = () => {
        dispatch(setLoading(true))

        $axios.get(`Common/action`).then(res => {

            if (res.data.data) {
                setAction(res.data.data)
            }

        })
            .catch((err) => {
                console.log(err)
            })
            .finally( () => {
                dispatch(setLoading(false))
            })
    }

    const loadResource = () => {
        dispatch(setLoading(true))

        $axios.get(`Common/resource`).then(res => {

            if (res.data.data) {
                setResource(res.data.data)
            }
        })
            .catch((err) => {
                console.log(err)
            })
            .finally( () => {
                dispatch(setLoading(false))
            })
    }
    const dispatch = useDispatch();
    const addNew = () => {
        setError({})
        const dataForm = {
        }
        dispatch(setLoading(true))
        $axios.post('Role',dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Add new resource successful'}))
            dispatch(setShowModal(false))
        })
            .catch(err => {
                console.log(err)
                console.log("check err", err.response.data.Errors)
                if (err.response.data.Errors) {
                    setError(err.response.data.Errors)
                }
                dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))
            })
            .finally( () => {
                dispatch(setLoading(false))
            })
    }
    const save = () => {
        setError({})
        const dataForm = {
        }
        dispatch(setLoading(true))
        $axios.put(`Role/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Edit resource successful'}))
            dispatch(setShowModal(false))
        })
        .catch(err => {
            console.log(err)
            console.log("check err")
            if (err.response.data.Errors) {
                setError(err.response.data.Errors)
            }
            if (err.response.data.type === 'reload') (
                dispatch(setToast({status: 'error', message: 'Error', data: err.response.data.message}))
            )
            else  {
             dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))
            }
        })
        .finally( () => {
            dispatch(setLoading(false))
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

        </div>
    )
}

export default ResourceAdd