import { ArrivingSoon } from './ArrivingSoon'
import { ArrivingToday } from './ArrivingToday'

function RegistrationsList({ filter }: { filter?: string }) {
  if (filter === 'arriving-today') return <ArrivingToday />
  else return <ArrivingSoon />
}

export default RegistrationsList
