import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  /* display: grid; */
  /* grid-template-columns: repeat(8, 1fr); */
  & > h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`

const SectionContainer = styled.section`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 1rem;
  max-width: 12rem;
  align-items: center;
`

const Headshot = styled.img`
  float: right;
`
const Label = styled.label``

const Input = styled.input`
  padding: 0.2rem;
`
/**
 *
 * @param {{id: number}} param0
 */
function PersonDetails({ id }) {
  const firstName = 'John'
  const lastName = 'Doe'
  const spiritualName = 'Narayan'
  const phone = '+1-251-553-242'
  const email =
    'test@example.com askdfalkjfhadlkfhalksdjgalfdkjbsdflaskdfalkjfhadlkfhalksdjgalfdkjbsdflaskdfalkjfhadlkfhalksdjgalfdkjbsdfl '

  return (
    <Container>
      <h1>{`${firstName} ${lastName} ${spiritualName}`.trim()}</h1>
      <Headshot src="/images/97.jpg" alt="fake person" />
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
      <h2>Registrations</h2>
      <SvgComponent focusable={true} />
    </Container>
  )
}

export default PersonDetails

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

function SvgComponent(props) {
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
