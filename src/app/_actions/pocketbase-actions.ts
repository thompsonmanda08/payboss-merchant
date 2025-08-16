import PocketBase from 'pocketbase';

import { handleError, successResponse } from '@/lib/api-config';
import { POCKET_BASE_URL } from '@/lib/constants';
import { APIResponse } from '@/types';

import { getUserDetails } from './config-actions';

const pb = new PocketBase(POCKET_BASE_URL);

/**
 * Uploads or updates a payment batch file to the 'bulk_direct_payments' collection.
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

export async function uploadPaymentBatchFile(
  file: File,
  fileRecordId?: string,
): Promise<APIResponse> {
  const session = await getUserDetails();
  const merchantID = session?.user?.merchantID as string;

  try {
    const file_name = file?.name;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file_name);
    formData.append('merchantID', merchantID);

    // FILE ALREADY EXISTS AND ONLY NEEDS TO BE UPDATED
    if (fileRecordId) {
      const fileRecord = await pb
        .collection('bulk_direct_payments')
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
    const fileRecord = await pb
      .collection('bulk_direct_payments')
      .create(formData);

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
    return handleError(error, 'UPLOAD-POST', `POCKET URL: ${POCKET_BASE_URL}`);
  }
}

/**
 * Uploads a Proof of Payment (POP) document to the corresponding merchant's collection in PocketBase.
 * @param {File} file The file to be uploaded
 * @param {string} fileRecordId The ID of the file to be updated. If not provided, a new file will be created.
 * @returns {Object} An object with the following properties:
 *  - success: A boolean indicating if the operation was successful
 *  - message: A string describing the outcome of the operation
 *  - data: An object containing the uploaded file's name, URL and ID
 */
export async function uploadPOPDocument(
  file: File,
  fileRecordId: string,
): Promise<APIResponse> {
  const session = await getUserDetails();
  const merchantID = session?.user?.merchantID as string;

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

      return successResponse(
        {
          file_name,
          file_url,
          file_record_id,
        },
        'POP File Updated Successfully!',
      );
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
      'POP File Uploaded Successfully!',
    );
  } catch (error: Error | any) {
    return handleError(error, 'UPLOAD-POST', `POCKET URL: ${POCKET_BASE_URL}`);
  }
}

/**
 * Uploads a business file to the corresponding merchant's collection in PocketBase.
 * @param {File} file The file to be uploaded
 * @param {string} merchantID The ID of the merchant
 * @param {string} fileRecordId The ID of the file to be updated. If not provided, a new file will be created.
 * @returns {Object} An object with the following properties:
 *  - success: A boolean indicating if the operation was successful
 *  - message: A string describing the outcome of the operation
 *  - data: An object containing the uploaded file's name, URL and ID
 */
export async function uploadBusinessFile(
  file: File,
  fileRecordId?: string,
): Promise<APIResponse> {
  const session = await getUserDetails();
  const merchantID = session?.user?.merchantID as string;

  try {
    const file_name = file?.name;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file_name);
    formData.append('merchantID', merchantID);

    // FILE ALREADY EXISTS AND ONLY NEEDS TO BE UPDATED
    if (fileRecordId) {
      const fileRecord = await pb
        .collection('merchant_onboarding_documents')
        .update(fileRecordId, formData);

      const file_url = pb.files.getURL(fileRecord, fileRecord['file']);
      const file_record_id = fileRecord['id'];

      return successResponse(
        {
          file_name,
          file_url,
          file_record_id,
        },
        'File Updated Successfully!',
      );
    }

    // FILE UPLOAD
    const fileRecord = await pb
      .collection('merchant_onboarding_documents')
      .create(formData);

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
      'UPLOAD-POST',
      `POCKET URL: ${POCKET_BASE_URL}/merchant_onboarding_documents`,
    );
  }
}

/**
 * Uploads a terminal configuration file to the 'terminal_config_files' collection.
 *
 * The uploaded file is associated with the merchant making the request.
 *
 * @param {File} file - The file to be uploaded.
 *
 * @returns {Promise<Object>} An object containing the success status, message, and file data
 *                            (including file name, URL, and record ID) upon success,
 *                            or an error message and status upon failure.
 */
export async function uploadTerminalConfigFile(
  file: File,
): Promise<APIResponse> {
  const session = await getUserDetails();
  const merchantID = session?.user?.merchantID as string;

  try {
    const file_name = file?.name;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file_name);
    formData.append('merchantID', merchantID);

    // FILE UPLOAD
    const fileRecord = await pb
      .collection('terminal_config_files')
      .create(formData);

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
    return handleError(error, 'UPLOAD-POST', `POCKET URL: ${POCKET_BASE_URL}`);
  }
}

export async function uploadCheckoutLogoFile(
  file: File,
  fileRecordId?: string,
): Promise<APIResponse> {
  const session = await getUserDetails();
  const merchantID = session?.user?.merchantID as string;

  try {
    const file_name = file?.name;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file_name);
    formData.append('merchantID', merchantID);

    // FILE ALREADY EXISTS AND ONLY NEEDS TO BE UPDATED
    if (fileRecordId) {
      const fileRecord = await pb
        .collection('merchant_checkout_logo_files')
        .update(fileRecordId, formData);

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
    }

    // FILE UPLOAD
    const fileRecord = await pb
      .collection('merchant_checkout_logo_files')
      .create(formData);

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
    return handleError(error, 'UPLOAD-POST', `POCKET URL: ${POCKET_BASE_URL}`);
  }
}
