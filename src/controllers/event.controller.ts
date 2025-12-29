import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth.middleware"
import { EventService } from "../services/event.service"
import { createResponse } from "../utils/responses"

const eventService = new EventService()

export class EventController {
  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const events = await eventService.getAllPublic()
      createResponse(res, events, 200, "Events retrieved succesfully", false)
    } catch (error) {
      console.error("Get all events error:", error)
      createResponse(res, [], 500, "Failed to fetch events", true)
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const event = await eventService.getById(id, false)

      if (!event) {
        createResponse(res, null, 404, `Event with id ${id}`, true)
        return
      }

      createResponse(res, event, 200, "Event retrieved successfully", false)
    } catch (error) {
      console.error("Get event by ID error:", error)
      createResponse(res, null, 500, "Failed to fetch event", true)
    }
  }


 async create(req: AuthRequest, res: Response): Promise<void> {
  try {
    const eventData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    }

    const event = await eventService.create(eventData)
    createResponse(res, event, 201, "Event created successfully")
  } catch (error: any) {
    console.error("Create event error:", error)

    if (error.message.includes("already exists")) {
      createResponse(res, null, 409, error.message, true)
      return
    }

    createResponse(res, null, 500, "Failed to create event", true)
  }
}


  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const eventData = { ...req.body }

      if (req.body.startDate) {
        eventData.startDate = new Date(req.body.startDate)
      }
      if (req.body.endDate) {
        eventData.endDate = new Date(req.body.endDate)
      }

      const event = await eventService.update(id, eventData)

      if (!event) {
        createResponse(res, null, 404, `Event with id ${id}`, true)
        return
      }

      createResponse(res, event, 200, "Event updated succesfully")
    } catch (error: any) {
      console.error("Update event error:", error)
      if (error.message.includes("already exists")) {
        createResponse(res, error, 409, error.message, true)
        return
      }
      createResponse(res, null, 500, "Failed to update event", true)
    }
  }

  async updateDates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { startDate, endDate } = req.body

      const event = await eventService.updateDates(id, new Date(startDate), new Date(endDate))

      if (!event) {
        createResponse(res, null, 404, "Event not found", true)
        return
      }

      createResponse(res, event, 200, "Event dates updated succesfully", false)
    } catch (error) {
      console.error("Update event dates error:", error)
      createResponse(res, null, 500, "Failed to update event dates", true)
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await eventService.delete(id)
      createResponse(res, {message: "Event deleted succesfully"})
    } catch (error) {
      console.error("Delete event error:", error)
      createResponse(res, error, 500, "Failed to delete event", true)
    }
  }
}
