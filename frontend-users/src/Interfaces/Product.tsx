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
  ProductImage: string[]
  CategoryName: string
  CreateAt: string
  //   Thêm
  special?: string
}

// export default interface Product {
//   Id: number
// //   Code: string
// //   CategoryId: string
//   Name: string
//   Status: boolean
//   Description: string
// //   Profit: string
//   BasePrice: string
//   SellPrice: string
//   Quantity: string
//   Manufactor: string
// //   PublisherId: string
//   ProductImage: string[]
// //   Thêm
//   special?: string
// }
