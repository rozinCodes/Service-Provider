import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	products: [],
	status: 'idle',
	error: null
};

export const fetchProducts = createAsyncThunk('technician/fetchTechnician', async () => {
	const response = await fetch('http://103.28.121.57/api/products');
	return response.json();
});

const productSlice = createSlice({
	name: 'products',
	initialState: initialState,
	reducers: {},
	extraReducers: {
		[fetchProducts.pending]: (state) => {
			state.status = 'loading';
		},
		[fetchProducts.fulfilled]: (state) => {
			state.status = 'completed';
		},
		[fetchProducts.rejected]: (state) => {
			state.status = 'failed';
		}
	}
});

export default productSlice.reducer;
