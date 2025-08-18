'use server';
import PocketBase from 'pocketbase';

import {
  handleBadRequest,
  handleError,
  successResponse,
} from '@/lib/api-config';
import { POCKET_BASE_URL } from '@/lib/constants';
import { APIResponse } from '@/types';

import { getUserDetails } from './config-actions';

const pb = new PocketBase(POCKET_BASE_URL);

/**
 * Uploads or updates a file to temp_files collection.
 *
 * If a fileRecordId is provided, the existing record will be updated with the new file.
 * Otherwise, a new file record will be created.
 *
 * @param {File} file - The file to be uploaded or updated.
 * @param {string} [fileRecordId] - The ID of the existing file record to update, if any.
 * @returns {Promise<Object>} An object containing the success status, message, and file data
 *                            (including file name, URL, and record ID) upon success,
 *                            or an error message and status upon failure.
 */

export async function uploadFile(
  file: File,
  fileRecordId?: string,
): Promise<APIResponse> {
  const session = await getUserDetails();
  const merchantID = session?.user?.merchantID as string;

  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }

  try {
    const file_name = file?.name;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file_name);
    formData.append('merchantID', merchantID);

    // FILE ALREADY EXISTS AND ONLY NEEDS TO BE UPDATED
    if (fileRecordId) {
      const fileRecord = await pb
        .collection('temp_files')
        .update(fileRecordId, formData);

      const file_url = pb.files.getURL(fileRecord, fileRecord['file']);
      const file_record_id = fileRecord['id'];

      return {
        success: true,
        message: 'File Updated Successfully!',
        data: {
          file_name,
          file_url,
          file_record_id,
        },
      };
    }

    // FILE UPLOAD
    const fileRecord = await pb.collection('temp_files').create(formData);

    const file_url = pb.files.getURL(fileRecord, fileRecord['file']);
    const file_record_id = fileRecord['id'];

    return successResponse(
      {
        file_name,
        file_url,
        file_record_id,
      },
      'File Uploaded Successfully!',
    );
  } catch (error: Error | any) {
    return handleError(
      error,
      'UPLOAD-FILE',
      `URL: ${POCKET_BASE_URL}/uploads/${merchantID}/${file.name}`,
    );
  }
}
