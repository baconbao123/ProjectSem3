import React from "react";
interface MainLayOutProps {
    header: React.FC;
    search: React.FC;
    button: React.FC;
    content: React.FC;
    footer: React.FC;
}

const MainLayOut : React.FC<MainLayOutProps> = ({header, search, button, content, footer}) => {
    const Header = header;
    const Search = search;
    const Button = button;
    const Content = content;
    const Footer = footer;
    return (
        <div className='main-page'>

            <div className="header-page">
               <Header />
            </div>
            <div className="search-page">
                <div className="search-input">
                    <Search />
                </div>
                <div className="search-button">
                    <Button />
                </div>
            </div>
            <div className='content-page'>
               <Content />
            </div>
            <div className='footer-page'>
                <Footer />
            </div>
        </div>
    )
}

export default MainLayOut