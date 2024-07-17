// import { create } from 'zustand'
// import pb from '@/app/_actions/pocketbase-actions'

// const usePocketbaseStore = create((set) => ({
//   upload: null,
//   isLoading: false,

//   uploadFile: async (file) => {
//     set({ upload: null, isLoading: true })
//     try {
//       const formData = new FormData()
//       formData.append('file', file)

//       const data = await pb.collection('files').create(formData)
//       set({ upload: data, isLoading: false })
//       const url = pb.getFileUrl(data, data['docs'])

//       console.log('URL', url)
//     } catch (error) {
//       console.error(error)
//       set({ upload: error.response, isLoading: false })
//     }
//   },
// }))

// export default usePocketbaseStore
