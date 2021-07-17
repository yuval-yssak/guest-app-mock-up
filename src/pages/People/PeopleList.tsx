import { ArrivingSoon } from './ArrivingSoon'
import { ArrivingToday } from './ArrivingToday'

function PeopleList({ filter }: { filter?: string }) {
  if (filter === 'arriving-today') return <ArrivingToday />
  else return <ArrivingSoon />
}

export default PeopleList
