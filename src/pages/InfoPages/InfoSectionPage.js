import React from 'react'
import PageContentWrapper from '../../components/PageContentWrapper'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import InfoWhatToBringPage from './InfoWhatToBringPage'
import InfoArrivingAtTheAirport from './InfoArrivingAtTheAirport'
import styled from 'styled-components'
import { useMst } from '../../models/reactHook'

const StyledPageContentWrapper = styled(PageContentWrapper).attrs({
  clasName: 'info-section-container'
})`
  && {
    overflow: scroll;
    grid-template-columns: repeat(auto-fit, minmax(min-content, 25rem));
    justify-content: center;
    grid-gap: 2rem;
    grid-template-rows: unset;
    align-content: safe center;
    align-items: stretch;
    padding: 2rem;
    width: 83rem;

    @media (max-width: 83em) {
      width: 90%;
    }

    @media (max-width: 55em) {
      padding: 1rem;
    }

    @media (max-width: 28em) {
      width: 100%;
    }
  }
`

const StyledCard = styled(Card)`
  && {
    overflow: visible;
  }
`

const StyledCardMedia = styled(CardMedia)`
  && {
    width: 100%;
    height: 148px;
    background-position: cover;
  }
`

function MediaCard({ topic, description, action, children }) {
  return (
    <StyledCard>
      <CardActionArea onClick={action}>
        {children}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {topic}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={action}>
          Learn More
        </Button>
      </CardActions>
    </StyledCard>
  )
}

export default function InfoSetingsPage({ page }) {
  const store = useMst()

  if (page === 'what-to-bring') return <InfoWhatToBringPage />
  if (page === 'arriving-at-the-airport') return <InfoArrivingAtTheAirport />

  return (
    <StyledPageContentWrapper>
      <MediaCard
        topic="What to bring?"
        description="Nam molestias, officia eaque illum architecto delectus itaque
            voluptate, ab cupiditate ipsam laudantium reprehenderit vel quis?
            Sapiente, nihil pariatur! Ipsum sint commodi tempora quos natus
            consequatur eaque qui facilis quae.
          "
        action={() => store.view.openInfoSectionPage('what-to-bring')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/C2AdaptiveYoga-1024x579.jpg"
          title="Shambhu on the beach meditation"
        />
      </MediaCard>
      <MediaCard
        topic="Arriving at the airport"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
        action={() => store.view.openInfoSectionPage('arriving-at-the-airport')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Arriving at the airport"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
        action={() => store.view.openInfoSectionPage('arriving-at-the-airport')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Arriving at the airport"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
        action={() => store.view.openInfoSectionPage('arriving-at-the-airport')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Arriving at the airport"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
        action={() => store.view.openInfoSectionPage('arriving-at-the-airport')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Arriving at the airport"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
        action={() => store.view.openInfoSectionPage('arriving-at-the-airport')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
    </StyledPageContentWrapper>
  )
}
