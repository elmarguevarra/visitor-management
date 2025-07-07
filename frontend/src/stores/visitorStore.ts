import { defineStore } from 'pinia'
import { getVisitorsByResidentId } from '@/services/handlerServices'

export const useVisitorStore = defineStore('visitors', {
  state: () => ({
    visitors: [] as any[],
  }),
  actions: {
    // TODO: use this
    async fetchResidentVisitors(residentId: string): Promise<void> {
      this.visitors = await getVisitorsByResidentId(residentId)
    },
    addVisitor(request: any): void {
      this.visitors.push(request)
    },
    setVisitors(requests: any) {
      this.visitors = requests.sort(
        (a: any, b: any) =>
          new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
      )
    },
    removeVisitor(inviteToken: any) {
      this.visitors = this.visitors.filter((v) => v.inviteToken !== inviteToken)
    },
    filterUpcoming(): any {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayTimestamp = today.getTime()

      return this.visitors
        .filter((visitor) => {
          const visitDate = new Date(visitor.visitDate)
          visitDate.setHours(0, 0, 0, 0)
          const visitDateTimestamp = visitDate.getTime()

          return visitDateTimestamp > todayTimestamp
        })
        .sort(
          (a, b) =>
            new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
        )
    },
    filterPast(): any {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayTimestamp = today.getTime()

      return this.visitors
        .filter((visitor) => {
          const visitDate = new Date(visitor.visitDate)
          visitDate.setHours(0, 0, 0, 0)
          const visitDateTimestamp = visitDate.getTime()

          return visitDateTimestamp < todayTimestamp
        })
        .sort(
          (a, b) =>
            new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
        )
    },
    filterToday(): any {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayTimestamp = today.getTime()

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowTimestamp = tomorrow.getTime()

      return this.visitors
        .filter((visitor) => {
          const visitDate = new Date(visitor.visitDate)
          visitDate.setHours(0, 0, 0, 0)
          const visitDateTimestamp = visitDate.getTime()

          return (
            visitDateTimestamp >= todayTimestamp &&
            visitDateTimestamp < tomorrowTimestamp
          )
        })
        .sort(
          (a, b) =>
            new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
        )
    },
  },
})
