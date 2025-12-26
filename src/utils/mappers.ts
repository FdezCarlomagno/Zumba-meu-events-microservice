import type { Event } from "../types"

// Map database snake_case to camelCase
export const mapEventFromDb = (dbEvent: any): Event => {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    slug: dbEvent.slug,
    description: dbEvent.description,
    startDate: new Date(dbEvent.start_date),
    endDate: new Date(dbEvent.end_date),
    status: dbEvent.status,
    location: dbEvent.location,
    ctaText: dbEvent.cta_text,
    ctaUrl: dbEvent.cta_url,
    isFeatured: dbEvent.is_featured,
    createdAt: new Date(dbEvent.created_at),
    updatedAt: new Date(dbEvent.updated_at),
  }
}

// Map camelCase to database snake_case
export const mapEventToDb = (event: Partial<Event>) => {
  const dbEvent: any = {}

  if (event.title !== undefined) dbEvent.title = event.title
  if (event.slug !== undefined) dbEvent.slug = event.slug
  if (event.description !== undefined) dbEvent.description = event.description
  if (event.startDate !== undefined) dbEvent.start_date = event.startDate
  if (event.endDate !== undefined) dbEvent.end_date = event.endDate
  if (event.status !== undefined) dbEvent.status = event.status
  if (event.location !== undefined) dbEvent.location = event.location
  if (event.ctaText !== undefined) dbEvent.cta_text = event.ctaText
  if (event.ctaUrl !== undefined) dbEvent.cta_url = event.ctaUrl
  if (event.isFeatured !== undefined) dbEvent.is_featured = event.isFeatured

  return dbEvent
}
