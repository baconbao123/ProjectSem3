import React from "react";
import defaultImage from  '@src/images/default.png'
import image404 from  '@src/images/404.png'
import image403 from  '@src/images/403.png'
import image401 from  '@src/images/401.png'
import image500 from  '@src/images/500.png'
import image400 from  '@src/images/400.png'
import other from  '@src/images/other.png'
interface Props {
    error?: string
}


const ErrorPage: React.FC<Props> = ({error = "Error"}) => {

    const notFound = () => {
        return (
            <div className="error-page">
               <img src={image404} alt="Image"  className="error-page-image" />
            </div>
        )
    }

    const forbidden = () => {
        return (
            <div className="error-page">
                <img src={image403} alt="Image"  className="error-page-image" />
            </div>
        )
    }
    const serverError = () => {
        return (
            <div className="error-page">
                <img src={image500} alt="Image"  className="error-page-image" />
            </div>
        )
    }
    const authorize = () => {
        return (
            <div className="error-page">
                <img src={image401} alt="Image"  className="error-page-image" />
            </div>
        )
    }
    const otherPage = () => {
        return (
            <div className="error-page">
                <img src={other} alt="Image"  className="error-page-image" />
            </div>
        )
    }
    const badRequest = () => {
        return (
            <div className="error-page">
                <img src={image400} alt="Image"  className="error-page-image" />
            </div>
        )
    }


    const component = () => {
        switch (error) {
            case '404':
                return notFound();
            case '403':
                return forbidden();
            case '500':
                return serverError();
            case '401':
                return authorize();
            case '400':
                return badRequest();
            default:
                return otherPage();
        }
    }
    return (
        <>
            {component()}
        </>
    )
}

export  default ErrorPage