import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


const initialState = {
    products: [],
    status: 'idle',
    error: null,
}

export const fetchEmp = createAsyncThunk('technician/fetchTechnician', async () => {
  const response = await fetch("http://192.168.150.242:8080/thikthak/api/user")
  return response.json();
})

export const technicianSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {},
    extraReducers: {
      [fetchEmp.pending]: (state) => {
        state.status = 'loading'
      },
      [fetchEmp.fulfilled]: (state, action) => {
        state.status = "succeeded"
        const {payload} = action;
        state.products = payload.products;
      },
      [fetchEmp.rejected]: (state) => {
        state.status = "failed"
      }
    }
})

export const selectStatus = state => state.products.status
export const selectFeaturedProducts = state => state.products.products.filter(product => product.is_featured)
export const selectHeadphones = state => state.products.products.filter(product => product.category === 'headphones')
export const selectSpeakers = state => state.products.products.filter(product => product.category === 'speakers')
export const selectEarphones = state => state.products.products.filter(product => product.category === 'earphones')
export const selectProductsById = (state, id) => state.products.products.find(product => product.id === id)

export default technicianSlice.reducer