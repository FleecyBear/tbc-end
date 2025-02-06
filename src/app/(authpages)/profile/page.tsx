'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
interface ProfileData {
  first_name: string
  last_name: string
  nickname: string
  email: string
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'first_name' | 'last_name' | 'nickname' | null>(null)
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    nickname: '',
    email: '',
  })
  const [nicknameError, setNicknameError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
          setError('Error fetching user session.')
          return
        }

        if (!user) {
          setError('You are not logged in. Please log in to view your profile.')
          return
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileError) {
          setError(`Error fetching profile data: ${profileError.message}`)
        } else {
          setProfileData(data)
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            nickname: data.nickname || '',
            email: user.email || '',
          })
        }
      } catch (err) {
        setError('An unexpected error occurred.')
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    if (name === 'nickname') {
      setNicknameError(null)
    }
  }

  const checkNicknameAvailability = async (nickname: string) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      setError('You are not logged in. Please log in to check nickname availability.')
      return 'User session is missing.'
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('nickname', nickname)
      .neq('user_id', user.id) 
      .single()

    if (error) {
      return null
    }

    return 'This nickname is already taken. Please choose another one.'
  }

  const handleSubmit = async (e: React.FormEvent, field: keyof ProfileData) => {
    e.preventDefault()

    if (field === 'nickname') {
      const nicknameTakenError = await checkNicknameAvailability(formData.nickname)
      if (nicknameTakenError) {
        setNicknameError(nicknameTakenError)
        return
      }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      setError('You are not logged in. Please log in to update your profile.')
      return
    }

    const updatedField = { [field]: formData[field] }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...updatedField,
      })

    if (updateError) {
      setError(`Error updating profile: ${updateError.message}`)
    } else {
      setProfileData({
        ...profileData!,
        ...updatedField,
      })
      setEditingField(null) 
    }
  }

  if (error) {
    return <div className="text-red-600 text-xl text-center mt-12">{error}</div>
  }

  if (!profileData) {
    return <div className="text-xl text-center mt-12">Loading your profile...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-[#44318D] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-[#2A1B3C] dark:text-[#E98074] text-center mb-6">Profile</h2>

        <div className="space-y-4">
          {/* First Name */}
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-lg text-[#2A1B3C] dark:text-white">First Name:</span>
            {editingField === "first_name" ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="border p-2 rounded text-black"
              />
            ) : (
              <span className="font-semibold text-[#D83F87]">{profileData?.first_name || "N/A"}</span>
            )}
            {editingField !== "first_name" ? (
              <button className="text-[#D83F87] hover:text-[#E98074]" onClick={() => {
                setEditingField("first_name");
                setFormData(prev => ({ ...prev, first_name: profileData?.first_name || "" }));
              }}>Edit</button>
            ) : (
              <button className="text-green-500 hover:text-green-700" onClick={(e) => handleSubmit(e, "first_name")}>Save</button>
            )}
          </div>

          {/* Last Name */}
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-lg text-[#2A1B3C] dark:text-white">Last Name:</span>
            {editingField === "last_name" ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="border p-2 rounded text-black"
              />
            ) : (
              <span className="font-semibold text-[#D83F87]">{profileData?.last_name || "N/A"}</span>
            )}
            {editingField !== "last_name" ? (
              <button className="text-[#D83F87] hover:text-[#E98074]" onClick={() => {
                setEditingField("last_name");
                setFormData(prev => ({ ...prev, last_name: profileData?.last_name || "" }));
              }}>Edit</button>
            ) : (
              <button className="text-green-500 hover:text-green-700" onClick={(e) => handleSubmit(e, "last_name")}>Save</button>
            )}
          </div>

          {/* Nickname */}
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-lg text-[#2A1B3C] dark:text-white">Nickname:</span>
            {editingField === "nickname" ? (
              <div>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="border p-2 rounded text-black"
                />
                {nicknameError && <p className="text-red-500 text-sm">{nicknameError}</p>}
              </div>
            ) : (
              <span className="font-semibold text-[#E98074]">{profileData?.nickname || "N/A"}</span>
            )}
            {editingField !== "nickname" ? (
              <button className="text-[#D83F87] hover:text-[#E98074]" onClick={() => {
                setEditingField("nickname");
                setFormData(prev => ({ ...prev, nickname: profileData?.nickname || "" }));
              }}>Edit</button>
            ) : (
              <button className="text-green-500 hover:text-green-700" onClick={(e) => handleSubmit(e, "nickname")}>Save</button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-lg text-[#2A1B3C] dark:text-white">Email:</span>
            <span className="font-semibold text-[#A4B3B6]">{profileData?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
