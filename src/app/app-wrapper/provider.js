"use client";

import { Provider as ReduxProvider } from "react-redux";

import { store } from "../redux/store";

export default function Provider({ children }) {
 
  return (
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
  );
}