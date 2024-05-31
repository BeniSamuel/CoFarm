import React from 'react'
import farmer1 from '../../assets/farmer1.png'

const Loginleft = () => {
  return (
    <div className=' bg-[#184B05] h-[100vh] flex flex-col items-center w-1/2 justify-center ' >
        <div className=' flex flex-col gap-14 items-center'>
            <div className=' bg-[#83DF75] h-[23rem] w-[23rem] rounded-full flex flex-col items-center justify-center '>
                <img src={farmer1} className=' h-80 w-62'/>
            </div>
            <p className=' text-white text-xl font-medium'>Join the family of farmers</p>
       
        </div>
    </div>
  )
}

export default Loginleft