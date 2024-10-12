import {
    FormControl,
    MenuItem,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setShowModal2, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { Steps } from 'primereact/steps';
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import _ from 'lodash';
import defaultImage from  '@src/images/default.png'
import { Image } from 'primereact/image';
import Modal2 from "@pages/common/Modal2.tsx";

interface ResourceAdd {
    loadDataTable: any,
    id?: any,
    form: string
}
const ResourceAdd : React.FC<ResourceAdd> = ({loadDataTable, form, id}) => {
    const [item, setItem] = useState({})
    const [product, setProduct] = useState([])
    const [sale, setSale] = useState([])
    const [orderCode, setOrderCode] = useState('')
    const [status, setStatus] = useState(-1)
    const [error, setError] = useState({})
    const [field, setField] = React.useState<any>([]);
    const [filterData, setFilterData] = React.useState<any>([]);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState<any>(15);
    const [itemFrom, setItemFrom] = useState<number>(1);
    const [itemTo, setItemTo] = useState<number>(15);
    const [currentPage, setCurrentPage] =  useState(1)
    const [product_name, setProductName] = useState('')
    const [filter, setFilter] = useState({product_name: '', product_code: ''});
    const [returnReason,setReturnReason]=useState('')
    useEffect(() => {
        loadData()
        setField([
            {key: "no", label: "No", class: "th__no", sortable: false},
            {key: "product_image", label: "Image", class: "text-center"},
            {key: "product_code", label: "Product Code", class: "text-center"},
            {key: "product_name", label: "Product Name  ", class: ""},
            {key: "quantity", label: "Quantity", class: "text-center"},
            {key: "base_price", label: "Base Price", class: "text-center"},
            {key: "sell_price", label: "Sell Price", class: "text-center"},
            {key: "sale", label: "Sale", class: "width-100 text-center"},
            {key: "total_price", label: "Total Price", class: "text-center"},

        ])
    }, [])
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Order/${id}`).then(res => {
            console.log("Check ",  res.data.data)
            if (res.data.data ) {
                setItem(res.data.data)
            }
            if (res.data.data && res.data.data.products) {
                setProduct(res.data.data.products)
                setFilterData(res.data.data.products)

            }
            if (res.data.data && res.data.data.status) {
                setStatus(res.data.data.status)
            }

        })
            .catch((err) => {
                console.log(err)
            })
            .finally( () => {
                dispatch(setLoading(false))
            })
    }
    useEffect(() => {
        setTotal(filterData.length)
    }, [filterData]);
    const dispatch = useDispatch();
    useEffect(() => {
        const result = product.filter(item => {
            for (const key in filter) {
                let value = filter[key]

                if (value === -1 || value === '') {
                    continue
                }

                if (key === 'status' && item[key] !== value) {
                    return false
                }

                if (key === 'product_name' && !item[key].toLowerCase().includes(value.toLowerCase())) {
                    return false
                }
                if (key === 'product_code' && !item[key].toLowerCase().includes(value.toLowerCase())) {
                    return false
                }
            }

            return true
        });

        // const sortTable = field.filter(item => item.sortValue !== 'none')[0]
        // let sortResult
        // if (sortTable) {
        //     sortResult =  _.orderBy(result, [sortTable.key], [sortTable.sortValue === 'ascending' ? 'asc' : 'desc']);
        // }
        setFilterData( result);

    }, [filter, product]);
    const save = () => {
        setError({})
        const dataForm = {
            action: 'completed',
            Status: 3,
            Version: item.version
        }
        dispatch(setLoading(true))
        $axios.put(`Order/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Order is updated successful'}))
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

    const returnMethod = () => {
        dispatch(setShowModal2(true))

    }
    const confirmReturn = () => {
        setError({})
        const dataForm = {
            returnReason: returnReason,
            Version: item.version
        }
        dispatch(setLoading(true))
        $axios.put(`Order/return/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Order is updated successful'}))
            dispatch(setShowModal(false))
            dispatch(setShowModal2(false))
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
    const confirm = () => {

        setError({})
        const dataForm = {
            action: 'processing',
            Status: 2,
            Version: item.version
        }
        dispatch(setLoading(true))
        $axios.put(`Order/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Order is confirmed '}))
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


    const stepProcess = [
        {
            label: "Order",
        },
        {
            label: "Processing",
        },
        {
            label: "Completed",
        },
        {
            label: "Returned",
        }
    ];
    const step = (index: any) => {
        return (
            <Steps model={stepProcess} activeIndex={index - 1} readOnly={true} className="m-2 pt-4"/>
        )
    }
    const contenModal = () => {
        return (
            <div className='container-fluid'>
                <div className='row  '>
                    <div className=''>
                        <div className=''>
                            <div className='label-form'>Return reason <span className='text-danger'>*</span></div>
                            <textarea className="form-control"
                                      value={returnReason}
                                      onChange={e => setReturnReason(e.target.value)}
                                      style={{height: '100px'}} placeholder="Enter return reason"
                                      id="floatingTextarea2"/>

                        </div>
                        {ShowError('Cancel')}
                    </div>

                </div>
                <div className=' group-btn'>
                    <button onClick={() => dispatch(setShowModal2(false))} type="button"
                            className="btn btn-outline-secondary">Cancel
                    </button>
                    <button onClick={() => confirmReturn()} className='btn btn-general ps-3 pe-3'>Confirm</button>
                </div>
            </div>
        )
    }
    const content: React.FC = () => {
        const setOnchangePage = (e: any) => {
            setPerPage(e.target.value);
        }
        const setNextPage = () => {
            if (total - itemTo > 0) {
                setItemFrom(itemTo);
                if (total - itemTo >= perPage) {
                    setItemTo(itemTo + perPage);
                } else if (total - itemTo < perPage) {
                    setItemTo(total);
                }
            }
        }
        const setPreviousPage = () => {
            if (itemFrom - perPage > 0) {
                setItemTo(itemFrom);
                setItemFrom(itemFrom - perPage)
            } else {
                setItemFrom(1)
                setItemTo(perPage)
            }
        }
        const setFirstPage = () => {
            setItemFrom(1)
            setItemTo(perPage)
        }
        const setLastPage = () => {
            setItemFrom(total > perPage ? total - perPage : 1)
            setItemTo(total > perPage ? total : perPage)
        }
        const getSortValue = (value: string) => {
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
        const getTotalPrice = (item:any) => {
            if (item.sell_price && item.sell_price !== '0') {
                return item.quantity * item.sell_price
            }
            else {
                return item.quantity * item.base_price
            }
        }
        const setChangeName = (e: any) => {
            setFilter(prev => ({...prev, product_name: e.target.value}))
        }
        const setChangeCode = (e: any) => {
            setFilter(prev => ({...prev, product_code: e.target.value}))
        }
        return (
            <div>
                <div className='d-flex' style={{gap: '10px'}}>
                    <input className='form-control width-200 mb-3' placeholder='Product code' value={filter.product_code}
                           onChange={e => setChangeCode(e)}/>
                    <input className='form-control width-200 mb-3' placeholder='Product name'
                           value={filter.product_name}
                           onChange={e => setChangeName(e)}/>

                </div>


                <div className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                            {field.map((item: any) => {
                                    return (
                                        <TableCell key={crypto.randomUUID()} className={item.class}
                                                   aria-sort={item.sortable ? item.sortValue : ''}
                                                   onClick={() => handleSort(item)}>
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
                                    (itemFrom <= index && itemTo > index && currentPage !== 1) ||
                                    perPage === 'All'
                                ) {
                                    return (
                                        <TableRow key={crypto.randomUUID()}>
                                            {
                                                field.map((field: any) => {

                                                    if (field.key === "no") {
                                                        return (
                                                            <TableCell className={field.class}
                                                                       key={crypto.randomUUID()}>
                                                                {index + 1}
                                                            </TableCell>
                                                        )
                                                    } else if (field.key === "product_image") {
                                                        return (
                                                            <Image
                                                                src={import.meta.env.VITE_BASE_URL_LOCALHOST + item[field.key]}
                                                                height="50" onError={(e) => {
                                                                e.target.onerror = null; // Ngăn lặp lại lỗi
                                                                e.target.src = defaultImage; // Đổi sang ảnh mặc định
                                                            }} preview/>
                                                        )
                                                    } else if (field.key === "total_price") {
                                                        return (
                                                            <TableCell className={field.class}
                                                                       key={crypto.randomUUID()}>
                                                                {getTotalPrice(item)}
                                                            </TableCell>
                                                        )
                                                    } else {
                                                        return (
                                                            <TableCell className={field.class + ''} key={crypto.randomUUID()}>
                                                                {item[field.key] ? item[field.key] : (
                                                                    <div className='text-center'>-</div>
                                                                )}
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
                                    <TableRow>
                                        <TableCell className='text-center' colSpan={field.length}>
                                            DATA NOT FOUND...
                                        </TableCell>
                                    </TableRow>
                                ) : ''
                            }
                            {
                                (total !== 0) ? (
                                    <TableRow>
                                        <TableCell className='text-center' colSpan={5}>
                                            Order
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {item.base_price}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {item.sell_price ? item.sell_price : '-'}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {item.sale ? item.sale : '-'}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {item.total_price ? item.total_price : '-'}
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
            <Modal2
                content={contenModal}
                title={'Return  confirm'}
            />
            {(status !== -1) ? step(status) : ''}
            <div className='col-6'>
            <div className='mt-3 d-flex align-items-center mb-3'>
                {/*{status > 1 && status < 4 && !item.cancel ? (*/}
                {/*    <>*/}
                {/*        <div className='label-form me-3'>Status</div>*/}
                {/*        <Select*/}
                {/*            className="search-form width-200 custom-form"*/}
                {/*            style={{height: '38px'}}*/}
                {/*            value={status}*/}
                {/*            onChange={e => setStatus(e.target.value)}*/}
                {/*        >*/}
                {/*            <MenuItem value={2}>Processing</MenuItem>*/}
                {/*            <MenuItem value={3}>Completed</MenuItem>*/}
                {/*        </Select>*/}
                {/*    </>*/}
                {/*) : ''*/}
                {/*}*/}
            </div>
            </div>
            <div className='card p-2'>
                {content()}
            </div>
            <div className='row  '>

            </div>
            <div className=' group-btn'>
                <button onClick={() => dispatch(setShowModal(false))} type="button"
                        className="btn btn-outline-secondary">Close
                </button>
                {!item.cancel && status !== 4 && status == 2? (
                <button onClick={() => save()} className='btn btn-general ps-3 pe-3'>Completed</button>

                ) : ''}
                {!item.cancel && status !== 4 && status == 2? (
                    <button onClick={() => returnMethod()} className='btn btn-general ps-3 pe-3'>Returned</button>

                ) : ''}

                {!item.cancel && status === 1 ? (
                    <button onClick={() => confirm()} className='btn btn-general ps-3 pe-3'>Processing</button>

                ) : ''}
            </div>
        </div>
    )
}

export default ResourceAdd