import React from "react";


interface Props {
    error?: string
}

const ErrorPage: React.FC<Props> = ({error = "Error"}) => {
    return (
        <h1>{error}</h1>
    )
}

export  default ErrorPage