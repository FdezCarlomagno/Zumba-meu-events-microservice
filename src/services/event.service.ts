import { supabase } from "../config/database"
import type { Event } from "../types"
import { mapEventFromDb, mapEventToDb } from "../utils/mappers"

export class EventService {
  async getAllPublic(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .neq("status", "draft")
      .order("start_date", { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`)
    }

    return data.map(mapEventFromDb)
  }

  async getById(id: string, includePrivate = false): Promise<Event | null> {
    let query = supabase.from("events").select("*").eq("id", id)

    if (!includePrivate) {
      query = query.neq("status", "draft")
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to fetch event: ${error.message}`)
    }

    return mapEventFromDb(data)
  }

  async create(eventData: Partial<Event>): Promise<Event> {
    const dbEvent = mapEventToDb(eventData)

    const { data, error } = await supabase.from("events").insert(dbEvent).select().single()

    if (error) {
      if (error.code === "23505") {
        throw new Error("Event with this slug already exists")
      }
      throw new Error(`Failed to create event: ${error.message}`)
    }

    return mapEventFromDb(data)
  }

  async update(id: string, eventData: Partial<Event>): Promise<Event | null> {
    const dbEvent = mapEventToDb(eventData)

    const { data, error } = await supabase.from("events").update(dbEvent).eq("id", id).select().single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      if (error.code === "23505") {
        throw new Error("Event with this slug already exists")
      }
      throw new Error(`Failed to update event: ${error.message}`)
    }

    return mapEventFromDb(data)
  }

  async updateDates(id: string, startDate: Date, endDate: Date): Promise<Event | null> {
    const { data, error } = await supabase
      .from("events")
      .update({ start_date: startDate, end_date: endDate })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Failed to update event dates: ${error.message}`)
    }

    return mapEventFromDb(data)
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`)
    }

    return true
  }
}
