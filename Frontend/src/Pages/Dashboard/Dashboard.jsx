import React from 'react'
import Dashnav from '../../Components/Dashnav/Dashnav'
import Dashtop from '../../Components/Dashtop/Dashtop'
import Text from '../../Components/Text-dash/Text'
import Category from '../../Components/Category/Category'

const Dashboard = () => {
  return (
    <div className=' flex flex-row w-full'>
        <Dashnav  className="2/12"/>
        <div className=' w-10/12 flex flex-col gap-12'>
          <Dashtop/>
          <div className=' flex items-center justify-center'>
            <Text/>
          </div>
          <div className=' flex items-center justify-center'>
            <Category/>
          </div>
        </div>
    </div>
  )
}

export default Dashboard