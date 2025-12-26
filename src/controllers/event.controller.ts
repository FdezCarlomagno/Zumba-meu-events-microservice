import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth.middleware"
import { EventService } from "../services/event.service"
import { successResponse, errorResponse } from "../utils/responses"

const eventService = new EventService()

export class EventController {
  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const events = await eventService.getAllPublic()
      successResponse(res, events)
    } catch (error) {
      console.error("Get all events error:", error)
      errorResponse(res, "Failed to fetch events", 500)
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const event = await eventService.getById(id, false)

      if (!event) {
        errorResponse(res, "Event not found", 404)
        return
      }

      successResponse(res, event)
    } catch (error) {
      console.error("Get event by ID error:", error)
      errorResponse(res, "Failed to fetch event", 500)
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
      successResponse(res, event, 201)
    } catch (error: any) {
      console.error("Create event error:", error)
      if (error.message.includes("already exists")) {
        errorResponse(res, error.message, 409)
        return
      }
      errorResponse(res, "Failed to create event", 500)
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
        errorResponse(res, "Event not found", 404)
        return
      }

      successResponse(res, event)
    } catch (error: any) {
      console.error("Update event error:", error)
      if (error.message.includes("already exists")) {
        errorResponse(res, error.message, 409)
        return
      }
      errorResponse(res, "Failed to update event", 500)
    }
  }

  async updateDates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { startDate, endDate } = req.body

      const event = await eventService.updateDates(id, new Date(startDate), new Date(endDate))

      if (!event) {
        errorResponse(res, "Event not found", 404)
        return
      }

      successResponse(res, event)
    } catch (error) {
      console.error("Update event dates error:", error)
      errorResponse(res, "Failed to update event dates", 500)
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await eventService.delete(id)
      successResponse(res, { message: "Event deleted successfully" })
    } catch (error) {
      console.error("Delete event error:", error)
      errorResponse(res, "Failed to delete event", 500)
    }
  }
}
