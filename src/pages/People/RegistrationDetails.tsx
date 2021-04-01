import React from 'react'
import dayjs from 'dayjs'
import { DatePicker } from '@material-ui/pickers'
import Typography from '@material-ui/core/Typography'
import WarningIcon from '@material-ui/icons/Warning'
import styled from 'styled-components'
import { XGrid } from '@material-ui/x-grid'
import { DateType } from '@date-io/type'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const StyledXGrid = styled(XGrid)`
  && {
    height: 250px;
  }
  width: '100%';
  grid-column: 1/-1;
  background-color: rgba(255, 255, 255, 0.88);
  & > .MuiDataGrid-main > div:first-child {
    display: none;
  }
`

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem calc((100% - 50rem) / 2);
  overflow: scroll;
  & > h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  font-family: Arial, Helvetica, sans-serif;
`

const SectionContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  max-width: 50rem;
  align-items: center;
`

const Headshot = styled.img`
  float: right;
`
const Label = styled.label``

const Input = styled.input`
  padding: 0.2rem;
`

const StyledWarning = styled(Typography)`
  && {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.palette.grey['900']};
    grid-column: 1/-1;
  }

  & > :first-child {
    color: ${({ theme }) => theme.palette.primary.main};
    margin-right: 0.3rem;
  }
`

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <StyledWarning>
      <WarningIcon />
      <Typography variant="body2">{children}</Typography>
    </StyledWarning>
  )
}

/**
 *
 * @param {{id: number}} param0
 */
