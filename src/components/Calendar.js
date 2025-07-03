import React from "react"
import { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function Example() {
    return (
        <Calendar
            calendar={persian}
            locale={persian_fa}
        />
    )
}