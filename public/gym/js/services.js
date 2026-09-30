/**
 * Public data-access surface used by the pages.
 *
 * Pages import from here and never talk to fetch(), URLs or the API client
 * directly. Each service lives in js/api/ and speaks to the
 * Sistema-de-Academia REST backend (or the demo repository when demo mode is
 * enabled in Configurações).
 */

export { authService, ROLES, roleLabel } from "./api/authService.js";
export { userService, studentService, teacherService } from "./api/userService.js";
export { machineService } from "./api/machineService.js";
export { workoutService } from "./api/workoutService.js";
export { gymService } from "./api/gymService.js";
export { ApiError } from "./api/apiClient.js";
