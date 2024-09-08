import {Alert, Snackbar} from "@mui/material";
import React from "react";

import {useDispatch, useSelector} from "react-redux";
import {closeToast} from "@src/Store/Slinces/appSlice.ts";

const Toast: React.FC = () => {
    const dispatch = useDispatch()
    const showToast = useSelector((state: any) => state.app.showToast);
    const toast = useSelector((state: any) => state.app.toast);

    return (
        <>
            <Snackbar
                open={showToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' } }
                onClose={() => dispatch(closeToast())}
                autoHideDuration={6000}
            >
                <Alert
                    onClose={() => dispatch(closeToast())}
                    severity={toast.status}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Toast;