import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {

  const {
    dtoken,
    profileData,
    setProfileData,
    getProfileData,
    backendUrl
  } = useContext(DoctorContext)

  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)


  // Get doctor profile
  useEffect(() => {

    if (dtoken) {
      getProfileData()
    }

  }, [dtoken])


  // Update profile
  const updateProfile = async () => {

    try {

      setLoading(true)

      const updateData = {
        address: {
          line1: profileData.address?.line1 || '',
          line2: profileData.address?.line2 || ''
        },
        fees: profileData.fees,
        availablity: profileData.availablity
      }

      console.log('Sending update:', updateData)

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        updateData,
        {
          headers: {
            token: dtoken
          }
        }
      )


      if (data.success) {

        toast.success(data.message)

        // If backend returns updated profile
        if (data.profileData) {
          setProfileData(data.profileData)
        } else {
          // Otherwise fetch updated profile
          await getProfileData()
        }

        setIsEdit(false)

      } else {

        toast.error(data.message)

      }

    } catch (error) {

      console.log('UPDATE PROFILE ERROR:', error)

      toast.error(
        error.response?.data?.message || error.message
      )

    } finally {

      setLoading(false)

    }
  }


  // Cancel editing
  const cancelEdit = () => {

    setIsEdit(false)

    // Get original data again from database
    getProfileData()
  }


  // Loading state
  if (!profileData) {

    return (
      <div className='w-full min-h-[60vh] flex items-center justify-center'>

        <p className='text-gray-500 text-sm'>
          Loading profile...
        </p>

      </div>
    )

  }


  return (

    <div className='w-full max-w-5xl mx-auto p-5'>

      {/* Main Profile Card */}

      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>


        {/* ================= PROFILE HEADER ================= */}

        <div className='bg-gray-50 p-6 border-b border-gray-200'>

          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>


            {/* Doctor Image */}

            <div className='shrink-0'>

              <img
                className='
                  w-36
                  h-36
                  rounded-xl
                  object-cover
                  border
                  border-gray-200
                  shadow-sm
                '
                src={profileData.image}
                alt='Doctor'
              />

            </div>


            {/* Doctor Information */}

            <div className='flex-1 text-center sm:text-left'>

              {/* Name */}

              <p className='text-2xl font-semibold text-gray-800'>

                {profileData.name}

              </p>


              {/* Degree + Speciality */}

              <div className='
                flex
                flex-wrap
                justify-center
                sm:justify-start
                items-center
                gap-2
                mt-3
              '>

                <p className='text-gray-600 font-medium'>

                  {profileData.degree}

                </p>

                <span className='text-gray-400'>
                  -
                </span>

                <p className='text-gray-600 font-medium'>

                  {profileData.speciality}

                </p>

              </div>


              {/* Experience */}

              <span className='
                inline-block
                mt-4
                px-4
                py-1.5
                rounded-full
                bg-blue-50
                text-blue-600
                text-sm
                font-medium
                border
                border-blue-100
              '>

                {profileData.experiance} Experience

              </span>

            </div>

          </div>

        </div>


        {/* ================= PROFILE DETAILS ================= */}

        <div className='p-6 space-y-7'>


          {/* ================= ABOUT ================= */}

          <div>

            <p className='text-lg font-semibold text-gray-800 mb-3'>
              About
            </p>

            <p className='
              text-gray-600
              leading-7
              text-sm
              max-w-3xl
            '>

              {profileData.about}

            </p>

          </div>


          {/* ================= APPOINTMENT FEE ================= */}

          <div>

            <p className='text-lg font-semibold text-gray-800 mb-3'>
              Appointment Fee
            </p>


            <div className='flex items-center gap-2'>

              <span className='text-gray-700 font-medium'>
                {currency}
              </span>


              {isEdit ? (

                <input
                  type='number'
                  min='0'
                  value={profileData.fees ?? ''}
                  onChange={(e) => {

                    setProfileData(prev => ({
                      ...prev,
                      fees: e.target.value
                    }))

                  }}
                  className='
                    w-32
                    px-3
                    py-2
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                  '
                />

              ) : (

                <p className='text-xl font-semibold text-gray-700'>

                  {profileData.fees}

                </p>

              )}

            </div>

          </div>


          {/* ================= ADDRESS ================= */}

          <div>

            <p className='text-lg font-semibold text-gray-800 mb-3'>
              Address
            </p>


            <div className='
              text-sm
              text-gray-600
              leading-6
              bg-gray-50
              border
              border-gray-200
              rounded-lg
              p-4
              max-w-xl
              space-y-3
            '>


              {isEdit ? (

                <>

                  {/* Address Line 1 */}

                  <input
                    type='text'
                    value={profileData.address?.line1 || ''}
                    onChange={(e) => {

                      setProfileData(prev => ({
                        ...prev,

                        address: {
                          ...(prev.address || {}),
                          line1: e.target.value
                        }

                      }))

                    }}
                    placeholder='Address line 1'
                    className='
                      w-full
                      px-3
                      py-2
                      border
                      border-gray-300
                      rounded-lg
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-blue-500
                    '
                  />


                  {/* Address Line 2 */}

                  <input
                    type='text'
                    value={profileData.address?.line2 || ''}
                    onChange={(e) => {

                      setProfileData(prev => ({
                        ...prev,

                        address: {
                          ...(prev.address || {}),
                          line2: e.target.value
                        }

                      }))

                    }}
                    placeholder='Address line 2'
                    className='
                      w-full
                      px-3
                      py-2
                      border
                      border-gray-300
                      rounded-lg
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-blue-500
                    '
                  />

                </>

              ) : (

                <>

                  <p>
                    {profileData.address?.line1 || 'Address not available'}
                  </p>

                  <p>
                    {profileData.address?.line2 || ''}
                  </p>

                </>

              )}

            </div>

          </div>


          {/* ================= AVAILABILITY ================= */}

          <div className='
            flex
            items-center
            justify-between
            border-t
            border-gray-200
            pt-6
          '>


            <div>

              <p className='font-semibold text-gray-800'>
                Availability
              </p>

              <p className='text-sm text-gray-500 mt-1'>
                Available for new appointments
              </p>

            </div>


            <div className='flex items-center gap-3'>


              {/* Checkbox */}

              <input
                type='checkbox'
                id='available'
                checked={Boolean(profileData.availablity)}
                disabled={!isEdit}
                onChange={(e) => {

                  setProfileData(prev => ({
                    ...prev,
                    availablity: e.target.checked
                  }))

                }}
                className='
                  w-5
                  h-5
                  accent-blue-600
                  cursor-pointer
                  disabled:cursor-not-allowed
                '
              />


              {/* Label */}

              <label
                htmlFor='available'
                className={`
                  text-sm
                  font-medium
                  ${isEdit
                    ? 'text-gray-700 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                  }
                `}
              >

                Available

              </label>

            </div>

          </div>


          {/* ================= BUTTONS ================= */}

          <div className='
            flex
            justify-end
            gap-3
            border-t
            border-gray-200
            pt-6
          '>


            {isEdit ? (

              <>

                {/* Cancel */}

                <button
                  type='button'
                  onClick={cancelEdit}
                  disabled={loading}
                  className='
                    px-6
                    py-2.5
                    border
                    border-gray-300
                    text-gray-700
                    rounded-lg
                    font-medium
                    hover:bg-gray-100
                    transition-all
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  '
                >

                  Cancel

                </button>


                {/* Save */}

                <button
                  type='button'
                  onClick={updateProfile}
                  disabled={loading}
                  className='
                    px-6
                    py-2.5
                    bg-blue-600
                    text-white
                    rounded-lg
                    font-medium
                    hover:bg-blue-700
                    active:scale-95
                    transition-all
                    shadow-sm
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  '
                >

                  {loading ? 'Saving...' : 'Save'}

                </button>

              </>

            ) : (

              /* Edit Button */

              <button
                type='button'
                onClick={() => setIsEdit(true)}
                className='
                  px-6
                  py-2.5
                  bg-blue-600
                  text-white
                  rounded-lg
                  font-medium
                  hover:bg-blue-700
                  active:scale-95
                  transition-all
                  shadow-sm
                '
              >

                Edit

              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  )
}

export default DoctorProfile