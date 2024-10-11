import React, {useCallback, useEffect, useState} from "react";
import MainLayOut from "@pages/common/MainLayOut.tsx";
import {useDispatch, useSelector} from "react-redux";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import Modal from "@pages/common/Modal.tsx";
import {Breadcrumbs, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import HomeIcon from '@mui/icons-material/Home';
import Cookies from "js-cookie";
import $axios, {authorization} from "@src/axios.ts";
import ResourceAdd from "@pages/resource/ResourceAdd.tsx";
import Swal from 'sweetalert2'
import _ from 'lodash';

import {Link} from "react-router-dom";
import CompanyAdd from "./FAQAdd";
import CompanyDetail from "./FAQDetail";
import FAQAdd from "./FAQAdd";
const FAQList: React.FC = () => {
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
    const [filter, setFilter] = useState({Title: '', Status: -1});
    useEffect(() => {
        dispatch(setLoading(true))
        setField([
            {key: "No", label: "No", class: "th__no"},
            {key: "Title", label: "Title", class: "width-300", sortable: true, sortValue: 'none'},
            {key: "Decription", label: "Decription", class: ""},
            {key: "Type", label: "Group FAQs", class: ""},
            {key: "Status", label: "Status", class: "width-100 ", sortable: true, sortValue: 'none'},
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

                if (key === 'Status' && item[key] !== value) {
                    return false
                }

                if (key === 'Title' && !item[key].toLowerCase().includes(value.toLowerCase())) {
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
        const token = Cookies.get("token")
        $axios.get('/FAQ').then(res => {
            console.log(res.data)
            setData(res.data)
            setFilterData(res.data)
        })
            .catch(err => {
                console.log(err)
            })

    }
    const handleComponentAdd: React.FC =() => {
        return  (<FAQAdd loadDataTable={loadDataTable} form={'add'}/>)
    }
    const handleComponentEdit: React.FC =( ) => {
        return  (<FAQAdd loadDataTable={loadDataTable} form={'edit'} id={currentId} />)
    }
    const handleComponentDetail: React.FC = () => {
        return  (<CompanyDetail id={currentId} />)
    }
    const showModalAdd = () => {
        dispatch(setShowModal(true))
        setComponentTitle("Add FAQ")
        setShowComponent('add')
    }
    const showModalEdit = (item: any) => {
        setCurrentId(item.Id)
        setComponentTitle("Edit FAQ")
        setShowComponent('edit')
        dispatch(setShowModal(true))
    }
    const showModalDetail = (item: any) => {
        setCurrentId(item.Id)
        setComponentTitle("Detail FAQ")
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
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(setLoading(true))
                const token = Cookies.get("token")
                $axios.delete(`FAQ/${item.Id}`).then(res => {
                    console.log("check res", res)
                    loadDataTable()
                    dispatch(setToast({status: 'success', message: 'Success', data: 'Delete resource successful'}))
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
                     to='/FAQ'
                    >
                        FAQ
                    </Link>
                </Breadcrumbs>
            </div>
        )
    }

    const search: React.FC = () => {
        const setChangeStatus = (e: any) => {
            setFilter(prev => ({...prev, Status: e.target.value}))
        }
        const setChangeName = (e: any) => {
            setFilter(prev => ({...prev, Title: e.target.value}))
        }
        return (
            <div className='search-container'>
                <div>
                  <input
                      value={filter.Title}
                         onChange={e =>  setChangeName(e)}
                         className='form-control test-position' placeholder="Search title..."/>
                </div>
            <Select
                className="search-form width-200 custom-form"
                value={filter.Status}
                onChange={e => setChangeStatus(e)}
                displayEmpty
            >
                <MenuItem value={-1}>
                    <span className='placeholder-text'>Select status</span>
                </MenuItem>
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Disable</MenuItem>
            </Select>
            </div>
        )
    }

    const button: React.FC = () => {
        return (
            <div>
                <div onClick={ showModalAdd} className="btn btn-general">Add new </div>
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
            setItemFrom(total-perPage)
            setItemTo(total)
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
                                                    if (field.key === "Status") {
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                {item[field.key] ? (
                                                                <div className='justify-content-center d-flex'>
                                                                      <div className='status-success'>
                                                                          Active
                                                                      </div>
                                                                </div>

                                                                )
                                                                    :
                                                                    (
                                                                        <div className='justify-content-center d-flex'>
                                                                            <div className='status-disable'>
                                                                                Disable
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </TableCell>
                                                        )
                                                    }
                                                    if (field.key === "Action") {
                                                        return (
                                                            <TableCell className={field.class} key={crypto.randomUUID()}>
                                                                <span className='m-2 btn-icon p-1' onClick={() => showModalDetail(item)}>
                                                                    <RemoveRedEyeOutlinedIcon  />
                                                                </span>
                                                                <span className='m-2 btn-icon p-1' onClick={() => showModalEdit(item)}>
                                                                 <EditOutlinedIcon/>
                                                                </span>
                                                                <span className='m-2 btn-icon btn-delete p-1' onClick={() => deleteItem(item)}>
                                                                    <DeleteOutlineOutlinedIcon  />
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

export default FAQList
