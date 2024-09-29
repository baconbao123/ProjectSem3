import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Voucher } from '../Interfaces/Voucher'

interface voucherState {
  items: Voucher[]
  userId: string | null
}

const initialState: voucherState = {
  items: [],
  userId: null
}

export const loadVoucherFromLocalStorage = (userId: string | null): Voucher[] => {
  if (!userId) return []

  try {
    const saveCart = localStorage.getItem(`voucher_${userId}`)
    if (saveCart) {
      return JSON.parse(saveCart)
    }
  } catch (e) {
    console.log(e)
  }

  return []
}

const saveVoucherToLocalStorage = (userId: string | null, voucher: Voucher[]) => {
  if (!userId) return

  try {
    const claimedVouchers = voucher.filter((v) => v.status === 'CLAIMED')
    const claimedKey = `voucherClaimed_${userId}`
    localStorage.setItem(claimedKey, JSON.stringify(claimedVouchers))

    const allVouchersKey = `voucher_${userId}`
    localStorage.setItem(allVouchersKey, JSON.stringify(voucher))
  } catch (e) {
    console.log(e)
  }
}

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
      state.items = loadVoucherFromLocalStorage(state.userId)
    },
    addVouchers: (state, action: PayloadAction<{ userId: string; vouchers: Voucher[] }>) => {
      const { userId, vouchers } = action.payload;

      if (userId) {
        const updatedVouchers = vouchers.map((voucher) => {
          const existingVoucher = state.items.find((item) => item.id === voucher.id);
          if (existingVoucher && existingVoucher.status === 'CLAIMED') {
            return { ...voucher, status: 'BELONG' }; // Change status to 'BELONG'
          }
          if (voucher.status === 'CLAIMED') {
            return { ...voucher, status: 'BELONG' }; // Change status to 'BELONG'
          }
          return voucher;
        });
        state.items = [...state.items, ...updatedVouchers];
        saveVoucherToLocalStorage(userId, state.items);
      }
    },
    claimVoucher: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const voucherIndex = state.items.findIndex((v) => v.id === id)

      if (voucherIndex !== -1) {
        state.items[voucherIndex].status = 'CLAIMED'
        saveVoucherToLocalStorage(state.userId, state.items)
      }
    }
  }
})

export const { setUserId, addVouchers, claimVoucher } = voucherSlice.actions
export default voucherSlice.reducer
