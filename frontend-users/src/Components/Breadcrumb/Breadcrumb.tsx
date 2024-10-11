import { Container } from 'react-bootstrap'
import { BreadCrumb } from 'primereact/breadcrumb'
import './Breadcrumb.scss'

interface BreadcrumbItem {
  label?: string
  url: string
  page?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  home: BreadcrumbItem
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, home }) => {
  const model = items.map((i) => ({
    label: i.label,
    url: i.url,
    className: i.page ? 'breadcrumb-page' : ''
  }))

  const homeItem = home ? { label: home.label, url: home.url } : undefined

  return (
    <div className='breadcrumb-container'>
      <Container>
        <BreadCrumb model={model} home={homeItem} />
      </Container>
    </div>
  )
}

export default Breadcrumb
