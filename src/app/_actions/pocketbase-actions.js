import PocketBase from 'pocketbase'
import { POCKET_BASE_URL } from '@/lib/constants'

const pb = new PocketBase(POCKET_BASE_URL)

export async function uploadBusinessFile(file, merchantID) {
  console.log(file)
  try {
    let file_name = file?.name
    // let file_type = file?.type
    // let file_size = file?.size
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file_name)
    formData.append('merchantID', merchantID || 'N/A')

    const fileRecord = await pb
      .collection('merchantAttachments')
      .create(formData)
    console.log(fileRecord)

    const file_url = pb.getFileUrl(fileRecord, fileRecord['file'])

    // console.log('URL', file_url)

    return {
      success: true,
      message: 'File Uploaded Successfully!',
      data: {
        file_name,
        file_url,
      },
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      status: error.status,
      message:
        error.response?.message ||
        'An error occurred while uploading the file.',
      data: null,
    }
  }
}
