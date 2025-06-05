import React from 'react'

import Header from '../Layouts/Header'
import Sidebar from '../Layouts/SideBar'


const Profile = () => {
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
                    </div>
                </div>
            </div>
        </div>
    );


};


export default Profile;





