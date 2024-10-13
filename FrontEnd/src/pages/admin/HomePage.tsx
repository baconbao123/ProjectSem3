import {useEffect} from "react";
import {setLoading} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import Dashboard from "@pages/dashboard/Dashboard";


const HomePage : React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('id')) {
            dispatch(setLoading(false))
        }

    }, []);
    return (
        <div className="mt-2">
           <Dashboard/>
        </div>
    )
}

export default HomePage