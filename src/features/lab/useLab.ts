import { useMemo } from 'react'
import { useDemo, usePeople } from '@/demo/store'
import { labQueue, labToday } from './model'

/** The lab queue for the current point in the demo episode. */
export function useLab() {
  const demo = useDemo()
  const { fullName, patient } = usePeople()
  const age = patient.ageApproximate ? `about ${patient.age}` : String(patient.age)
  const orders = useMemo(() => labQueue(demo.state, { fullName, age }), [demo.state, fullName, age])
  return { ...demo, today: labToday(demo.state), orders }
}
