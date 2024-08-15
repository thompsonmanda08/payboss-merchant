import PocketBase from 'pocketbase'

export const POCKET_BASE_URL = 'http://102.23.121.41'

const pb = new PocketBase(POCKET_BASE_URL)

export async function uploadPaymentBatchFile(file, merchantID, fileRecordId) {
  try {
    let file_name = file?.name
    const formData = new FormData()
    formData.append('field', file)
    formData.append('fileName', file_name)
    formData.append('merchantID', merchantID)

    // FILE ALREADY EXISTS AND ONLY NEEDS TO BE UPDATED
    if (fileRecordId) {
      const fileRecord = await pb
        .collection('bulk_direct_payments')
        .update(fileRecordId, formData)

      const file_url = pb.getFileUrl(fileRecord, fileRecord['field'])
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
      .collection('bulk_direct_payments')
      .create(formData)

    const file_url = pb.getFileUrl(fileRecord, fileRecord['field'])
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
        .collection('merchant_onboarding_documents')
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
      .collection('merchant_onboarding_documents')
      .create(formData)

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
