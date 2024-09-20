import React, {useEffect, useState} from "react";
import {
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
interface MainLayOutProps {
    fields: any;
    data: any;
}

const BaseTable: React.FC<MainLayOutProps> = ({fields, data}) => {
    const [total, setTotal] = useState(data.length);
    const [perPage, setPerPage] = useState<any>(15);
    const [itemFrom, setItemFrom] = useState<number>(1);
    const [itemTo, setItemTo] = useState<number>(15);
    const [currentPage, setCurrentPage] =  useState(1)
    const setOnchangePage = (e: any) => {
        console.log("check change ", e.target.value)

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
    useEffect(() => {
        switch (perPage) {
            case 'All':
                setItemFrom(1)
                setItemTo(total)
                setCurrentPage(1)
                break
            case 15:
                setItemFrom(1)
                setItemTo(15)
                setCurrentPage(1)
                break
            case 25:
                setItemFrom(1)
                setItemTo(25)
                setCurrentPage(1)
                break
            case 50:
                setItemFrom(1)
                setItemTo(50)
                setCurrentPage(1)
                break
            default:
                break
        }

    }, [perPage])

    useEffect(() => {
        setCurrentPage(Math.floor(itemTo / perPage))

    }, [itemTo]);

    return (
        <div className="table-container" >

            <Table >
                <TableHead>
                    <TableRow>
                        {fields.map((item : any) => {
                            return (
                                <TableCell key={item.key} className={item.class}>
                                    <b>
                                        {item.label}
                                    </b>
                                </TableCell>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody className='body-table'>
                            {data.map((item : any, index: number) => {
                                if ((itemFrom <= index + 1  && itemTo >= index + 1 && currentPage === 1 ) || (itemFrom <= index && itemTo > index && currentPage !== 1)) {
                                    console.log("check data ", item)
                                return (
                                    <TableRow key={crypto.randomUUID() }>
                                        {
                                            fields.map((field: any) => {

                                                return (
                                                    <TableCell className={field.class} key={crypto.randomUUID()} >
                                                        { item[field.key]}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                )
                            }

                        })}
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
                    <KeyboardDoubleArrowLeftOutlinedIcon  className='icon' onClick={setFirstPage}/>
                    <KeyboardArrowLeftOutlinedIcon  className='icon' onClick={setPreviousPage} />
                    {itemFrom}–{itemTo} of {total}
                    <KeyboardArrowRightOutlinedIcon  className='icon' onClick={setNextPage}/>
                    <KeyboardDoubleArrowRightOutlinedIcon className='icon'  onClick={setLastPage} />
                </div>
            </div>
        </div>


    )
}

export default BaseTable