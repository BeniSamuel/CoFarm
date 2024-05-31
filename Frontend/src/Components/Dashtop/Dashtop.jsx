import React from 'react'
import menu_icon from '../../assets/menu-component.png'
import profile_img from '../../assets/profile_image.png'

const Dashtop = () => {
  return (
    <div className=' bg-[#83DF75] flex flex-row justify-between items-center px-6 w-full h-20'>
        <div>
            <img src={menu_icon} className=' h-10 w-10' />
        </div>
        <div>
            <img src={profile_img} className=' h-10 w-10' />
            <div className=' bg-green-700 h-3 w-3 rounded-full relative bottom-3 left-8'></div>
        </div>
    </div>
  )
}

export default Dashtop