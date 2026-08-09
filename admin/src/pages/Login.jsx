import React, { useContext, useState } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext.jsx";
import { toast } from "react-toastify";

const Login = () => {
    const [state, setState] = useState("Admin");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setToken, backendUrl } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (state === "Admin") {
                const { data } = await axios.post(
                    backendUrl + "/api/admin/login",
                    {
                        email,
                        password,
                    }
                );

                if (data.success) {
                    setToken(data.token);
                    localStorage.setItem("token", data.token);
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <form
            className="min-h-[80vh] flex items-center"
            onSubmit={onSubmitHandler}
        >
            <div className="flex flex-col gap-3 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg">

                <p className="text-2xl font-semibold">
                    <span className="text-[#5f6FFF]">{state}</span> Login
                </p>

                <div className="w-full">
                    <p>Email</p>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded w-full p-2 mt-1"
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded w-full p-2 mt-1"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-[#5f6FFF] text-white w-full py-2 rounded-md"
                >
                    Login
                </button>

                {state === "Admin" ? (
                    <p>
                        Doctor login?{" "}
                        <span
                            className="text-[#5f6FFF] underline cursor-pointer"
                            onClick={() => setState("Doctor")}
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Admin login?{" "}
                        <span
                            className="text-[#5f6FFF] underline cursor-pointer"
                            onClick={() => setState("Admin")}
                        >
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;