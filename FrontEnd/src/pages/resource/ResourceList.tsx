import React, {useEffect} from "react";
import MainLayOut from "@pages/common/MainLayOut.tsx";
import BaseTable from "@pages/common/BaseTable.tsx";
import {useDispatch} from "react-redux";
import {setShowModal} from "@src/Store/Slinces/appSlice.ts";
import HomePage from "@pages/admin/HomePage";
import Modal from "@pages/common/Modal.tsx";
import Breadcrumb from "@pages/common/breadcrumbs";


const ResourceList : React.FC = () => {
    const dispatch = useDispatch();

    const [field, setField] = React.useState<any>([]);
    const [data, setData] = React.useState<any>([]);

    useEffect(() => {
        setField([
            {key: "description", label: "Description", class: ""},
            {key: "name", label: "Name", class: ""},
            {key: "status", label: "Status", class: ""},
            {key: "action", label: "Action", class: "th__action"},
        ])
        for (let i = 1; i <= 100; i++) {
            data.push({name: "Name " +i, status: "" +i, description: "Abc1"})
        }
        setData(data)
    }, []);

    const showModalAdd = () => {
        dispatch(setShowModal(true))
    }
 
  
    
    const header: React.FC = () => {
        return (
           <div>
            <Breadcrumb/>
           </div>
        )
    }

    const search: React.FC = () => {
        return (
            <div>
              <input className='form-control test-position' placeholder="Search..."/>
            </div>
        )
    }

    const button: React.FC = () => {
        return (
            <div>
                <button onClick={showModalAdd} className="btn btn-general">Add new </button>
            </div>
        )
    }

    const content: React.FC = () => {
        return (
            <div>
                <BaseTable fields={field} data={data}/>
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
                content={HomePage}
                title={'Add new element'}
            />

            <MainLayOut
            header={header}
            search={search}
            button={button}
            content={content}
            footer={footer}
            />

        </>
    )
}

export default ResourceList