function RegistrationDetails({ id }: { id: number }) {
  const firstName = 'John'
  const lastName = 'Doe'
  const spiritualName = 'Narayan'
  const phone = '+1-251-553-242'
  const email =
    'test@example.com askdfalkjfhadlkfhalksdjgalfdkjbsdflaskdfalkjfhadlkfhalksdjgalfdkjbsdflaskdfalkjfhadlkfhalksdjgalfdkjbsdfl '

  const [arrivalDate, setArrivalDate] = React.useState(dayjs('2021-01-02'))
  const [departureDate, setDepartureDate] = React.useState(dayjs('2021-01-22'))
  return (
    <Container>
      <h1>{`${firstName} ${lastName} ${spiritualName}`.trim()}</h1>
      <Headshot src="/images/97.jpg" alt="fake person" />
      <h2>Warnings</h2>

      <SectionContainer>
        <Warning>Registration is not matched to a person.</Warning>
        <Warning>There is a cost discrepancy.</Warning>
        <Warning>There is a balance due.</Warning>
      </SectionContainer>
      <h2>Registration Main Details</h2>
      <SectionContainer>
        <h3
          style={{ gridColumn: '1/-1' }}
        >{`${firstName} ${lastName} ${spiritualName}`}</h3>
        <DatePicker
          value={arrivalDate}
          onChange={(date: DateType | null) => setArrivalDate(date!)}
          autoOk
          format="MMM D, YYYY - ddd"
          label="Arrival Date"
        />

        <DatePicker
          value={departureDate}
          onChange={(date: DateType | null) => setDepartureDate(date!)}
          autoOk
          format="MMM D, YYYY - ddd"
          label="Departure Date"
        />
        <Label style={{ gridColumn: '1/-1' }}>
          Registered to: <Typography>Yoga Vacation Program</Typography>
        </Label>
        <Label style={{ gridColumn: '1/-1' }}>
          First registered on:{' '}
          <Typography>
            {dayjs('2020-09-11').format('MMM D, YYYY - ddd')}
          </Typography>
        </Label>
        <Label>
          Room: <Typography>23a</Typography>
        </Label>
        <Label>
          Lodging Capacity:{' '}
          <Typography>Bayside Room with Bathroom (Shared)</Typography>
        </Label>
      </SectionContainer>
      <SectionContainer>
        <h2>Group Details</h2>
        <StyledXGrid
          rows={[
            {
              id: 1,
              name: 'Georgia',
              room: '23a',
              dates: 'Jan 2-21, 2021',
              program: 'Vacation'
            },
            {
              id: 2,
              name: 'John Doe Narayan',
              room: '23a',
              dates: 'Jan 2-21, 2021',
              program: 'Vacation'
            }
          ]}
          columns={[
            { field: 'name', headerName: 'Name', width: 150 },
            { field: 'program', headerName: 'Program', width: 150 },
            { field: 'room', headerName: 'Room', width: 150 },
            { field: 'dates', headerName: 'Dates', width: 150 }
          ]}
        />
      </SectionContainer>
      <SectionContainer>
        <h2>Transactions and Payments</h2>
        <h4 style={{ gridColumn: '1/-1' }}>Cost Calculation:</h4>
        <p>
          Lodging: $1,500
          <br />
        </p>
        <h4 style={{ gridColumn: '1/-1' }}>Items:</h4>
        <StyledXGrid
          hideFooter
          rows={[
            {
              id: 1,
              description: '20 Nights, Bayside Room with Bath (Shared)',
              category: 'Lodging',
              date: '2020-09-11',
              tax: '12%',
              amount: formatter.format(1500)
            }
          ]}
          columns={[
            { field: 'description', headerName: 'Description', width: 150 },
            { field: 'category', headerName: 'Category', width: 150 },
            { field: 'date', headerName: 'Date', width: 150 },
            { field: 'tax', headerName: 'Tax', width: 150 },
            { field: 'amount', headerName: 'Amount', width: 150 }
          ]}
        />
        <p style={{ gridColumn: '1/-1', textAlign: 'right' }}>
          Sub Total: {formatter.format(1500)}
        </p>
        <p style={{ gridColumn: '1/-1', textAlign: 'right' }}>
          Total 12% Tax: {formatter.format(1500 * 0.12)}
        </p>
        <p style={{ gridColumn: '1/-1', textAlign: 'right' }}>
          Invoice Total: {formatter.format(1500 * 1.12)}
        </p>
        <h4>Payments:</h4>
        <StyledXGrid
          hideFooter
          rows={[
            {
              id: 1,
              description: 'Credit Card (zvkhy32j)',
              category: 'Card Payment',
              card: '****1124',
              date: '2020-09-11',
              amount: formatter.format(1500 * 1.12)
            }
          ]}
          columns={[
            { field: 'description', headerName: 'Description', width: 220 },
            { field: 'category', headerName: 'Category', width: 150 },
            { field: 'card', headerName: 'Card Last Digits', width: 150 },
            { field: 'date', headerName: 'Date', width: 150 },
            { field: 'amount', headerName: 'Amount', width: 150 }
          ]}
        />
        <p style={{ gridColumn: '1/-1', textAlign: 'right' }}>
          Total payments: {formatter.format(1500 * 1.12)}
        </p>
        <Typography
          style={{ gridColumn: '1/-1', textAlign: 'right' }}
          variant="h5"
          component="p"
        >
          Balance Due: $0
        </Typography>
      </SectionContainer>
      <h2>Contact Information</h2>
      <SectionContainer>
        <Label htmlFor="firstName">First name:</Label>
        <Input value={firstName} id="firstName" disabled></Input>
        <Label htmlFor="lastName">Last name:</Label>
        <Input value={lastName} id="lastName" disabled></Input>
        <Label htmlFor="spiritualName">Spiritual name:</Label>
        <Input value={spiritualName} id="spiritualName" disabled></Input>
        <Label htmlFor="phone">Phone number:</Label>
        <Input value={phone} id="phone" disabled></Input>
        <Label htmlFor="email">Email:</Label>
        <Input value={email} id="email" disabled></Input>
      </SectionContainer>
      <h2>Registration Main Details</h2>

      <SectionContainer></SectionContainer>
      <h2>Registrations</h2>
      <SvgComponent />
    </Container>
  )
}

export default RegistrationDetails

const Svg = styled.svg`
  /* background-color: grey; */
  width: 100%;
  height: 200px;
`

