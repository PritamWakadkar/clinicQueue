import React, { useState } from "react";
import { assets } from "../assets/assets/assets_frontend/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Pritam Wakadkar",
    image: assets.profile_pic,
    email: "pritamwakadkar@gmail.com",
    phone: "+91 9579090343",
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle Road, London",
    },
    gender: "Male",
    dob: "2006-01-01",
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleSave = () => {
    // API call can be added here later
    setIsEdit(false);
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">

      {/* Profile Image */}
      <img
        className="w-36 rounded-lg"
        src={userData.image}
        alt="Profile"
      />

      {/* Name */}
      {isEdit ? (
        <input
          className="bg-gray-100 text-3xl font-medium max-w-60 mt-4 p-2 rounded"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      {/* Contact Information */}
      <div>
        <p className="text-neutral-500 underline mt-3">
          CONTACT INFORMATION
        </p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">

          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">Phone:</p>

          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52 p-2 rounded"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>

          {isEdit ? (
            <div className="flex flex-col gap-2">
              <input
                className="bg-gray-100 p-2 rounded"
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line1: e.target.value,
                    },
                  }))
                }
              />

              <input
                className="bg-gray-100 p-2 rounded"
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line2: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className="text-neutral-500 underline mt-5">
          BASIC INFORMATION
        </p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">

          <p className="font-medium">Gender:</p>

          {isEdit ? (
            <select
              className="max-w-28 bg-gray-100 p-2 rounded"
              value={userData.gender}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}

          <p className="font-medium">Date of Birth:</p>

          {isEdit ? (
            <input
              className="bg-gray-100 max-w-40 p-2 rounded"
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  dob: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-gray-500">
              {new Date(userData.dob).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8">
        {isEdit ? (
          <button
            onClick={handleSave}
            className="border border-blue-500 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all"
          >
            Save Information
          </button>
        ) : (
          <button
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