/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios'
import Router from 'next/router'
import { showErrorToast } from '@/components/toast'

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
})

/* ===================== REQUEST ===================== */
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')

    // 🧠 If refresh is happening, wait
    if (isRefreshing && refreshPromise) {
      const newToken = await refreshPromise
      config.headers.Authorization = `Bearer ${newToken}`
      return config
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ===================== RESPONSE ===================== */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message
    const originalRequest = error.config

    // IF TOKEN EXPIRED
    if (
      status === 401 &&
      message === 'TokenExpiredError' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        refreshPromise = axios.get('http://localhost:5000/api/user/refresh', { withCredentials: true, })
          .then((res) => {
            const newToken = res.data.accessToken
            localStorage.setItem('token', newToken)
            return newToken
          })
          .catch((err) => {
            console.log("errorrrr:", err)
            // Logout if Refresh failed 
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            document.cookie = 'role=; path=/; max-age=0;'
            showErrorToast('Session expired. Please login again.')
            Router.push('/login')
            return Promise.reject(err)
          })
          .finally(() => {
            isRefreshing = false
          })
      }

      // Wait for refresh, retry request
      const newToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return axiosInstance(originalRequest)
    }

    // OTHER ERRORS
    if (status === 401) {
      showAllErrors(error)
      Router.push('/login')
    }
     if (status === 403) {
      Router.push('/login')
    }
    if (status === 400) {
      showAllErrors(error)
    }
    if (status === 500) {
      showErrorToast(getErrorMessage(error))
    }

    return Promise.reject(error)
  }
)


/**
 * Typed wrapper functions for API calls
 */
export async function GET<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await axiosInstance.get<T>(url, config)
  return res.data
}

export async function POST<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await axiosInstance.post<T>(url, data, config)
  return res.data
}

export async function PATCH<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await axiosInstance.patch<T>(url, data, config)
  return res.data
}

export async function DELETE<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await axiosInstance.delete<T>(url, {
    ...config,
    data,
  })
  return res.data
}

export function getErrorMessage(error: any): string {
  if (!error) return 'Unknown error'

  // Axios-style error
  const message =
    error.response?.data?.message ||
    error.response?.data?.error?.message ||
    error.response?.data?.error ||
    error.message ||
    error.toString()

  return message || 'Something went wrong!'
}

// Helper to show all validation errors from details array
export const showAllErrors = (error: any) => {
  const details = error.response?.data?.details
  if (Array.isArray(details) && details.length > 0) {
    details.forEach((d: any) => {
      if (d.message) showErrorToast(d.message)
    })
  } else {
    showErrorToast(getErrorMessage(error))
  }
}

export default axiosInstance
