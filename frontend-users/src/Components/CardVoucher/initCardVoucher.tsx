export interface InitVoucherState {
  Type: number
  name: 'FREESHIP' | 'VOUCHER'
  icon: 'pi pi-truck' | 'pi pi-box' | 'pi pi-book'
  desc?: 'On Category'
  Id?: string
  Discount: string
  status: string
  quantity: string
  subCate?: string
}

export function createVoucher(initVoucher: InitVoucherState): InitVoucherState {
  const { Id, Type, Discount, status, quantity, subCate } = initVoucher

  switch (Type) {
    case 1:
      return {
        Id,
        Type,
        name: 'FREESHIP',
        icon: 'pi pi-truck',
        quantity,
        Discount,
        status
      }
    case 2:
      return {
        Id,
        Type,
        name: 'VOUCHER',
        icon: 'pi pi-box',
        quantity,
        Discount,
        status
      }
    case 3:
      return {
        Id,
        Type,
        name: 'VOUCHER',
        icon: 'pi pi-book',
        desc: 'On Category',
        quantity,
        Discount,
        status,
        subCate
      }
    default:
      throw new Error(`InvalId voucher Type: ${Type}`)
  }
}

export default createVoucher
