export interface Job {
  id: string
  message: string
}

export type Strategy = () => Promise<Job[]>
