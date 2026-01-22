import { pgTable, text, serial, integer, boolean, timestamp, decimal, pgEnum, varchar, time, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["driver", "rider", "both"]);
export const rideStatusEnum = pgEnum("ride_status", ["open", "full", "completed", "cancelled"]);
export const lifecycleStatusEnum = pgEnum("lifecycle_status", ["scheduled", "pickup_window", "in_progress", "return_window", "completed", "cancelled"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "accepted", "declined"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  school: varchar("school", { length: 255 }).notNull().default("Colorado School of Mines"),
  phone: varchar("phone", { length: 50 }),
  bio: text("bio"),
  avatar: text("avatar"),
  role: roleEnum("role").notNull().default("rider"),
  vehicleMake: varchar("vehicle_make", { length: 100 }),
  vehicleModel: varchar("vehicle_model", { length: 100 }),
  vehicleColor: varchar("vehicle_color", { length: 50 }),
  vehicleYear: integer("vehicle_year"),
  licensePlate: varchar("license_plate", { length: 20 }),
  gearStorage: text("gear_storage"),
  passengerCapacity: integer("passenger_capacity"),
  gearCapacity: integer("gear_capacity"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0"),
  totalRides: integer("total_rides").default(0),
  yearInSchool: varchar("year_in_school", { length: 50 }),
  major: varchar("major", { length: 100 }),
  sportPreference: varchar("sport_preference", { length: 100 }),
  favoriteMusic: varchar("favorite_music", { length: 200 }),
  signupWaiverAcceptedAt: timestamp("signup_waiver_accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull().references(() => users.id),
  destination: varchar("destination", { length: 255 }).notNull(),
  departureDate: date("departure_date").notNull(),
  departureTime: time("departure_time").notNull(),
  departureLocation: varchar("departure_location", { length: 255 }).notNull(),
  returnDate: date("return_date").notNull(),
  returnTime: time("return_time").notNull(),
  seatsAvailable: integer("seats_available").notNull().default(4),
  seatsTotal: integer("seats_total").notNull().default(4),
  gearCapacity: integer("gear_capacity").notNull().default(2),
  costPerRider: decimal("cost_per_rider", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  status: rideStatusEnum("status").notNull().default("open"),
  lifecycleStatus: lifecycleStatusEnum("lifecycle_status").notNull().default("scheduled"),
  pickupConfirmedAt: timestamp("pickup_confirmed_at"),
  rideStartedAt: timestamp("ride_started_at"),
  rideEndedAt: timestamp("ride_ended_at"),
  returnStartedAt: timestamp("return_started_at"),
  returnEndedAt: timestamp("return_ended_at"),
  actualReturnTime: time("actual_return_time"),
  driverWaiverAcceptedAt: timestamp("driver_waiver_accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rideRequests = pgTable("ride_requests", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull().references(() => rides.id),
  riderId: integer("rider_id").notNull().references(() => users.id),
  message: text("message"),
  status: requestStatusEnum("status").notNull().default("pending"),
  confirmedPresent: boolean("confirmed_present").default(false),
  markedNoShow: boolean("marked_no_show").default(false),
  noShowAction: varchar("no_show_action", { length: 50 }),
  riderWaiverAcceptedAt: timestamp("rider_waiver_accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rideNotifications = pgTable("ride_notifications", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull().references(() => rides.id),
  userId: integer("user_id").notNull().references(() => users.id),
  notificationType: varchar("notification_type", { length: 50 }).notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull().references(() => rides.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  rides: many(rides),
  rideRequests: many(rideRequests),
  messages: many(messages),
}));

export const ridesRelations = relations(rides, ({ one, many }) => ({
  driver: one(users, { fields: [rides.driverId], references: [users.id] }),
  requests: many(rideRequests),
  notifications: many(rideNotifications),
  messages: many(messages),
}));

export const rideRequestsRelations = relations(rideRequests, ({ one }) => ({
  ride: one(rides, { fields: [rideRequests.rideId], references: [rides.id] }),
  rider: one(users, { fields: [rideRequests.riderId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  ride: one(rides, { fields: [messages.rideId], references: [rides.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRideSchema = createInsertSchema(rides).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRideRequestSchema = createInsertSchema(rideRequests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type RideRequest = typeof rideRequests.$inferSelect;
export type InsertRideRequest = z.infer<typeof insertRideRequestSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
