import { supabaseAdmin } from '@/lib/supabase'

export class ClaimUploadService {
  async validateFile(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and PDF files are allowed')
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB')
    }

    return true
  }

  async uploadToStorage(file: File, claimId: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${claimId}_${Date.now()}.${fileExt}`
    const filePath = `claim-documents/${userId}/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from('claim-documents')
      .upload(filePath, file)

    if (error) throw error
    return { path: filePath, fileName }
  }

  async createDocumentRecord(claimId: string, userId: string, fileInfo: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: document, error } = await supabaseAdmin
      .from('claim_documents')
      .insert([{claim_id: claimId,
        user_id: userId,
        file_name: fileInfo.fileName,
        file_path: fileInfo.path,
        file_type: fileInfo.fileName.split('.').pop(),
        file_size: fileInfo.size,
        uploaded_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return document
  }

  async getClaimDocuments(claimId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: documents, error } = await supabaseAdmin
      .from('claim_documents')
      .select('*')
      .eq('claim_id', claimId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return documents || []
  }

  async deleteDocument(documentId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: document, error: fetchError } = await supabaseAdmin
      .from('claim_documents')
      .select('file_path')
      .eq('id', documentId)
      .single()

    if (fetchError) throw fetchError

    const { error: deleteError } = await supabaseAdmin.storage
      .from('claim-documents')
      .remove([document.file_path])

    if (deleteError) throw deleteError

    const { error: dbError } = await supabaseAdmin
      .from('claim_documents')
      .delete()
      .eq('id', documentId)

    if (dbError) throw dbError
    return { success: true }
  }
}

