import React from "react";
import Sidebar from './layouts/Sidebar';
const Layout = ({ children }) => {
    return (
              <div className="wrapper">
                <Sidebar />
                <div className='maincontent_div'>
                    {children}
                </div>
            </div>
    )
}
export default Layout;