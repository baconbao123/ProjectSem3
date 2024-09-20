interface CardVoucherState {
  type: 'Freeship' | 'discountByOrder' | 'discountByCategory'
  name: 'FREESHIP' | 'VOUCHER'
  icon: 'pi pi-truck' | 'pi pi-box' | 'pi pi-book'
  discount: string
  desc: 'On Orders Over' | 'On Category'
  subCate?: string
  totalOrder?: string
}

export function createVoucher(
  type: 'Freeship' | 'discountByOrder' | 'discountByCategory',
  discount: string,
  subCate?: string,
  totalOrder?: string
): CardVoucherState {
  switch (type) {
    case 'Freeship':
      return {
        type,
        name: 'FREESHIP',
        icon: 'pi pi-truck',
        discount,
        desc: 'On Orders Over',
        totalOrder
      }
    case 'discountByOrder':
      return {
        type,
        name: 'VOUCHER',
        icon: 'pi pi-box',
        discount,
        desc: 'On Orders Over',
        totalOrder
      }
    case 'discountByCategory':
      return {
        type,
        name: 'VOUCHER',
        icon: 'pi pi-book',
        discount,
        desc: 'On Category',
        subCate,
        totalOrder
      }
  }
}
