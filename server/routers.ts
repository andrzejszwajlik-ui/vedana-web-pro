import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import * as db from "./db";

// ============ VALIDATORS ============

const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  specialization: z.enum(["receptionist", "doctor", "physiotherapist", "osteopath", "other"]),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

const workingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(), // HH:MM:SS
  endTime: z.string(),
  isWorkingDay: z.boolean().optional(),
  breakStartTime: z.string().optional(),
  breakEndTime: z.string().optional(),
});

const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

const appointmentSchema = z.object({
  patientId: z.number(),
  staffId: z.number(),
  appointmentTypeId: z.number().optional(),
  startTime: z.date(),
  endTime: z.date(),
  durationMinutes: z.number().min(15),
  notes: z.string().optional(),
});

const appointmentUpdateSchema = z.object({
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  durationMinutes: z.number().min(15).optional(),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled", "no-show", "rescheduled"]).optional(),
  cancellationReason: z.string().optional(),
});

// ============ STAFF ROUTER ============

const staffRouter = router({
  list: protectedProcedure.query(async () => {
    return db.getAllStaff();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const staff = await db.getStaffById(input.id);
      if (!staff) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Staff not found" });
      }
      return staff;
    }),

  create: protectedProcedure
    .input(staffSchema)
    .mutation(async ({ input, ctx }) => {
      // Only admins can create staff
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create staff" });
      }

      await db.createStaff({
        ...input,
        isActive: true,
        color: input.color || "#5A67D8",
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: staffSchema.partial() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update staff" });
      }

      await db.updateStaff(input.id, input.data);
      return { success: true };
    }),

  getWorkingHours: protectedProcedure
    .input(z.object({ staffId: z.number() }))
    .query(async ({ input }) => {
      return db.getWorkingHoursByStaffId(input.staffId);
    }),

  updateWorkingHours: protectedProcedure
    .input(z.object({ id: z.number(), data: workingHoursSchema.partial() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.updateWorkingHours(input.id, input.data);
      return { success: true };
    }),
});

// ============ PATIENT ROUTER ============

const patientRouter = router({
  list: protectedProcedure.query(async () => {
    return db.getAllPatients();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const patient = await db.getPatientById(input.id);
      if (!patient) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return patient;
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      return db.getPatientByEmail(input.email);
    }),

  create: publicProcedure
    .input(patientSchema)
    .mutation(async ({ input }) => {
      // Check if patient already exists
      const existing = await db.getPatientByEmail(input.email);
      if (existing) {
        return { success: true, id: existing.id, isNew: false };
      }

      const result = await db.createPatient({
        ...input,
        isActive: true,
      });

      return { success: true, isNew: true };
    }),

  getAppointmentHistory: protectedProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input }) => {
      return db.getAppointmentsByPatientId(input.patientId);
    }),
});

// ============ APPOINTMENT ROUTER ============

const appointmentRouter = router({
  getByStaffAndDateRange: protectedProcedure
    .input(z.object({ 
      staffId: z.number(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ input }) => {
      return db.getAppointmentsByStaffAndDateRange(input.staffId, input.startDate, input.endDate);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const appointment = await db.getAppointmentById(input.id);
      if (!appointment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return appointment;
    }),

  create: protectedProcedure
    .input(appointmentSchema)
    .mutation(async ({ input, ctx }) => {
      // Validate time range
      if (input.startTime >= input.endTime) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Start time must be before end time" });
      }

      // Check for conflicts
      const conflicts = await db.checkConflictingAppointments(
        input.staffId,
        input.startTime,
        input.endTime
      );

      if (conflicts.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Time slot is already booked" });
      }

      await db.createAppointment({
        ...input,
        status: "scheduled",
        confirmationSent: false,
        reminderSent: false,
      });

      // Trigger notification
      const patient = await db.getPatientById(input.patientId);
      if (patient) {
        await db.createNotification({
          appointmentId: input.patientId,
          patientId: input.patientId,
          type: "confirmation",
          channel: "email",
          status: "pending",
        });
      }

      return { success: true };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: appointmentUpdateSchema }))
    .mutation(async ({ input }) => {
      const appointment = await db.getAppointmentById(input.id);
      if (!appointment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // If rescheduling, check for conflicts
      if (input.data.startTime && input.data.endTime) {
        const conflicts = await db.checkConflictingAppointments(
          appointment.staffId,
          input.data.startTime,
          input.data.endTime,
          input.id
        );

        if (conflicts.length > 0) {
          throw new TRPCError({ code: "CONFLICT", message: "Time slot is already booked" });
        }
      }

      await db.updateAppointment(input.id, input.data);

      // Trigger notification if rescheduled
      if (input.data.startTime) {
        await db.createNotification({
          appointmentId: input.id,
          patientId: appointment.patientId,
          type: "reschedule",
          channel: "email",
          status: "pending",
        });
      }

      return { success: true };
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.number(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      const appointment = await db.getAppointmentById(input.id);
      if (!appointment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.updateAppointment(input.id, {
        status: "cancelled",
        cancellationReason: input.reason,
      });

      // Trigger cancellation notification
      await db.createNotification({
        appointmentId: input.id,
        patientId: appointment.patientId,
        type: "cancellation",
        channel: "email",
        status: "pending",
      });

      return { success: true };
    }),
});

// ============ SCHEDULER CONFIG ROUTER ============

const configRouter = router({
  get: publicProcedure.query(async () => {
    const config = await db.getSchedulerConfig();
    return config || {
      defaultSlotDurationMinutes: 30,
      slotIntervalMinutes: 15,
      reminderHoursBefore: 24,
      maxAdvanceBookingDays: 90,
      minAdvanceBookingMinutes: 60,
      enableOnlineBooking: true,
      enableNotifications: true,
    };
  }),

  update: protectedProcedure
    .input(z.object({
      defaultSlotDurationMinutes: z.number().optional(),
      slotIntervalMinutes: z.number().optional(),
      reminderHoursBefore: z.number().optional(),
      maxAdvanceBookingDays: z.number().optional(),
      minAdvanceBookingMinutes: z.number().optional(),
      enableOnlineBooking: z.boolean().optional(),
      enableNotifications: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.updateSchedulerConfig(input);
      return { success: true };
    }),
});

// ============ MAIN ROUTER ============

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  staff: staffRouter,
  patient: patientRouter,
  appointment: appointmentRouter,
  config: configRouter,
});

export type AppRouter = typeof appRouter;
