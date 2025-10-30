import { NextRequest, NextResponse } from 'next/server'
import { UserMemoryService } from './UserMemoryService'

const userMemoryService = new UserMemoryService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const userMemory = await userMemoryService.getUserMemory(userId)
    return NextResponse.json({ userMemory })

  } catch (error: any) {
    console.error('Error fetching user memory:', error)
    return NextResponse.json({ error: 'Failed to fetch user memory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'create':
        const userMemory = await userMemoryService.createUserMemory(data)
        return NextResponse.json({ success: true, userMemory }, { status: 201 })

      case 'add_item':
        const updatedMemory = await userMemoryService.addMemoryItem(data.user_id, data.item)
        return NextResponse.json({ success: true, userMemory: updatedMemory })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Error creating/updating user memory:', error)
    return NextResponse.json({ error: 'Failed to create/update user memory' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user_id, ...updates } = await request.json()

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const userMemory = await userMemoryService.updateUserMemory(user_id, updates)
    return NextResponse.json({ success: true, userMemory })

  } catch (error: any) {
    console.error('Error updating user memory:', error)
    return NextResponse.json({ error: 'Failed to update user memory' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const itemId = searchParams.get('item_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (itemId) {
      const userMemory = await userMemoryService.removeMemoryItem(userId, itemId)
      return NextResponse.json({ success: true, userMemory })
    } else {
      await userMemoryService.deleteUserMemory(userId)
      return NextResponse.json({ success: true })
    }

  } catch (error: any) {
    console.error('Error deleting user memory:', error)
    return NextResponse.json({ error: 'Failed to delete user memory' }, { status: 500 })
  }
}