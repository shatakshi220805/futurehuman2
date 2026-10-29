export type PlanKey = "BASIC" | "PLUS" | "POWER" | "PRO" | "ENTERPRISE";

export const PLAN_LIMITS: Record<
  PlanKey,
  {
    meetingNotes: number | null;
    routines: number | null;
    mcp: boolean;
    monthlyCredits: number;
    maxModeDaily: number | null;
    lighterModeOnExhaust: boolean;
  }
> = {
  BASIC: {
    meetingNotes: 25,
    routines: 5,
    mcp: false,
    monthlyCredits: 0,
    maxModeDaily: 2,
    lighterModeOnExhaust: false,
  },
  PLUS: {
    meetingNotes: null,
    routines: 100,
    mcp: true,
    monthlyCredits: 1000,
    maxModeDaily: null,
    lighterModeOnExhaust: true,
  },
  POWER: {
    meetingNotes: null,
    routines: 100,
    mcp: true,
    monthlyCredits: 2000,
    maxModeDaily: null,
    lighterModeOnExhaust: true,
  },
  PRO: {
    meetingNotes: null,
    routines: 100,
    mcp: true,
    monthlyCredits: 5000,
    maxModeDaily: null,
    lighterModeOnExhaust: true,
  },
  ENTERPRISE: {
    meetingNotes: null,
    routines: null,
    mcp: true,
    monthlyCredits: 12000,
    maxModeDaily: null,
    lighterModeOnExhaust: true,
  },
};
