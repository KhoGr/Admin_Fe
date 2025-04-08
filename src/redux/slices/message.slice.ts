import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessageState {
  open: boolean;
  duration: number;
  message: string;
  variant: 'filled' | 'outlined' | 'text';
  type: 'success' | 'error' | 'info' | 'warning';
}

const initialState: MessageState = {
  open: false,
  duration: 2000,
  message: 'This is a message',
  variant: 'filled',
  type: 'success',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string | Partial<MessageState>>) {
      const { payload } = action;

      if (typeof payload === 'string') {
        return { ...state, open: true, message: payload };
      }

      return { ...state, open: true, ...payload };
    },
    closeMessage(state) {
      state.open = false;
    },
  },
});

const { reducer, actions } = messageSlice;
export const { setMessage, closeMessage } = actions;
export default reducer;