/**
 * Utility functions for error handling and formatting
 */

import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}

/**
 * Extract error message from Axios error
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Backend error with detail message
    if (error.response?.data instanceof Object && "detail" in error.response.data) {
      const detail = (error.response.data as { detail: string }).detail;
      return typeof detail === "string" ? detail : error.message;
    }

    // HTTP status error
    if (error.response?.status) {
      const status = error.response.status;
      const statusMessages: { [key: number]: string } = {
        400: "Bad request - check your input",
        401: "Unauthorized - please log in",
        403: "Forbidden - you don't have permission",
        404: "Resource not found",
        409: "Conflict - resource already exists",
        500: "Server error - please try again later",
        503: "Service unavailable",
      };
      return statusMessages[status] || `Error: ${status}`;
    }

    // Network error
    if (!error.response && error.request) {
      return "Network error - cannot reach server";
    }

    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Format API error to user-friendly message
 */
export const formatApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      message: getErrorMessage(error),
      status: error.response?.status,
      detail: error.response?.statusText,
    };
  }

  return {
    message: getErrorMessage(error),
  };
};
