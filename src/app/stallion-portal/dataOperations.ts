// Stallion Portal Data Operations - Single responsibility
export async function createStallion(stallionData: any) {
  try {

    return { id: 'stallion_' + Date.now(), ...stallionData }
  } catch (error) {
    console.error('Error creating stallion:', error)
    throw error
  }
}

export async function updateStallion(stallionId: string, updates: any) {
  try {

    return { id: stallionId, ...updates }
  } catch (error) {
    console.error('Error updating stallion:', error)
    throw error
  }
}

export async function deleteStallion(stallionId: string) {
  try {

    return { success: true }
  } catch (error) {
    console.error('Error deleting stallion:', error)
    throw error
  }
}

export async function saveStallion(stallionData: any) {
  try {

    return { id: 'stallion_' + Date.now(), ...stallionData }
  } catch (error) {
    console.error('Error saving stallion:', error)
    throw error
  }
}