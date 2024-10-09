export default interface Product {
  Id: number
  Code?: string
  Name: string
  Status: boolean
  Description: string
  BasePrice: string
  SellPrice: string
  Quantity: string
  Manufactor: string
  Author: string
  ProductImage?: string[]
  ImageThumbPath?: string
  CategoryName: string
  CreatedAt: string
  CompanyPartnerName?: string
  //   Thêm
  special?: string
}
