import { defineStore } from 'pinia'
import { getVisitRequestsByResidentId } from '@/services/apiService'

export const useVisitRequestStore = defineStore('visitRequests', {
  state: () => ({
    visitRequests: [] as any[],
  }),
  actions: {
    async fetchVisitRequests(residentId: string): Promise<void> {
      this.visitRequests = await getVisitRequestsByResidentId(residentId)
    },
    addVisitRequest(request: any): void {
      this.visitRequests.push(request)
    },
    setVisitRequests(requests: any) {
      this.visitRequests = requests.sort(
        (a: any, b: any) =>
          new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
      )
    },
    removeVisitRequest(inviteToken: any) {
      this.visitRequests = this.visitRequests.filter(
        (v) => v.inviteToken !== inviteToken,
      )
    },
  },
})