const StyledG = styled.g`
  & > polyline {
    stroke: palevioletred;
  }

  & > text {
    fill: darkgreen;
  }

  & tspan.data {
    fill: white;
  }
`
const Registration = styled.g`
  font-family: Arial, Helvetica, sans-serif;

  & text {
    font-size: 0.55rem;
  }
  & tspan.data {
    fill: white;
  }

  transition: all 0.15s ease;
  filter: drop-shadow(0 0.1rem 0.3rem rgba(0, 0, 0, 0.3));

  &:hover {
    transform: translateY(-0.08rem);
    filter: drop-shadow(0 0.2rem 0.2rem rgba(0, 0, 0, 0.4));
  }
  &:active {
    transform: translateY(0.08rem);
    filter: drop-shadow(0 0 0);
  }
`

function SvgComponent() {
  return (
    <Svg width="800" height="200" viewBox="0 0 800 200">
      <StyledG id="timeline">
        <polyline
          points={new Array(9)
            .fill(0)
            .map(
              (_, i) =>
                `${70 * i + 50},20 ${70 * i + 50},30 ${70 * (i + 1) + 50},30 ${
                  70 * (i + 1) + 50
                },20`
            )
            .join(' ')}
          fill="transparent"
          stroke-width="2"
        />
        {new Array(10).fill(0).map((_, i) => (
          <text
            x={38 + 70 * i}
            y="2"
            font-size="10"
            transform={`rotate(90 ${38 + 70 * i},2)`}
          >
            {2013 + i}
          </text>
        ))}
      </StyledG>
      <Registration>
        <a href={window.location.href}>
          <rect
            width="135"
            height="55"
            x="50"
            y="35"
            rx="6"
            ry="6"
            fill="#f29500"
          />
          <text x="60" y="48">
            Program:
            <tspan className="data" x="102">
              Vacation
            </tspan>
          </text>
          <text x="60" y="60">
            Arrival:
            <tspan className="data" x="102">
              June 8, 2013
            </tspan>
          </text>
          <text x="60" y="72">
            Room:
            <tspan className="data" x="102">
              Saraswati 5
            </tspan>
          </text>
          <text x="60" y="84">
            Nights:
            <tspan className="data" x="102">
              9
            </tspan>
          </text>
        </a>
      </Registration>
      <Registration>
        <a href={window.location.href}>
          <rect
            width="135"
            height="55"
            x="370"
            y="35"
            rx="6"
            ry="6"
            fill="#f29500"
          />
          <text x="380" y="48">
            Program:
            <tspan className="data" x="422">
              Vacation
            </tspan>
          </text>
          <text x="380" y="60">
            Arrival:
            <tspan className="data" x="422">
              Jan 4, 2018
            </tspan>
          </text>
          <text x="380" y="72">
            Room:
            <tspan className="data" x="422">
              Tent Hut West 23
            </tspan>
          </text>
          <text x="380" y="84">
            Nights:
            <tspan className="data" x="422">
              1
            </tspan>
          </text>
        </a>
      </Registration>
      <Registration>
        <a href={window.location.href}>
          <rect
            width="135"
            height="55"
            x="400"
            y="90"
            rx="6"
            ry="6"
            fill="#f29500"
          />
          <text x="410" y="103">
            Program:
            <tspan className="data" x="452">
              Vacation
            </tspan>
          </text>
          <text x="410" y="115">
            Arrival:
            <tspan className="data" x="452">
              Jan 5, 2018
            </tspan>
          </text>
          <text x="410" y="127">
            Room:
            <tspan className="data" x="452">
              9
            </tspan>
          </text>
          <text x="410" y="139">
            Nights:
            <tspan className="data" x="452">
              5
            </tspan>
          </text>
        </a>
      </Registration>
      <Registration>
        <a href={window.location.href}>
          <rect
            width="135"
            height="34"
            x="420"
            y="145"
            rx="6"
            ry="6"
            fill="#45b"
          />
          <text x="430" y="158">
            Program:
            <tspan className="data" x="472">
              Yoga 1 course
            </tspan>
          </text>
          <text x="430" y="170">
            Start:
            <tspan className="data" x="472">
              Jan 8, 2018
            </tspan>
          </text>
        </a>
      </Registration>
    </Svg>
  )
}
