import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      status: 'PENDING' | 'APPROVED' | 'DENIED'
    } & DefaultSession['user']
  }

  interface User {
    status: 'PENDING' | 'APPROVED' | 'DENIED'
  }
}
