import { users, rides, rideRequests, messages, rideNotifications } from "@shared/schema";
import type { User, InsertUser, Ride, InsertRide, RideRequest, InsertRideRequest, Message, InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  getRides(): Promise<Ride[]>;
  getRide(id: number): Promise<Ride | undefined>;
  getRidesByDriver(driverId: number): Promise<Ride[]>;
  createRide(ride: InsertRide): Promise<Ride>;
  updateRide(id: number, updates: Partial<InsertRide>): Promise<Ride | undefined>;
  deleteRide(id: number): Promise<void>;
  
  getRideRequests(rideId: number): Promise<RideRequest[]>;
  getRideRequestsByRider(riderId: number): Promise<RideRequest[]>;
  createRideRequest(request: InsertRideRequest): Promise<RideRequest>;
  updateRideRequest(id: number, updates: Partial<InsertRideRequest>): Promise<RideRequest | undefined>;
  
  getMessages(rideId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getRides(): Promise<Ride[]> {
    return db.select().from(rides).orderBy(desc(rides.createdAt));
  }

  async getRide(id: number): Promise<Ride | undefined> {
    const [ride] = await db.select().from(rides).where(eq(rides.id, id));
    return ride || undefined;
  }

  async getRidesByDriver(driverId: number): Promise<Ride[]> {
    return db.select().from(rides).where(eq(rides.driverId, driverId)).orderBy(desc(rides.createdAt));
  }

  async createRide(ride: InsertRide): Promise<Ride> {
    const [newRide] = await db.insert(rides).values(ride).returning();
    return newRide;
  }

  async updateRide(id: number, updates: Partial<InsertRide>): Promise<Ride | undefined> {
    const [ride] = await db.update(rides).set({ ...updates, updatedAt: new Date() }).where(eq(rides.id, id)).returning();
    return ride || undefined;
  }

  async deleteRide(id: number): Promise<void> {
    await db.delete(rides).where(eq(rides.id, id));
  }

  async getRideRequests(rideId: number): Promise<RideRequest[]> {
    return db.select().from(rideRequests).where(eq(rideRequests.rideId, rideId));
  }

  async getRideRequestsByRider(riderId: number): Promise<RideRequest[]> {
    return db.select().from(rideRequests).where(eq(rideRequests.riderId, riderId));
  }

  async createRideRequest(request: InsertRideRequest): Promise<RideRequest> {
    const [newRequest] = await db.insert(rideRequests).values(request).returning();
    return newRequest;
  }

  async updateRideRequest(id: number, updates: Partial<InsertRideRequest>): Promise<RideRequest | undefined> {
    const [request] = await db.update(rideRequests).set({ ...updates, updatedAt: new Date() }).where(eq(rideRequests.id, id)).returning();
    return request || undefined;
  }

  async getMessages(rideId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.rideId, rideId)).orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
