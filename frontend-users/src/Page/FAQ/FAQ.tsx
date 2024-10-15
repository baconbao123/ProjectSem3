import React, { useEffect, useState } from 'react'
import './FAQ.scss'
import { $axios } from '../../axios'

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<any[]>([])
  console.log('faqs: ', faqs)

  useEffect(() => {
    const fetchFAQs = async () => {
      const res = await $axios.get('FAQFE')
      setFaqs(res.data)
    }

    fetchFAQs()
  }, [])

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='faq-page'>
      <div className='faq-container'>
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq: any, index: any) => (
          <div key={index} className='faq-item' onClick={() => toggleAnswer(index)}>
            <h2>{faq.Title}</h2>
            {openIndex === index && (
              <p className='faq-answer' dangerouslySetInnerHTML={{ __html: faq.Decription }} />
            )}{' '}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
