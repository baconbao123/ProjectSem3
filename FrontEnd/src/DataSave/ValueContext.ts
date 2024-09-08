import React from "react";
interface ValueContext {
    dataToast?: any,
    closeToast?: any,
    openToast?: any,
    setLoading?: any,
    checkToken?: any,
    navigate?: any
}
const Value = React.createContext<ValueContext>({})
export default Value
