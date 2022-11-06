import { createSlice } from "@reduxjs/toolkit";

const packageSlice = createSlice({
  name: "package",
  initialState: {
    itemList: [],
    dataList: [],
    item: {},
    totalQuantity: 0,
    showpackage: false,
  },
  reducers: {
    addTopackage(state, action) {
      const newItem = action.payload;

      state.itemList = newItem;
    },
    addToDataStore(state, action) {
      const newItem = action.payload;

      state.dataList = newItem;
    },
    addToData(state, action) {
      const newItem = action.payload;

      state.itemList.users = newItem;
      state.itemList.limit = 30;
      state.itemList.total = newItem.length;
    },
    updateData(state, action) {
      const newItem = action.payload;

      state.itemList.users = newItem;
    },
    deleteData(state, action) {
      const newItem = action.payload;

      state.itemList.users = newItem;
    },
    addNewUser(state, action) {
      const newItem = action.payload;

      if (newItem && newItem !== null) {
        if (state.itemList.users.includes(newItem)) {
          alert("Duplicate User Added");
        } else {
          state.itemList.users.unshift(newItem);
        }
      } else {
        alert("Null Value try to add");
      }
    },
  },
});

export const packageActions = packageSlice.actions;

export default packageSlice;
