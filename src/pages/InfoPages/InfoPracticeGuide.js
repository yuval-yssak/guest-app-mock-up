import React from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const Article = styled.article`
  display: grid;
  grid-template-columns: min(60rem, 80%);
  justify-content: center;
  height: 100%;
  overflow: scroll;
  grid-row-gap: 2rem;

  & h1 {
    font-size: 3rem;
    margin-top: 1.5rem;
  }

  & h2 {
    font-size: 2rem;
    margin-top: 1.5rem;
  }

  & p {
    font-size: 1rem;
  }
`

const Img = styled.img`
  width: 100%;
    height: 364px;
    object-fit: cover;
    object-position: bottom;
    margin-top: 10px;
    transform: rotate(1.4deg);
}
`

export default function InfoPracticeGuide() {
  return (
    <>
      <Article>
        <section>
          <Typography variant="h1">The Five Points of Yoga</Typography>
          <Typography variant="h1">Techniques of Meditation</Typography>
          <Typography variant="body1">
            <ol>
              <li>
                Regularity of time, place and practice are most important.
                Regularity conditions the mind to slow down its activities with
                a minimum of delay
              </li>
              <li>
                The most effective times are ealy dawn and dusk, when the
                atmosphere is charged with special spiritual force. If it is not
                feasible to sit for meditation at these times, choose an hour
                when you are not involved with daily activities, and a time when
                the mind is apt to be calm.
              </li>
              <li>...</li>
            </ol>
          </Typography>
          <Typography variant="h1">Breathing Techniques</Typography>
          <Typography variant="h1">
            The Sun Salutation <em>sūrya namaskāra</em>
          </Typography>
          <Typography variant="h1">The Twelve Basic Asanas</Typography>
          <Img src="/images/rama 12.jpg" alt="12 main Asanas" />
        </section>
        <section>
          <Typography variant="h1">Chants</Typography>
          <Typography variant="h2">
            <em>dhyāna ślokaḥ</em>
          </Typography>
          <Typography variant="h2">
            <em>mahāmṛtyuñjaya mantra</em>
          </Typography>
          <Typography variant="h2">
            Universal Prayer by Swami Sivananda
          </Typography>
        </section>
      </Article>
    </>
  )
}
