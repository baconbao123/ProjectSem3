import { Container } from 'react-bootstrap'
import { BreadCrumb } from 'primereact/breadcrumb'
import './Breadcrumb.scss'

interface BreadcrumbItem {
  label?: string
  url: string
  icon?: string,
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
    icon: i.icon,
    className: i.page ? 'breadcrumb-page':''
  }))

  const homeItem = home ? { icon: home.icon || 'pi pi-home', url: home.url } : undefined

  return (
    <div className='breadcrumb-container'>
      <Container>
        <BreadCrumb model={model} home={homeItem} />
      </Container>
    </div>
  )
}

export default Breadcrumb
