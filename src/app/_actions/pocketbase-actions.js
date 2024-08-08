import PocketBase from 'pocketbase'
import { POCKET_BASE_URL } from '@/lib/constants'

const pb = new PocketBase(POCKET_BASE_URL)

export async function uploadBusinessFile(file, merchantID, fileRecordId) {
  try {
    let file_name = file?.name
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file_name)
    formData.append('merchantID', merchantID)

    // FILE ALREADY EXISTS AND ONLY NEEDS TO BE UPDATED
    if (fileRecordId) {
      const fileRecord = await pb
        .collection('merchantAttachments')
        .update(fileRecordId, formData)

      const file_url = pb.getFileUrl(fileRecord, fileRecord['file'])
      const file_record_id = fileRecord['id']

      return {
        success: true,
        message: 'File Updated Successfully!',
        data: {
          file_name,
          file_url,
          file_record_id,
        },
      }
    }

    // FILE UPLOAD
    const fileRecord = await pb
      .collection('merchantAttachments')
      .create(formData)

    console.log(fileRecord)

    const file_url = pb.getFileUrl(fileRecord, fileRecord['file'])
    const file_record_id = fileRecord['id']

    return {
      success: true,
      message: 'File Uploaded Successfully!',
      data: {
        file_name,
        file_url,
        file_record_id,
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
