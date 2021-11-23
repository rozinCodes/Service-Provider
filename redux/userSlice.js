import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebase } from '../components/configuration/config';

export const signUp = createAsyncThunk('user/signUp', async ({ submittedEmail, submittedPassword }) => {
  const userCredential = await firebase.auth().createUserWithEmailAndPassword(firebase.auth(), submittedEmail, submittedPassword);

  const { uid, email, displayName } = userCredential.user;

  return { uid, email, displayName };
});

export const signIn = createAsyncThunk('user/signIn', async ({ submittedEmail, submittedPassword }) => {
  const userCredential = await firebase.auth().signInWithEmailAndPassword(firebase.auth(), submittedEmail, submittedPassword);

  const { uid, email, displayName } = userCredential.user;

  return { uid, email, displayName };
});

const initialState = {
  uid: null,
  email: null,
  displayName: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }) {
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
    },
    resetUser(state, action) {
      return initialState;
    },
  },
  extraReducers: {
    [signUp.pending]: (state, action) => {
      state.status = 'loading';
    },
    [signUp.fulfilled]: (state, { payload }) => {
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.status = 'success';
    },
    [signUp.rejected]: (state, action) => {
      state.status = 'failed';
    },
    [signIn.pending]: (state, action) => {
      state.status = 'loading';
    },
    [signIn.fulfilled]: (state, { payload }) => {
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.status = 'success';
    },
    [signIn.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export const { resetUser, setUser } = userSlice.actions;
export default userSlice.reducer;