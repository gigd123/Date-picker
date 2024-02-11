'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-tw'
dayjs.locale('zh-tw')
import Button from '@/components/Button/Button'

const DatePicker = ({ buttonClass = 'w-[44px] h-[44px] hover:bg-[#e6e6e6]', onGetTimeCallback = () => {} }) => {
  const isBetween = require('dayjs/plugin/isBetween')
  dayjs.extend(isBetween)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [calendarDates, setCalendarDates] = useState([])

  const handleDateClick = date => () => {
    if ((startDate && endDate) || !startDate || date.isBefore(startDate)) {
      setStartDate(date)
      setEndDate(null)
    } else if (date.isSame(startDate) || date.isAfter(startDate)) {
      setEndDate(date)
    }
  }

  const handleMonthChange = newDate => () => {
    setCurrentMonth(newDate)
  }

  useEffect(() => {
    const firstDay = currentMonth.startOf('month').startOf('week')
    const lastDay = currentMonth.endOf('month').endOf('week')

    const calendarDates = []
    let currentDate = firstDay

    while (currentDate.isBefore(lastDay)) {
      calendarDates.push(currentDate)
      currentDate = currentDate.add(1, 'day')
    }

    const formattedCalendarDates = calendarDates.reduce((rows, currentDay, index) => {
      if (index % 7 === 0) rows.push([])
      rows[rows.length - 1].push(currentDay)
      return rows
    }, [])

    setCalendarDates(formattedCalendarDates)
  }, [currentMonth])

  useEffect(() => {
    if (startDate && endDate) {
      onGetTimeCallback({ startDate, endDate })
    }
  }, [startDate, endDate])

  return (
    <div className='w-[350px] h-[240px] text-[16px]'>
      <div className='h-[44px] mb-[16px] flex items-center justify-between mb-4'>
        <Button className={buttonClass} onClick={handleMonthChange(currentMonth.subtract(1, 'month'))}>
          {'<'}
        </Button>
        <span>{currentMonth.format('MMMM YYYY')}</span>
        <Button className={buttonClass} onClick={handleMonthChange(currentMonth.add(1, 'month'))}>
          {'>'}
        </Button>
      </div>
      <table>
        <thead>
          <tr>
            {[
              { key: 'Sun', title: '週日' },
              { key: 'Mon', title: '週一' },
              { key: 'Tue', title: '週二' },
              { key: 'Wed', title: '週三' },
              { key: 'Thu', title: '週四' },
              { key: 'Fri', title: '週五' },
              { key: 'Sat', title: '週六' },
            ].map(({ key, title }) => (
              <th key={key}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarDates.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map(day => {
                return (
                  <td
                    key={day.format('YYYY-MM-DD')}
                    onClick={handleDateClick(day)}
                    className={`w-[50px] h-[36px] text-center cursor-pointer
                                ${
                                  day.isSame(startDate) ||
                                  (startDate && endDate && dayjs(day).isBetween(startDate, endDate, 'day', '[]'))
                                    ? 'bg-[#006edc] text-white'
                                    : ''
                                }
                                ${day.isSame(dayjs(), 'day') ? 'bg-[#ffff76]' : ''}
                                hover:bg-[#e6e6e6]`}
                  >
                    <div className='inline w-[20px]'>{day.format('D')}</div>
                    <div className='inline text-center w-[20px]'>日</div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DatePicker
