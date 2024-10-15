import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Product from '../Interfaces/Product'

interface CartState {
  items: Product[]
  userId: string | null
  itemCount: number
}

const initialState: CartState = {
  items: [],
  userId: null,
  itemCount: 0
}

// Get Product from local storage
const loadCartFormLocalStorage = (userId: string | null): { items: Product[]; itemCount: number } => {
  if (!userId) return { items: [], itemCount: 0 }
  try {
    const savedCart = localStorage.getItem(`cart_${userId}`)
    if (savedCart) {
      const items = JSON.parse(savedCart)
      return { items, itemCount: items.length }
    }
  } catch (e) {
    console.log(e)
  }

  return { items: [], itemCount: 0 }
}

// Save Product to Local storage
const saveCartToLocalStorage = (userId: string | null, cart: Product[]) => {
  if (!userId) return
  try {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))
  } catch (error) {
    console.log(error)
  }
}

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload

      const { items, itemCount } = loadCartFormLocalStorage(state.userId)

      state.items = items

      state.itemCount = itemCount
    },

    // add Product to Cart

    addProductToCart: (state, action: PayloadAction<Product>) => {
      if (state.userId) {
        const existingProductIndex = state.items.findIndex((item) => item.Id === action.payload.Id)
        if (existingProductIndex === -1) {
          state.items.push(action.payload)
          saveCartToLocalStorage(state.userId, state.items)

          const { itemCount } = loadCartFormLocalStorage(state.userId)

          state.itemCount = itemCount
        }
      }
    },

    // add Products to Cart
    addProductsToCart: (state, action: PayloadAction<Product[]>) => {
      if (state.userId) {
        state.items = [...state.items, ...action.payload]
        saveCartToLocalStorage(state.userId, state.items)
        const { itemCount } = loadCartFormLocalStorage(state.userId)

        state.itemCount = itemCount
      }
    },

    // save Cart
    saveProductInCart: (state, action: PayloadAction<Product[]>) => {
      if (state.userId) {
        state.items = action.payload
        state.itemCount = action.payload.length 

        saveCartToLocalStorage(state.userId, state.items)
      }
    },

    clearProductInCart: (state, action: PayloadAction<number>) => {
      if (state.userId) {
        const updateProduct = state.items.filter((p) => p.Id !== action.payload)
        state.items = updateProduct
        saveCartToLocalStorage(state.userId, state.items)
        const { itemCount } = loadCartFormLocalStorage(state.userId)

        state.itemCount = itemCount
      }
    },

    // Clear Cart

    clearCart: (state) => {
      state.items = []

      state.itemCount = 0 // Đặt lại count về 0

      if (state.userId) {
        saveCartToLocalStorage(state.userId, state.items)
      }
    }
  }
})

export const { setUserId, addProductToCart, addProductsToCart, saveProductInCart, clearCart, clearProductInCart } =
  cartSlice.actions
export default cartSlice.reducer
