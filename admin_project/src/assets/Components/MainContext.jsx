import { createContext, useState } from "react";

export const AdminContext = createContext();

export default function MainContext({ children }) {
  const [edit, Setedit] = useState(null);

  return (
    <AdminContext.Provider value={{ edit, Setedit }}>
      {children}
    </AdminContext.Provider>
  );
}