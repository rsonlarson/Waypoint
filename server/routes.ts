import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRideSchema, insertRideRequestSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/user", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser((req.user as any).id);
    res.json(user);
  });

  app.patch("/api/user", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.updateUser((req.user as any).id, req.body);
    res.json(user);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.get("/api/rides", async (req, res) => {
    const rides = await storage.getRides();
    res.json(rides);
  });

  app.get("/api/rides/:id", async (req, res) => {
    const ride = await storage.getRide(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.json(ride);
  });

  app.post("/api/rides", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const result = insertRideSchema.safeParse({ ...req.body, driverId: (req.user as any).id });
    if (!result.success) {
      return res.status(400).json({ message: "Invalid ride data", errors: result.error.errors });
    }
    const ride = await storage.createRide(result.data);
    res.status(201).json(ride);
  });

  app.patch("/api/rides/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const ride = await storage.getRide(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    if (ride.driverId !== (req.user as any).id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updated = await storage.updateRide(parseInt(req.params.id), req.body);
    res.json(updated);
  });

  app.delete("/api/rides/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const ride = await storage.getRide(parseInt(req.params.id));
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    if (ride.driverId !== (req.user as any).id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await storage.deleteRide(parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/rides/:id/requests", async (req, res) => {
    const requests = await storage.getRideRequests(parseInt(req.params.id));
    res.json(requests);
  });

  app.post("/api/rides/:id/requests", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const result = insertRideRequestSchema.safeParse({
      ...req.body,
      rideId: parseInt(req.params.id),
      riderId: (req.user as any).id,
    });
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.errors });
    }
    const request = await storage.createRideRequest(result.data);
    res.status(201).json(request);
  });

  app.patch("/api/ride-requests/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const updated = await storage.updateRideRequest(parseInt(req.params.id), req.body);
    res.json(updated);
  });

  app.get("/api/my-requests", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const requests = await storage.getRideRequestsByRider((req.user as any).id);
    res.json(requests);
  });

  app.get("/api/my-rides", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const rides = await storage.getRidesByDriver((req.user as any).id);
    res.json(rides);
  });

  app.get("/api/rides/:id/messages", async (req, res) => {
    const messages = await storage.getMessages(parseInt(req.params.id));
    res.json(messages);
  });

  app.post("/api/rides/:id/messages", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const result = insertMessageSchema.safeParse({
      ...req.body,
      rideId: parseInt(req.params.id),
      senderId: (req.user as any).id,
    });
    if (!result.success) {
      return res.status(400).json({ message: "Invalid message data", errors: result.error.errors });
    }
    const message = await storage.createMessage(result.data);
    res.status(201).json(message);
  });

  const httpServer = createServer(app);
  return httpServer;
}
