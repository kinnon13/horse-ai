import { NextRequest, NextResponse } from 'next/server'
import { ClaimUploadService } from './ClaimUploadService'

const uploadService = new ClaimUploadService()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const claimId = formData.get('claimId') as string
    const userId = formData.get('userId') as string

    if (!file || !claimId || !userId) {
      return NextResponse.json({ error: 'File, claim ID, and user ID are required' }, { status: 400 })
    }

    await uploadService.validateFile(file)
    const fileInfo = await uploadService.uploadToStorage(file, claimId, userId)
    const document = await uploadService.createDocumentRecord(claimId, userId, {
      ...fileInfo,
      size: file.size
    })

    return NextResponse.json({ success: true, document }, { status: 201 })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const claimId = searchParams.get('claimId')

    if (!claimId) {
      return NextResponse.json({ error: 'Claim ID required' }, { status: 400 })
    }

    const documents = await uploadService.getClaimDocuments(claimId)
    return NextResponse.json({ success: true, documents })

  } catch (error: any) {
    console.error('Get documents error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    await uploadService.deleteDocument(documentId)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete document error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}