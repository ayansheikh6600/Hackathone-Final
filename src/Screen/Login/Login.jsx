import React, { useEffect, useState } from 'react'
import { Link, json, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, doc, getDoc } from '../../Firebase/firebase';

import logo from "../../assets/logo.png"
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate("")
    const user = JSON.parse(localStorage.getItem("user"))

    const [Email, SetEmail] = useState()
    const [Password, SetPassoword] = useState()

    useEffect(()=>{

        if(user){
            navigate("/dashboard")
        }


    },[user])

    const SingingHanlder = (e) => {
        const notify = () => toast("Login Successfully");
        const notifyNot = () => toast("Creditional Error");
        e.preventDefault();
        console.log("aaaa")
        // return   
        signInWithEmailAndPassword(auth, Email, Password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("aaaaa", user)

                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    notify()
                    console.log("Document data:", docSnap.data());
                    const UserData = docSnap.data()

                    if(UserData.userType == "Admin"){
                        localStorage.setItem("user", JSON.stringify(user))
                navigate("/dashboard")
                    }
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
                // localStorage.setItem("user", JSON.stringify(user))
                // navigate("/dashboard")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                notifyNot()
            });
    }



    return (
        
        <div className="  flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
           <ToastContainer />
           
            <div className="sm:mx-auto sm:w-full flex flex-col sm:max-w-sm items-center justify-center">
                {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10 text-black p-2 mx-auto bg-indigo-500 rounded-full"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg> */}
                <img src={logo} className='bg-[#15304A] rounded-2xl' alt="" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
                    Sign In
                </h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={SingingHanlder}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-black"
                        >
                            Email Address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder='Enter Email'
                                onChange={(e) => {
                                    SetEmail(e.target.value)
                                }}
                                autoComplete="email"
                                required
                                style={{ paddingLeft: 10 }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#29456b] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-black"
                            >
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder='Enter Password'
                                onChange={(e) => {
                                    SetPassoword(e.target.value)
                                }}
                                required
                                style={{ paddingLeft: 10 }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#29456b] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            className="flex w-full justify-center rounded-md bg-[#15304A] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#25496b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29456b]"
                            type='submit'
                        >
                            Sign In
                        </button>
                    </div>
                </form>


            </div>
        </div>
    )
}

export default Login