import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext.jsx";

const MyProfile = () => {

    const {
        userData,
        setUserData,
        backendUrl,
        token,
        loadUserProfileData
    } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    // Loading state
    if (!userData) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    // =========================
    // SAVE PROFILE
    // =========================

    const handleSave = async () => {

        try {

            const formData = new FormData();

            formData.append(
                "name",
                userData.name || ""
            );

            formData.append(
                "phone",
                userData.phone || ""
            );

            formData.append(
                "address",
                JSON.stringify({
                    line1: userData.address?.line1 || "",
                    line2: userData.address?.line2 || ""
                })
            );

            formData.append(
                "dob",
                userData.dob || ""
            );

            formData.append(
                "gender",
                userData.gender || ""
            );

            // Add image only if user selected a new image
            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.post(
                backendUrl + "/api/user/update-profile",
                formData,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (data.success) {

                toast.success(data.message);

                setIsEdit(false);

                setImage(null);

                // Get updated data from backend
                await loadUserProfileData();

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log("UPDATE PROFILE ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };


    return userData && (

        <div className="max-w-3xl mx-auto p-6">

            {/* ========================= */}
            {/* PROFILE IMAGE */}
            {/* ========================= */}

            <div className="relative w-36">

                {userData?.image || image ? (

                    <img
                        className="w-36 h-36 object-cover rounded-lg"
                        src={
                            image
                                ? URL.createObjectURL(image)
                                : userData.image
                        }
                        alt="Profile"
                    />

                ) : (

                    <div className="w-36 h-36 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        No Image
                    </div>

                )}

                {isEdit && (
                    <>
                        <label
                            htmlFor="profile-image"
                            className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded cursor-pointer shadow text-sm"
                        >
                            Edit
                        </label>

                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                        />
                    </>
                )}

            </div>


            {/* ========================= */}
            {/* NAME */}
            {/* ========================= */}

            {isEdit ? (

                <input
                    className="bg-gray-100 text-3xl font-medium max-w-60 mt-4 p-2 rounded outline-none"
                    type="text"
                    value={userData.name || ""}
                    onChange={(e) =>
                        setUserData((prev) => ({
                            ...prev,
                            name: e.target.value
                        }))
                    }
                />

            ) : (

                <p className="font-medium text-3xl text-neutral-800 mt-4">
                    {userData.name || "No name"}
                </p>

            )}


            <hr className="bg-zinc-400 h-[1px] border-none my-5" />


            {/* ========================= */}
            {/* CONTACT INFORMATION */}
            {/* ========================= */}

            <div>

                <p className="text-neutral-500 underline mt-3">
                    CONTACT INFORMATION
                </p>

                <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">

                    {/* EMAIL */}

                    <p className="font-medium">
                        Email:
                    </p>

                    <p className="text-blue-500">
                        {userData.email || ""}
                    </p>


                    {/* PHONE */}

                    <p className="font-medium">
                        Phone:
                    </p>

                    {isEdit ? (

                        <input
                            className="bg-gray-100 max-w-52 p-2 rounded outline-none"
                            type="text"
                            value={userData.phone || ""}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    phone: e.target.value
                                }))
                            }
                        />

                    ) : (

                        <p className="text-blue-500">
                            {userData.phone || "Not provided"}
                        </p>

                    )}


                    {/* ADDRESS */}

                    <p className="font-medium">
                        Address:
                    </p>

                    {isEdit ? (

                        <div className="flex flex-col gap-2">

                            {/* Address Line 1 */}

                            <input
                                className="bg-gray-100 p-2 rounded outline-none"
                                type="text"
                                placeholder="Address Line 1"
                                value={
                                    userData.address?.line1 || ""
                                }
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        address: {
                                            ...(prev.address || {}),
                                            line1: e.target.value
                                        }
                                    }))
                                }
                            />

                            {/* Address Line 2 */}

                            <input
                                className="bg-gray-100 p-2 rounded outline-none"
                                type="text"
                                placeholder="Address Line 2"
                                value={
                                    userData.address?.line2 || ""
                                }
                                onChange={(e) =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        address: {
                                            ...(prev.address || {}),
                                            line2: e.target.value
                                        }
                                    }))
                                }
                            />

                        </div>

                    ) : (

                        <p className="text-gray-500">

                            {userData.address?.line1 ||
                                "Address not provided"}

                            <br />

                            {userData.address?.line2 || ""}

                        </p>

                    )}

                </div>

            </div>


            {/* ========================= */}
            {/* BASIC INFORMATION */}
            {/* ========================= */}

            <div>

                <p className="text-neutral-500 underline mt-5">
                    BASIC INFORMATION
                </p>

                <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">

                    {/* GENDER */}

                    <p className="font-medium">
                        Gender:
                    </p>

                    {isEdit ? (

                        <select
                            className="max-w-32 bg-gray-100 p-2 rounded outline-none"
                            value={userData.gender || ""}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    gender: e.target.value
                                }))
                            }
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                        </select>

                    ) : (

                        <p className="text-gray-500">
                            {userData.gender || "Not provided"}
                        </p>

                    )}


                    {/* DATE OF BIRTH */}

                    <p className="font-medium">
                        Date of Birth:
                    </p>

                    {isEdit ? (

                        <input
                            className="bg-gray-100 max-w-40 p-2 rounded outline-none"
                            type="date"
                            value={userData.dob || ""}
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    dob: e.target.value
                                }))
                            }
                        />

                    ) : (

                        <p className="text-gray-500">

                            {userData.dob
                                ? new Date(
                                    userData.dob
                                ).toLocaleDateString()
                                : "Not provided"
                            }

                        </p>

                    )}

                </div>

            </div>


            {/* ========================= */}
            {/* BUTTON */}
            {/* ========================= */}

            <div className="mt-8">

                {isEdit ? (

                    <button
                        type="button"
                        onClick={handleSave}
                        className="border border-blue-500 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all"
                    >
                        Save Information
                    </button>

                ) : (

                    <button
                        type="button"
                        onClick={() => setIsEdit(true)}
                        className="border border-blue-500 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all"
                    >
                        Edit Profile
                    </button>

                )}

            </div>

        </div>
    );
};

export default MyProfile;