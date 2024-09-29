import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Product from '../Interfaces/Product'

interface CartState {
  items: Product[]
  userId: string | null
}

const initialState: CartState = {
  items: [],
  userId: null
}

// Get Product from local storage
const loadCartFormLocalStorage = (userId: string | null): Product[] => {
  if (!userId) return []
  try {
    const savedCart = localStorage.getItem(`cart_${userId}`)
    if (savedCart) {
      return JSON.parse(savedCart)
    }
  } catch (e) {
    console.log(e)
  }

  return []
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
      state.items = loadCartFormLocalStorage(state.userId)
    },

    // add Product to Cart
    addProductToCart: (state, action: PayloadAction<Product>) => {
      if (state.userId) {
        state.items.push(action.payload)
        saveCartToLocalStorage(state.userId, state.items)
      }
    },

    // add Products to Cart
    addProductsToCart: (state, action: PayloadAction<Product[]>) => {
      if (state.userId) {
        state.items = [...state.items, ...action.payload]
        saveCartToLocalStorage(state.userId, state.items)
      }
    },

    // save Cart
    saveProductInCart: (state, action: PayloadAction<Product[]>) => {
      if (state.userId) {
        state.items = action.payload
        saveCartToLocalStorage(state.userId, state.items)
      }
    },

    clearProductInCart: (state, action: PayloadAction<number>) => {
      if (state.userId) {
        const updateProduct = state.items.filter((p) => p.Id !== action.payload)
        state.items = updateProduct
        saveCartToLocalStorage(state.userId, state.items)
      }
    },

    // Clear Cart
    clearCart: (state) => {
      state.items = []
      if (state.userId) {
        saveCartToLocalStorage(state.userId, state.items)
      }
    }
  }
})

export const { setUserId, addProductToCart, addProductsToCart, saveProductInCart, clearCart, clearProductInCart } =
  cartSlice.actions
export default cartSlice.reducer
