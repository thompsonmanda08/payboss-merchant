import { create } from 'zustand'
import pb from '@/app/_actions/pocketbase-actions'

const usePocketbaseStore = create((set) => ({
  upload: null,
  isloading: false,
  uploadFile: async (file) => {
    set({ upload: null, isloading: true })
    try {
      const formData = new FormData()
      formData.append('file', file)

      const data = await pb.collection('files').create(formData)
      set({ upload: data, isloading: false })
      const url = pb.getFileUrl(data, data['docs'])

      console.log('URL', url)
    } catch (error) {
      console.log('uplaod Failed:', error)
      set({ upload: error.response, isloading: false })
    }
  },
}))

export default usePocketbaseStore
