import {useEffect} from "react";
import {setLoading} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";


const HomePage : React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('id')) {
            dispatch(setLoading(false))
        }

    }, []);
    return (
        <div>
            <h1>This is admin home page</h1>
        </div>
    )
}

export default HomePage