import React from 'react'

const Category = () => {
  return (
    <div className='flex flex-row w-[60rem] gap-20'>
        <div className=' bg-[#D9D9D9] w-60 h-44 flex flex-col items-center pt-3 '>
            <h1 className=' font-semibold text-[#184B05]'>Harvest</h1>
        </div>
        <div className=' bg-[#D9D9D9] w-60 h-44 flex flex-col items-center pt-3'>
            <h1 className=' font-semibold text-[#184B05]'>Income</h1>
        </div>
        <div className=' bg-[#D9D9D9] w-60 h-44 flex flex-col items-center pt-3'>
            <h1 className=' font-semibold text-[#184B05]'>Profit</h1>
        </div>
    </div>
  )
}

export default Category