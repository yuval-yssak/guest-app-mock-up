import React from 'react'
import styled from 'styled-components'

const Explanation = styled.div`
  padding: 2rem;
  & p {
    transition: all 0.2s;
  }

  &:hover p {
    transform: rotateZ(180deg);
  }
`

export default function InfoCovid19GuidelinesPage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '2rem' }}>
        Stay at <pre>localhost</pre>
        <br />
        Wear a <pre>255.255.254.0</pre>
      </p>
      <Explanation>
        <p>(If you didn't get it, it's a computer joke...)</p>
      </Explanation>
    </div>
  )
}
