import React from 'react'
import { useNavigate } from 'react-router-dom'

const Protected = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"))
// const user =false
    const navigate = useNavigate()

    

    if (!user) {
        navigate("/")
    }


    return (




        <div>
            {
                children
            }
        </div>
    )
}

export default Protected