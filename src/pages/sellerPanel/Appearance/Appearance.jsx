import React from 'react'
import HomeContent from '../Home/HomeContent'
import Header from '../Layouts/Header'
import Sidebar from '../Layouts/SideBar'
import AppearanceContent from './AppearanceContent'

const Appearance = () => {
    return (

        <div>

            <Header />

            <div className="flex h-screen ">

                <div className="flex-1 flex ">
                    <div className="w-64 bg-[#EABF9F] ">
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <div className="p-6  bg-[#FAF3E0] flex-1 overflow-auto">
                        <AppearanceContent></AppearanceContent>
                    </div>
                </div>
            </div>
        </div>
    );


};


export default Appearance;





