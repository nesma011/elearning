import React from 'react'
import Rank from './Rank'
import QuestionPerformance from './QuestionPerformance'
import PerformanceDashboard from './PerformanceDashboard'
import TopPerformance from './TopWeakSystems'
import Sidebar from '../SideBar/Sidebar'

export default function Performance () 

{
  return (
    <div>
    
    <div className="flex md:ms-80 min-h-screen">
        <Sidebar />
        <div className='flex-col flex-1 justify-center items-center gap-4'>
        <Rank/>
        <TopPerformance/>
        <QuestionPerformance/>
        <PerformanceDashboard/>
        </div>

        </div>

    </div>
  )
}
