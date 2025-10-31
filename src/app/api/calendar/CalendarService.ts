// TEMP STUB
export function getCalendarEvents(filters?: any) { return []; }
export function createCalendarEvent(data?: any) { return { id: 'event_123', ...data }; }
export function updateCalendarEvent(id: string, data?: any) { return { id, ...data }; }
export function deleteCalendarEvent(id: string) { return { success: true }; }