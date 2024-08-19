
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const users = ref<any[]>([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/user')
      users.value = response.data
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const addUser = async (user: any) => {
    try {
      await axios.post('/api/user', user)
      await fetchUsers()
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const updateUser = async (user: any) => {
    try {
      await axios.put('/api/user', user)
      await fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await axios.delete('/api/user', { data: { id } })
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return { users, fetchUsers, addUser, updateUser, deleteUser }
})