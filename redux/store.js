import { configureStore } from '@reduxjs/toolkit'
import technicialSlice from './technicialSlice'

export default configureStore({
    reducer: {
       techinican: technicialSlice
    }
})