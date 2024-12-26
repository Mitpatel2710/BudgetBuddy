import { supabase } from '../lib/supabase';

export class UploadService {
  static async uploadReceipt(file: File, transactionId: string): Promise<string> {
    if (!supabase) {
      throw new Error('Database connection not initialized');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${transactionId}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Failed to upload receipt');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath);

    return publicUrl;
  }
}