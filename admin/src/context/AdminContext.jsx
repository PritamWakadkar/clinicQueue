import { createContext, useState } from "react";


export const AdminContext = createContext()

const AdminContextProvider=(props)=>{


    const [token ,setToken] = useState('')

    const value={
        token,setToken
    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider