import {
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios from "@src/axios.ts";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";

import _ from 'lodash';
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
    const [field, setField] = React.useState<any>([]);
    const [filterData, setFilterData] = React.useState<any>([]);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState<any>(15);
    const [itemFrom, setItemFrom] = useState<number>(1);
    const [itemTo, setItemTo] = useState<number>(15);
    const [currentPage, setCurrentPage] =  useState(1)
    const [name, setName] = useState('')

    useEffect(() => {
        loadData()
        loadAction()
        loadResource()
        setField([
            {key: "no", label: "No", class: "th__no",},
            {key: "resource_name", label: "Resource Name", class: ""},
            {key: "read", label: "Read", class: "text-center"},
            {key: "create", label: "Create", class: "text-center"},
            {key: "update", label: "Update", class: "text-center"},
            {key: "delete", label: "Delete", class: "text-center"},
            {key: "all", label: "All", class: "text-center"},
        ])
    }, [])
    useEffect(() => {
        if (action.length > 0 && resource.length > 0){
           const dataInit: any = []
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
            console.log("check data init ", (dataInit))

            console.log("check handle data init ", handleDataInit(dataInit))
            setItems(handleDataInit(dataInit))
            setFilterData(handleDataInit(dataInit))
        }
    }, [action, data, resource]);
    useEffect(() => {
        setTotal(filterData.length)
    }, [filterData]);
    useEffect(() => {
        switch (perPage) {
            case 'All':
                setItemFrom(1)
                setItemTo(total)
                break
            case 15:
                setItemFrom(1)
                setItemTo(15)
                break
            case 25:
                setItemFrom(1)
                setItemTo(25)
                break
            case 50:
                setItemFrom(1)
                setItemTo(50)
                break
            default:
                break
        }
        setCurrentPage(1)

    }, [perPage])

    useEffect(() => {
        const result = items.filter(item => {
                if ( !item.resource_name.toLowerCase().includes(name.toLowerCase())) {
                    return false
                }

            return true
        });

        setFilterData( result);

    }, [items, name]);

    const  handleDataInit = (data: any) => {
        const group  = {};

        data.forEach((item : any) => {
            const { resource_id, resource_name, ...rest } = item;
            if (!group[resource_id]) {
                group[resource_id] = {
                    resource_id,
                    resource_name,
                    actions: []
                };
            }
            group[resource_id].actions.push(rest);
        });

        return Object.values(group);
    }
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
    const save = () => {
        setError({})
        const dataForm = []
        items.forEach((item: any) => {
            item.actions.forEach((item2: any) => {
                if (item2.checked) {
                    dataForm.push({resource_id: item.resource_id, role_id: id, action_id: item2.action_id})
                }
            })
        })
        console.log("check data ", dataForm)
        dispatch(setLoading(true))
        $axios.put(`Permission/${id}`,dataForm).then(res => {
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

    const content: React.FC = () => {
        const setOnchangePage = (e: any) => {
            setPerPage(e.target.value);
        }
        const setNextPage = () => {
            if (total - itemTo > 0) {
                setItemFrom(itemTo);
                if (total - itemTo >= perPage) {
                    setItemTo(itemTo + perPage );
                }
                else if (total - itemTo < perPage) {
                    setItemTo(total);
                }
            }
        }
        const setPreviousPage = () => {
            if (itemFrom - perPage > 0) {
                setItemTo(itemFrom);
                setItemFrom(itemFrom - perPage)
            }
            else  {
                setItemFrom(1)
                setItemTo(perPage)
            }
        }
        const setFirstPage = () => {
            setItemFrom(1)
            setItemTo(perPage)
        }
        const setLastPage = () => {
            setItemFrom(total > perPage  ?  total - perPage :1)
            setItemTo(total > perPage  ? total: perPage)
        }
        const getSortValue = (value:string) => {
            switch (value.toLowerCase()) {
                case 'none':
                    return 'ascending'
                case 'ascending':
                    return 'descending'
                case 'descending':
                    return 'none'
                default:
                    return 'none'
            }
        }
        const handleSortData = (key: string, value: string) => {
            if (value === 'none') {
                const sortedData = _.orderBy(filterData, ['Id'], ['desc']);
                setFilterData(sortedData);
            }
            else {
                const sortedData = _.orderBy(filterData, [key], [value === 'ascending' ? 'asc' : 'desc']);
                setFilterData(sortedData);
            }

        };
        const handleSort = (data: any) => {
            if (!data.sortable) return
            const updatedField = field.map(item => ({
                ...item,
                sortValue: item.key === data.key ? getSortValue(item.sortValue) : 'none',
            }));
            setField(updatedField)
            handleSortData(data.key, getSortValue(data.sortValue) )
        }
        const changeValue = (e: any, currentItem: any, action:any) => {
            action.checked = e.target.checked;
            currentItem.actions.map((i: any) => {
                if (i.action_id === action.action_id) {
                    i = action
                }
            });
            const dataNew: any = []
            items.forEach((i: any) => {

                if (i.resource_id === currentItem.resource_id) {
                    dataNew.push(currentItem)
                }
                else  {
                    dataNew.push(i)
                }
            })
            setItems(dataNew)
        }

        const changeCheckAllItem = (e: any, currentItem: any) => {
            if (e.target.checked) {
                currentItem.actions.map((i: any) => {
                    i.checked = true
                })
            }
            else {
                currentItem.actions.map((i: any) => {
                    i.checked = false
                })
            }
            const dataNew: any = []
            items.forEach((i: any) => {

                if (i.resource_id === currentItem.resource_id) {
                    dataNew.push(currentItem)
                }
                else  {
                    dataNew.push(i)
                }
            })
            setItems(dataNew)
        }
        return (
            <div>
                <input className='form-control width-200 mb-3' placeholder='Search name' value={name} onChange={e => setName(e.target.value)}/>
                <div className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                {field.map((item: any) => {
                                    return (
                                        <TableCell key={crypto.randomUUID()} className={item.class} aria-sort={item.sortable ? item.sortValue : ''} onClick={() => handleSort(item)}>
                                            <b>
                                                {item.label}
                                            </b>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody className='body-table'>
                            {filterData.map((item: any, index: number) => {
                                if ((itemFrom <= index + 1 && itemTo >= index + 1 && currentPage === 1) ||
                                    (itemFrom <= index && itemTo > index && currentPage !== 1 ) ||
                                    perPage === 'All'
                                ) {
                                    return (
                                        <TableRow key={crypto.randomUUID()}>
                                            {
                                                field.map((field: any) => {

                                                    if (field.key === "no") {
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {index + 1}
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "create") {
                                                        const action = item.actions.filter((action: any) => action.action_name === field.key)[0]
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {action ? (
                                                                    <input className="form-check-input" type="checkbox" checked={action.checked}
                                                                           disabled={form === 'view'}
                                                                           onChange={e => changeValue(e, item, action)} id="flexCheckDefault"/>
                                                                ) : '-'}
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "update") {
                                                        const action = item.actions.filter((action: any) => action.action_name === field.key)[0]
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {action ? (
                                                                    <input className="form-check-input" type="checkbox" checked={action.checked}
                                                                           disabled={form === 'view'}
                                                                           onChange={e => changeValue(e, item, action)} id="flexCheckDefault"/>
                                                                ) : '-'}
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "read") {
                                                        const action = item.actions.filter((action: any) => action.action_name === field.key)[0]
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {action ? (
                                                                    <input className="form-check-input" type="checkbox" checked={action.checked}
                                                                           disabled={form === 'view'}
                                                                           onChange={e => changeValue(e, item, action)} id="flexCheckDefault"/>
                                                                ) : '-'}
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "delete") {
                                                        const action = item.actions.filter((action: any) => action.action_name === field.key)[0]
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {action ? (
                                                                    <input className="form-check-input" type="checkbox" checked={action.checked}
                                                                           disabled={form === 'view'}
                                                                           onChange={e => changeValue(e, item, action)} id="flexCheckDefault"/>
                                                                ) : '-'}
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "all") {
                                                        let checkAll = true
                                                        item.actions.map( (i: any) => {
                                                            if (!i.checked) {
                                                                checkAll = false
                                                            }
                                                        })
                                                        return (
                                                            <TableCell className={field.class}
                                                                       key={crypto.randomUUID()}>
                                                                <input className="form-check-input" type="checkbox"
                                                                       disabled={form === 'view'}
                                                                       checked={checkAll}
                                                                       onChange={e => changeCheckAllItem(e, item)}
                                                                       id="flexCheckDefault"/>
                                                            </TableCell>
                                                        )
                                                    }

                                                    else {
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {item[field.key] ? item[field.key] : '-'}
                                                            </TableCell>
                                                        )
                                                    }
                                                })
                                            }
                                        </TableRow>
                                    )
                                }

                            })}

                            {
                                (total === 0) ? (
                                    <TableRow >
                                        <TableCell className='text-center' colSpan={field.length}>
                                            DATA NOT FOUND...
                                        </TableCell>
                                    </TableRow>
                                ) : ''
                            }

                        </TableBody>
                    </Table>
                    <div className="footer-table">
                        <div className="pagination">
                            <span>Per page </span>
                            <Select
                                className="select-per-page"
                                value={perPage}
                                onChange={setOnchangePage}
                                displayEmpty
                            >
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={'All'}>All</MenuItem>
                            </Select>
                            <span>Page {currentPage}</span>
                            <KeyboardDoubleArrowLeftOutlinedIcon className='icon' onClick={setFirstPage}/>
                            <KeyboardArrowLeftOutlinedIcon className='icon' onClick={setPreviousPage}/>
                            {itemFrom}–{itemTo} of {total}
                            <KeyboardArrowRightOutlinedIcon className='icon' onClick={setNextPage}/>
                            <KeyboardDoubleArrowRightOutlinedIcon className='icon' onClick={setLastPage}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='container-fluid'>
            {content()}
            <div className=' group-btn'>
                <button onClick={() => dispatch(setShowModal(false))} type="button"
                        className="btn btn-outline-secondary">Cancel
                </button>
                {form === 'edit' ? (
                    <button onClick={() => save()} className='btn btn-general ps-3 pe-3'>Save</button>
                ) : ''}
            </div>
        </div>
    )
}

export default ResourceAdd