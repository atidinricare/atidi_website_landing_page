'use client'

import { Calendar } from 'lucide-react'
import styles from './BookAppointmentFloat.module.css'

const APPOINTMENT_URL = 'https://app.atidinricare.com/'

const BookAppointmentFloat = () => {
  return (
    <a
      href={APPOINTMENT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.float}
      aria-label="Book an appointment"
      data-testid="book-appointment-float"
    >
      <Calendar size={18} aria-hidden="true" />
      <span className={styles.label}>Book an Appointment</span>
    </a>
  )
}

export default BookAppointmentFloat
