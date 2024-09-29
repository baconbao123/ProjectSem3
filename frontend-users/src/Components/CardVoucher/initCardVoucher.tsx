interface CardVoucherState {
  type: 'Freeship' | 'discountByOrder' | 'discountByCategory'
  name: 'FREESHIP' | 'VOUCHER'
  icon: 'pi pi-truck' | 'pi pi-box' | 'pi pi-book'
  desc: 'On Orders Over' | 'On Category'
  id?: string
  discount: string
  status: string
  quantity: string
  userId?: string
  subCate?: string
  totalOrder?: string
}

export function createVoucher(
  id: string,
  type: 'Freeship' | 'discountByOrder' | 'discountByCategory',
  discount: string,
  status: string,
  quantity: string,
  userId: string = '',
  subCate: string = '',
  totalOrder: string = ''
): CardVoucherState {
  switch (type) {
    case 'Freeship':
      return {
        id,
        type,
        name: 'FREESHIP',
        icon: 'pi pi-truck',
        desc: 'On Orders Over',
        userId,
        quantity,
        discount,
        status,
        totalOrder
      }
    case 'discountByOrder':
      return {
        id,
        type,
        name: 'VOUCHER',
        icon: 'pi pi-box',
        desc: 'On Orders Over',
        userId,
        quantity,
        discount,
        status,
        totalOrder
      }
    case 'discountByCategory':
      return {
        id,
        type,
        name: 'VOUCHER',
        icon: 'pi pi-book',
        desc: 'On Category',
        userId,
        quantity,
        discount,
        status,
        subCate,
        totalOrder
      }
  }
}
