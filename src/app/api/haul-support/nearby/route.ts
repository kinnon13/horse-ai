import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getRouteSupportPoints, getNearbyHaulSupportPoints, addHaulSupportPoint, recordHaulSupportFeedback } from '@/lib/haulSupport'

/**
 * Haul Support API
 * 
 * This handles the "Where can I pull in a 40' LQ safely right now?" network.
 * This is the final piece that makes HorseGPT the safety layer for horse logistics.
 * 
 * GET /api/haul-support/nearby - Get nearby safe stops
 * POST /api/haul-support/route - Get route recommendations
 * POST /api/haul-support/feedback - Record location feedback
 */

/**
 * GET /api/haul-support/nearby
 * 
 * Get nearby haul support points by location
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseInt(searchParams.get('radius') || '25')
    const type = searchParams.get('type') || undefined

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat, lng' },
        { status: 400 }
      )
    }

    console.log(`🗺️ Finding haul support points near ${lat}, ${lng}`)

    const points = await getNearbyHaulSupportPoints(lat, lng, radius, type)

    return NextResponse.json({success: true,
      points,
      count: points.length
    }, { status: 200 })

  } catch (error) {
    console.error('❌ GET /api/haul-support/nearby error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/haul-support/route
 * 
 * Get haul support points along a route
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      origin_city,
      origin_state,
      dest_city,
      dest_state,
      rig_length
    } = body

    // Validate required fields
    if (!origin_city || !origin_state || !dest_city || !dest_state) {
      return NextResponse.json(
        { error: 'Missing required fields: origin_city, origin_state, dest_city, dest_state' },
        { status: 400 }
      )
    }

    console.log(`🗺️ Finding route support from ${origin_city}, ${origin_state} to ${dest_city}, ${dest_state}`)

    const routeSupport = await getRouteSupportPoints(
      origin_city,
      origin_state,
      dest_city,
      dest_state,
      rig_length
    )

    return NextResponse.json({success: true,
      route: {origin: `${origin_city}, ${origin_state}`,
        destination: `${dest_city}, ${dest_state}`,
        rig_length: rig_length || null
      },
      support_points: routeSupport,
      summary: {fuel_stops: routeSupport.fuel.length,
        overnight_stops: routeSupport.overnight.length,
        emergency_vets: routeSupport.emergency.length,
        hookup_locations: routeSupport.hookups.length,
        feed_stores: routeSupport.feed_stores.length
      }
    }, { status: 200 })

  } catch (error) {
    console.error('❌ POST /api/haul-support/route error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

