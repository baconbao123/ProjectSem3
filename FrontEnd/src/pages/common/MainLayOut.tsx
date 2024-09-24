import React from "react";
import {useSelector} from "react-redux";
import {Skeleton} from "@mui/material";
interface MainLayOutProps {
    header: React.FC;
    search: React.FC;
    button: React.FC;
    content: React.FC;
    footer: React.FC;
}

const MainLayOut : React.FC<MainLayOutProps> = ({header, search, button, content, footer}) => {
    const loading = useSelector((state: any) => state.app.loading);
    const skeleton = useSelector((state: any) => state.app.skeleton);
    const skeletonSearch:React.FC =() => {
        return (
            <>
                <Skeleton animation={'wave'} width={'10%'} height={'50px'}></Skeleton>
                <div className='d-flex ' style={{gap: '10px'}}>
                    <Skeleton animation={'wave'} width={'10%'} height={'50px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'20%'} height={'50px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'10%'} height={'50px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'20%'} height={'50px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'10%'} height={'50px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'20%'} height={'50px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'10%'} height={'50px'}></Skeleton>
                </div>
                    <Skeleton animation={'wave'} width={'100%'} height={'50px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'100%'} height={'50px'}></Skeleton>

                    <Skeleton animation={'wave'} width={'100%'} height={'600px'}></Skeleton>
                    <Skeleton animation={'wave'} width={'100%'} height={'50px'}></Skeleton>

            </>
        )
    }
    return (
        <div className='main-page'>
            {skeleton ?
                skeletonSearch() :
                (
                    <>
                        <div className="header-page">
                            {header()}
                        </div>
                        <div className="search-page">
                            <div className="search-input">
                                {search()}
                            </div>
                            <div className="search-button">
                                {button()}
                            </div>
                        </div>
                            <div className='content-page'>
                                {content()}
                            </div>
                            <div className='footer-page'>
                                {footer()}
                            </div>
                        </>
                    )
            }
        </div>
    )
}

export default MainLayOut