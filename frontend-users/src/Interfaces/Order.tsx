import Product from './Product'

interface StatusDetail {
  Ordered?: string 
  Cancel?: string
  Processing?: string
  Delivery?: string
  Completed?: string
  [key: string]: string |undefined
}

export interface Order {
  idOrder: string
  idUser: string
  status: string
  statusDetail: StatusDetail
  cancellationReason?: string
  Products: Product[]
  totalPrice: string
}
