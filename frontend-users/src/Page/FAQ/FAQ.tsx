import React, { useState } from 'react'
import './FAQ.scss'

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='faq-page'>
      <div className='faq-container'>
        <h1>Frequently Asked Questions</h1>
        {faqData.map((faq, index) => (
          <div key={index} className='faq-item' onClick={() => toggleAnswer(index)}>
            <h2>{faq.question}</h2>
            {openIndex === index && <p className='faq-answer'>{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

// Data FAQ
const faqData = [
  {
    question: 'What is your return policy?',
    answer: 'You can return books and stationery within 30 days of purchase with a valid receipt.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to most countries. Please check our shipping page for details and rates.'
  },
  {
    question: "Can I order a book that's not in stock?",
    answer: 'Yes, we can place a special order for you. Please contact customer support for assistance.'
  },
  {
    question: 'Do you have a membership program?',
    answer: 'Yes, our membership program offers discounts and exclusive deals. Sign up in-store or online.'
  }
]

export default FAQ
