export interface Database {
  init(): Promise<void>
  exists(strategy: string, id: string): Promise<boolean>
  save(strategy: string, id: string, data: any): Promise<void>
}
