import React, {useCallback, useEffect, useState} from "react";
import MainLayOut from "@pages/common/MainLayOut.tsx";
import {useDispatch} from "react-redux";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import Modal from "@pages/common/Modal.tsx";
import {Breadcrumbs, Chip, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Cookies from "js-cookie";
import $axios, {authorization} from "@src/axios.ts";
import RoleAdd from "@pages/role/RoleAdd.tsx";
import OrderAdd from "@pages/order/OrderAdd.tsx";
import Swal from 'sweetalert2'
import _ from 'lodash';
import RoleDetail from "@pages/role/RoleDetail.tsx";
import {Link} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import {checkPermission} from "@src/Service/common.ts";
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import ErrorPage from "@pages/common/ErrorPage.tsx";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
const ResourceList : React.FC = () => {
    const dispatch = useDispatch();

    const [field, setField] = React.useState<any>([]);
    const [data, setData] = React.useState<any>([]);
    const [filterData, setFilterData] = React.useState<any>([]);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState<any>(15);
    const [itemFrom, setItemFrom] = useState<number>(1);
    const [itemTo, setItemTo] = useState<number>(15);
    const [currentPage, setCurrentPage] =  useState(1)
    const [componentTitle, setComponentTitle] = useState<any>( "Add component");
    const [showComponent, setShowComponent] = useState('')
    const [currentId, setCurrentId] = useState(null);
    const [filter, setFilter] = useState({order_code: '', status: -1});
    useEffect(() => {
        dispatch(setLoading(true))
        setField([
            {key: "No", label: "No", class: "th__no"},
            {key: "user_name", label: "User Buy", class: "width-300", sortable: true, sortValue: 'none'},
            {key: "order_code", label: "Order Code", class: "width-300", sortable: true, sortValue: 'none'},
            {key: "base_price", label: "Base Price", class: "width-300", sortable: true, sortValue: 'none'},
            {key: "total_price", label: "Total Price", class: "width-300"},
            {key: "status", label: "Status", class: "width-200 ", sortable: true, sortValue: 'none'},
            {key: "Action", label: "Action", class: "width-200 th__action "},

        ])
        loadDataTable()
        dispatch(setLoading(false))
    }, []);

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
        setTotal(filterData.length)
    }, [filterData]);
    useEffect(() => {
        setCurrentPage(Math.floor(itemTo / perPage))

    }, [itemTo]);
    useEffect(() => {
        const result = data.filter(item => {
            for (const key in filter) {
                let value = filter[key]

                if (value === -1 || value === '') {
                    continue
                }

                if (key === 'status' && item[key] !== value) {
                    if (value === 5) {
                        if (item['cancel']) {
                            return true
                        }
                    }
                    return false
                }

                if (key === 'order_code' && !item[key].toLowerCase().includes(value.toLowerCase())) {
                    return false
                }
            }

            return true
        });

        const sortTable = field.filter(item => item.sortValue !== 'none')[0]
        let sortResult
        if (sortTable) {
            sortResult =  _.orderBy(result, [sortTable.key], [sortTable.sortValue === 'ascending' ? 'asc' : 'desc']);
        }
        setFilterData(sortTable ? sortResult :  result);

    }, [filter, data]);

    const loadDataTable = () => {
        $axios.get('/Order').then(res => {
            setData(res.data.data)
            setFilterData(res.data.data)
        })
            .catch(err => {
                console.log(err)
            })

    }
    const handleComponentAdd: React.FC =() => {
        return  (<RoleAdd loadDataTable={loadDataTable} form={'add'}/>)
    }
    const handleComponentEdit: React.FC =( ) => {
        return  (<OrderAdd loadDataTable={loadDataTable} form={'edit'} id={currentId} />)
    }
    const handleComponentDetail: React.FC = () => {
        return  (<RoleDetail id={currentId} />)
    }
    const showModalAdd = () => {
        dispatch(setShowModal(true))
        setComponentTitle("Add role")
        setShowComponent('add')
    }
    const showModalEdit = (item: any) => {
        setCurrentId(item.id)
        setComponentTitle("Edit order")
        setShowComponent('edit')
        dispatch(setShowModal(true))
    }
    const showModalDetail = (item: any) => {
        setCurrentId(item.id)
        setComponentTitle("Detail role")
        setShowComponent('view')
        dispatch(setShowModal(true))
    }
    const deleteItem = (item: any) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(setLoading(true))
                $axios.delete(`Order/${item.id}`).then(res => {
                    console.log("check res", res)
                    loadDataTable()
                    dispatch(setToast({status: 'success', message: 'Success', data: 'Cancel order successful'}))
                    dispatch(setShowModal(false))
                })
                    .catch(err => {
                        console.log(err)
                        dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))

                    })
                    .finally( () => {
                        dispatch(setLoading(false))
                    })
            }
        });
    }

    const header: React.FC = () => {
        return (
            <div className='header-page'>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className='breadcrumb'>
                    <Link
                        color="inherit"
                        to="/"
                    >
                     <HomeIcon className='icon-breadcrum' />
                    </Link>
                    <Link
                        to='/order'
                    >
                        Order
                    </Link>
                </Breadcrumbs>
            </div>
        )
    }

    const search: React.FC = () => {
        const setChangeStatus = (e: any) => {
            setFilter(prev => ({...prev, status: e.target.value}))
        }
        const setChangeName = (e: any) => {
            setFilter(prev => ({...prev, order_code: e.target.value}))
        }
        return (
            <div className='search-container'>
                <div>
                    <input
                        value={filter.order_code}
                        onChange={e => setChangeName(e)}
                        className='form-control test-position' placeholder="Search order code"/>
                </div>
            <Select
                className="search-form width-200 custom-form"
                value={filter.status}
                onChange={e => setChangeStatus(e)}
                displayEmpty
            >
                <MenuItem value={-1}>
                    <span className='placeholder-text'>Select status</span>
                </MenuItem>
                <MenuItem value={1}>Order</MenuItem>
                <MenuItem value={2}>Uncompleted</MenuItem>
                <MenuItem value={3}>Processing</MenuItem>
                <MenuItem value={4}>Completed</MenuItem>
                <MenuItem value={5}>Cancel</MenuItem>
            </Select>
            </div>
        )
    }

    const button: React.FC = () => {
        return (
            <div>
                {/*{checkPermission('Role', 'create') ? (*/}
                {/*    <div onClick={showModalAdd} className="btn btn-general">Add new</div>*/}
                {/*) : ''}*/}

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

        return (
            <div>
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

                                                    if (field.key === "No") {
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {index + 1}
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "status") {
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {
                                                                    item['cancel']  ? (
                                                                        <div className='justify-content-center d-flex'>
                                                                            <div className='status-danger'>
                                                                                Canceled
                                                                            </div>
                                                                        </div>

                                                                    )
                                                                        :item[field.key] === 1 ? (
                                                                <div className='justify-content-center d-flex'>
                                                                      <div className='status-disable'>
                                                                          Order
                                                                      </div>
                                                                </div>

                                                                )
                                                                    :
                                                                item[field.key] === 2 ? (
                                                                        <div className='justify-content-center d-flex'>
                                                                            <div className='status-uncompleted'>
                                                                                Uncompleted
                                                                            </div>
                                                                        </div>

                                                                    ) :
                                                                    item[field.key] === 3 ? (
                                                                            <div className='justify-content-center d-flex'>
                                                                                <div className='status-process'>
                                                                                    Processing
                                                                                </div>
                                                                            </div>

                                                                        ) :
                                                                    item[field.key] === 4 ? (
                                                                            <div className='justify-content-center d-flex'>
                                                                                <div className='status-success'>
                                                                                    Completed
                                                                                </div>
                                                                            </div>

                                                                        ) :
                                                                    (
                                                                        <div className='justify-content-center d-flex'>
                                                                        </div>
                                                                    )
                                                                }
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "Action") {
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                <span
                                                                    className={`m-2 btn-icon p-1 ${checkPermission('Order', 'read') ? '' : 'btn-disable'}`}
                                                                    onClick={() => checkPermission('Order', 'read') && showModalDetail(item)}
                                                                   >
                                                                    <RemoveRedEyeOutlinedIcon  />
                                                                </span>
                                                                <span
                                                                    className={`m-2 btn-icon p-1 ${checkPermission('Order', 'update') ? '' : 'btn-disable'}`}
                                                                    onClick={() => checkPermission('Order', 'update') && showModalEdit(item)}
                                                                  >
                                                                 <EditOutlinedIcon/>
                                                                </span>
                                                                <span
                                                                    className={`m-2 btn-icon p-1 ${checkPermission('Order', 'update') ? '' : 'btn-disable'}`}
                                                                    onClick={() => checkPermission('Order', 'update') && deleteItem(item)}
                                                                    >
                                                                    <RestoreOutlinedIcon  />
                                                                </span>
                                                            </TableCell>
                                                        )
                                                    }
                                                    return (
                                                        <TableCell className={field.class} key={crypto.randomUUID()}>
                                                            {item[field.key] ? item[field.key] : '-'}
                                                        </TableCell>
                                                    )
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
    const footer: React.FC = () => {
        return (
            <div>

            </div>
        )
    }


    return (
        <>
                <Modal
                    content={
                        showComponent === 'add' ? handleComponentAdd :
                        showComponent === 'edit' ? handleComponentEdit :
                        showComponent === 'view' ? handleComponentDetail : ''
                    }
                    title={componentTitle}
                />



            <MainLayOut
                header={header}
                search={search}
                button={button}
                content={content}
                footer={footer}
            >
            </MainLayOut>

        </>
    )
}

export default ResourceList
