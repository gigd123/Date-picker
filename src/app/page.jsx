'use client'
import DatePicker from '@/components/DatePicker/DatePicker/DatePicker'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function Home() {
  const [{ startDate, endDate }, setTimeData] = useState({})
  return (
    <main className=' flex min-h-screen flex-col items-center justify-between p-24'>
      <DatePicker onGetTimeCallback={setTimeData} />
      startDate: {startDate && dayjs(startDate).format()}
      <br />
      endDate: {endDate && dayjs(endDate).format()}
      <br />
    </main>
  )
}
