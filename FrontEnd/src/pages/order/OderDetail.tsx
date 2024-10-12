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
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
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

interface OrderDetail {
    id?: any,
}
const OrderDetail : React.FC<OrderDetail> = ({ id}) => {
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
            {(status !== -1) ? step(status) : ''}
            <div className='card p-2 mb-2'>
                <div className='row'>
                    <div className='col-6'>
                        <span className='label-form'>User: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.user_name ? item.user_name : '-'}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>User phone: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.user_phone ? item.user_phone : "-"}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>User code: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.user_code ? item.user_code : "-"}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>Order code: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.order_code ? item.order_code : '-'}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>Created by: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.user_created ? item.user_created : '-'}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>Updated by: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.user_updated ? item.user_updated : '-'}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>Created at: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.created_at ? item.created_at : '-'}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>Updated at: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.updated_at ? item.updated_at : '-'}</span>
                    </div>
                </div>
            </div>
            <div className='card p-2 mb-2'>
                <div className='row'>
                    <div className='col-6'>
                        <span className='label-form'>Address: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.address ? item.address : '-'}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>Address detail: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.address_detail? item.address_detail : '-'}</span>
                    </div>
                    <div className='col-6'>
                        <span className='label-form'>Phone in address: </span> <span
                        style={{fontSize: ' 16px;'}}>{item.address_phone ? item.address_phone : '-'}</span>
                    </div>
                </div>
            </div>
            {item.cancel ? (
                <div className='card p-2 mb-2'>
                    <div className='row'>
                        <div >
                            <span className='label-form'>Reason canceled    : </span> <span
                            style={{fontSize: ' 16px;'}} className='text-danger'>{item.reason_cancel ? item.reason_cancel : '-'}</span>
                        </div>
                    </div>
                </div>
            ) : ''}
            {item.status === 4 ? (
                <div className='card p-2 mb-2'>
                    <div className='row'>
                        <div >
                            <span className='label-form'>Reason return    : </span> <span
                            style={{fontSize: ' 16px;'}} className='text-danger'>{item.reason_return ? item.reason_return : '-'}</span>
                        </div>
                    </div>
                </div>
            ) : ''}

            <div className='card p-2'>
                {content()}
            </div>
            <div className='row  '>

            </div>
            <div className=' group-btn'>
                <button onClick={() => dispatch(setShowModal(false))} type="button"
                        className="btn btn-outline-secondary">Close
                </button>
            </div>
        </div>
    )
}

export default OrderDetail