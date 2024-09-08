
import CircularProgress from '@mui/material/CircularProgress';
import {Backdrop} from "@mui/material";
import {useSelector} from "react-redux";
// interface Props {
//     loading:boolean
// }
const Loading: React.FC= () => {
    const loading = useSelector((state: any) => state.app.loading);

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loading