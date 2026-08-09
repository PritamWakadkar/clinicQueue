import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets.js'
import { AdminContext } from '../../context/AdminContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [education, setEducation] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { token,backendUrl } = useContext(AdminContext)


  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (!docImg) {
        return toast.error('Image not selected')
      }

      const formData = new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('education', education)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append("available", true);
      formData.append(
        'address',
        JSON.stringify({
          line1: address1,
          line2: address2,
        })
      )

      formData.forEach((value, key) => {
        console.log(`${key}:`, `${value}`)
      })
      
      

      const {data} = await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers:{token}})
      
      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setAbout('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setEducation('')
        setEmail('')
        setFees('')
        setPassword('')
      }else{
         toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form className="m-5 w-full" onSubmit={onSubmitHandler}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">

        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>

          <input
            type="file"
            id="doc-img"
            hidden
            onChange={(e) => setDocImg(e.target.files[0])}
          />

          <p>
            Upload Doctor <br />
            Picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">

          <div className="w-full lg:flex-1 flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                type="text"
                placeholder="Doctor Name"
                className="border rounded px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                type="email"
                placeholder="Doctor Email"
                className="border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Password</p>
              <input
                type="password"
                placeholder="Doctor@123"
                className="border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
               className="border rounded px-3 py-2"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {[1,2,3,4,5,6,7,8,9,10].map((year) => (
                  <option key={year} value={`${year} year`}>
                    {year} year
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                type="number"
                placeholder="Fees"
                className="border rounded px-3 py-2"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>

          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <p>Speciality</p>

              <select
                className="border rounded px-3 py-2"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Degree</p>
              <input
                type="text"
                placeholder="Degree"
                className="border rounded px-3 py-2"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Education</p>
              <input
                type="text"
                placeholder="Education"
                className="border rounded px-3 py-2"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Address</p>

              <input
                type="text"
                placeholder="Address Line 1"
                className="border rounded px-3 py-2"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Address Line 2"
                className="border rounded px-3 py-2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                required
              />
            </div>

          </div>

        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>

          <textarea
            rows={5}
            placeholder="Write about doctor"
            className="w-full px-4 pt-2 border rounded"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#5f6FFF] px-10 py-3 mt-4 text-white rounded-full cursor-pointer"
        >
          Add Doctor
        </button>

      </div>
    </form>
  )
}

export default AddDoctor