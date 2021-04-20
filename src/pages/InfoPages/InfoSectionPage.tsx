import React, { ReactEventHandler } from 'react'
import PageContentWrapper from '../../components/PageContentWrapper'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import InfoCovid19GuidelinesPage from './InfoCovid19GuidelinesPage'
import InfoArrivingAtTheAirport from './InfoArrivingAtTheAirport'
import InfoPracticeGuide from './InfoPracticeGuide'
import styled from 'styled-components'
import { useMst } from '../../models/reactHook'
import { observer } from 'mobx-react-lite'

const minTeaserWidth = '21.25rem'
const maxTeasersInRow = 3
const gridGap = '2rem'

const StyledPageContentWrapper = styled(PageContentWrapper).attrs({
  className: 'info-section-container'
})`
  && {
    overflow-y: scroll;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min-content, ${minTeaserWidth})
    );
    justify-content: center;
    grid-gap: ${gridGap};
    grid-template-rows: unset;
    align-content: safe center;
    align-items: stretch;
    padding: 2rem
      calc(
        (
            100% -
              calc(
                ${minTeaserWidth} * ${maxTeasersInRow} + ${gridGap} *
                  ${maxTeasersInRow - 1}
              )
          ) / 2
      ); // set padding to limit the number of items in a row, while maintaining the vertical scroller on the far right.
    // the calculation of the padding is the whole width, subtracting the items and the gaps, dividing by 2 (for the left and right paddings)
    // if this would be done in grid-template-columns, the vertical scroller would be misplaced.
    margin-bottom: 2rem;

    @media (max-width: 69em) {
      padding: 0 5%;
    }

    @media (max-width: 55em) {
      padding: 1rem;
    }

    @media (max-width: 28em) {
      padding: 1rem 0.4rem;
    }
  }
`

const StyledCard = styled(Card)`
  && {
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`

const StyledCardMedia = styled(CardMedia)`
  && {
    width: 100%;
    height: 148px;
    background-size: cover;
    background-position: top;
  }
`

const SVGCardMedia = styled(StyledCardMedia).attrs(({ className }) => ({
  className
}))`
  && {
    background-size: max(9rem, 30%);
  }

  &.covid-jagadambika {
    background-size: cover;
    background-position: bottom;
  }
`

function MediaCard({
  topic,
  description,
  action,
  children
}: {
  topic: string
  description: string
  action?: ReactEventHandler
  children: React.ReactNode
}) {
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

export default observer(function InfoSetingsPage() {
  const store = useMst()
  const page = store.view.id || ''

  if (page === 'covid-19-guidelines') return <InfoCovid19GuidelinesPage />
  if (page === 'arriving-at-the-airport') return <InfoArrivingAtTheAirport />
  if (page === 'practice-guide') return <InfoPracticeGuide />

  return (
    <StyledPageContentWrapper>
      <MediaCard
        topic="COVID 19 Guidelines"
        description="Nam molestias, officia eaque illum architecto delectus itaque
            voluptate, ab cupiditate ipsam laudantium reprehenderit vel quis?
            Sapiente, nihil pariatur! Ipsum sint commodi tempora quos natus
            consequatur eaque qui facilis quae.
          "
        action={() => store.view.openInfoSectionPage('covid-19-guidelines')}
      >
        <SVGCardMedia
          image="/images/jagadambika-beach-anjaneyasana.jpeg"
          title="Jagadmabika in Anjaneyasana on the beach"
          className="covid-jagadambika"
        />
      </MediaCard>
      <MediaCard
        topic="Trip Logistics"
        description="Travel planning, trip considerations, what to bring, the check-in and check-out process and room move procedure"
        action={() => store.view.openInfoSectionPage('arriving-at-the-airport')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Amenities"
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
        topic="Practice Guide"
        description="How to meditate? Yoga asanas | Pranayama | Chants"
        action={() => store.view.openInfoSectionPage('practice-guide')}
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Our Community"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Our Tradition"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="What you can do during your stay"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Where things are"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Guidelines, Expectations and Safety"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="About Satsangs and Pujas"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Get involved and find new friends"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
      <MediaCard
        topic="Well Being Center"
        description="Dolorem sequi esse inventore temporibus facere vitae vero
        laborum illum eveniet animi optio quos
        quam, nihil, corrupti
        amet repellat distinctio,"
      >
        <StyledCardMedia
          image="https://online.sivanandabahamas.org/wp-content/uploads/2020/06/CKarmaYogi-1024x579.jpg"
          title="Krishna walking on the beach with a yoga mat"
        />
      </MediaCard>
    </StyledPageContentWrapper>
  )
})
