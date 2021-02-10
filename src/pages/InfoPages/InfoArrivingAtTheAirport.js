import React from 'react'
import Link from '@material-ui/core/Link'
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

export default function InfoArrivingAtTheAirport() {
  return (
    <>
      <Article>
        <section>
          <Typography variant="h1">Travel Planning</Typography>
          <Typography variant="body1">
            Fly in to{' '}
            <Link href="https://nassaulpia.com/" rel="noopener" target="_blank">
              Nassau International Airport
            </Link>
            . Here you can find{' '}
            <Link
              href="https://nassaulpia.com/flight-info/airlines-serving-lpia/"
              rel="noopener"
              target="_blank"
            >
              a list of airlines serving the Nassau Airport.
            </Link>
          </Typography>
          <Typography variant="body1">
            After clearing your belongings and immigration, please chat with us
            to let us know you have arrived, then please take a taxi to
            Elizabeth & Bay Dock. Taxi should take about 30 minutes, and should
            cost $30-35 per person approximately. The Ashram Boat will be
            waiting for you at the dock, to take you directly to the Ashram.
          </Typography>
          <Typography variant="h2">Before arrival</Typography>
          <Typography variant="body1">
            Take a look at the{' '}
            <Link
              href="https://www.bahamas.com/plan-your-trip/island-faq/visa-immigration"
              target="_blank"
              rel="noopener"
            >
              Bahamas Government official travel requirements
            </Link>{' '}
            for Visa requirements and for{' '}
            <Link
              href="https://www.bahamas.com/tourism-reopening"
              target="_blank"
              rel="noopener"
            >
              COVID 19 procedure
            </Link>
            .
          </Typography>
          <Typography variant="h2">Letting us know you've arrived</Typography>
          <Typography variant="body1">
            If you have Internet connection at the airport (Sometimes the WiFi
            works well and sometimes it doesn't, and many people have mobile
            data), hopefully you do. In this case, chat with us as soon as you
            are there so we know we are in communication.
            <br /> Then, just before you exit the airport, let us know you have
            exited, so we know to schedule a boat for you.
            <br />
            In case the Internet doesn't work well, call us at 416-479-0199 or
            local call: 363-2902 to make sure we know to schedule a boat for
            you.
          </Typography>
          <Typography variant="h2">Taxi &amp; Boat</Typography>
          <Typography variant="h2" style={{ color: 'darkred' }}>
            Perhaps we should do something special for COVID 19???
          </Typography>
          <Typography variant="body1">
            Take a taxi to our dock location at Elizabeth on Bay Marketplace (on
            the corner of Bay St and Elizabeth Ave). The cost of the taxi will
            be approximately $30 (plus surcharge for more than 2 persons). You
            can pay for the taxi with American or Bahamian dollars (you can use
            either currency throughout the Bahamas and at the ashram).
          </Typography>
          <Typography variant="body1">
            Our boat will pick you up at Elizabeth on Bay Marketplace and take
            you to the ashram, a 5-minute boat ride across the bay from the dock
            in Nassau. While there is a regular boat schedule, we will do our
            best to ensure that our boat meets you at the dock in a timely
            manner so you do not have to wait long.
            <br />
            <br />
            ... picture of the boat waiting place...
            <br />
            <br />
            In case you have Internet connection (at the point of waiting for
            the boat there is no WiFi service available), you can always
            communicate with us to let us know the taxi has dropped you off and
            you are ready to meet our boatman.
            <br />
            You can also send a text message a few minutes before leaving the
            taxi...
          </Typography>
        </section>
        <section>
          <Typography variant="h1">What to bring?</Typography>
          <Typography variant="h2">Clothing</Typography>
          <Typography variant="body1">
            CLOTHING As the ashram is a spiritual community and study center, we
            ask that clothing be respectable and modest. Guests are invited to
            dress in casual, comfortable clothes suitable for warm days and cool
            evenings. Around the ashram, summer attire is completely
            appropriate, including shorts, skirts, and summer tops (although
            halter tops, low necklines, and short shorts and mini-skirts are
            not). Of course, bathing suits are worn on the beach; we simply ask
            that you wear a cover-up on the way to the beach. In satsang and the
            temples, knees and shoulders should be covered; we recommend
            bringing a meditation shawl.
          </Typography>
          <Typography variant="body1">
            <Typography variant="h2">Other items to pack</Typography>
            OTHER ITEMS TO PACK Yoga mat (also available on-site to rent or
            buy); beach towel (they are not provided); meditation cushion
            (optional), toiletries (including soap), slip-on sandals, rainwear,
            flashlight, insect repellent, alarm clock, insulated travel mug,
            water bottle, and sunscreen. You may also wish to bring snorkeling
            equipment. Some guests bring dry snack foods, such as nuts and
            energy bars.
          </Typography>
          <Typography variant="h2">In case you are tenting</Typography>
          <Typography variant="body1">
            For tent space only: bring your own tent, bedding, and towels.
          </Typography>
          <Typography variant="h2">What’s Available On-Site</Typography>
          <Typography variant="h2">Meals</Typography>
          <Typography variant="body1">
            We serve two delicious vegetarian meals a day, prepared with love
            and care according to yogic dietary principles. Both brunch and
            dinner offer nourishing vegetable, grain, and/or bean dishes as well
            as hearty soups. Brunch also includes fruit, homemade granola, and
            freshly made yogurt. Raw fixings to make your own salad are offered
            at both meals, as well as our own baked bread. We also serve a daily
            herbal tea selection.
          </Typography>
          <Typography variant="body1">
            In accordance with a yogic diet, absent from the menu are meat,
            fish, fowl, eggs, garlic, onions, and caffeinated tea and coffee.
          </Typography>
          <Typography variant="h2">Snacks</Typography>
          <Typography variant="body1">
            Our Health Hut kitchen offers fresh-baked goods for purchase, as
            well as smoothies, frozen fruit bars, and other selected treats. Dry
            snack foods, such as nuts, energy bars, and chips are also available
            for purchase.
          </Typography>
          <Typography variant="h2">Specialty Items</Typography>
          <Typography variant="body1">
            The Boutique and Bookstore contains an extensive selection of
            spiritual books, cassettes and CDs, clothing for yoga classes, yoga
            mats, meditation cushions, other yoga-related items, gifts, and
            spiritual paintings. Certain food supplements, toiletries, notebooks
            and pens are also available.
          </Typography>
        </section>
        <section>
          <Typography variant="h1">The Check in process</Typography>
          <Typography variant="body1">
            Once you have landed at the ashram, you will meet our lovely
            receptionists.
            <br />
            ...show images of the path, some nice signs along the way...
            <br />
            The check in process involves scanning your passport, confirming
            your details, and showing you to your room. (all payments are
            handled 14 days prior to arrival)
            <br />
          </Typography>
          <Typography variant="body1">
            The room check in time is scheduled for 15:00, and checkout time is
            at 11:00. So housekeeping starts their cleaning round at 11:00.
            <br />
            Since we take into account the expected arrival time of each guest,
            we generally have most of the rooms ready for everyone on time. If
            you arrive before 12:00, you might have to wait, but in most days
            you can expect coming into your room within a short time. The
            official check in time is 15:00, so don't be mad if it's not
            clean............ we might always run into some difficulties and we
            take this time as a reasonable safety margin.
          </Typography>
          <Typography variant="h2">Checkout</Typography>
          <Typography variant="body1">
            Checkout time is at 11:00, and we ask you to give us your room keys
            by that time. Housekeeping might need to enter into your room at
            11:00 to have it ready for the next guest. If there is no other
            guest coming into your room, you can ask for a late checkout for any
            time up to 15:00, which costs $25 + tax. We can only process late
            checkout request on the day before or day of departure
          </Typography>
          <Typography variant="h2">Preparing to checkout</Typography>
          <Typography variant="body1">
            We usually coordinate a boat and taxi for you for your departure....
            <br />
            We will remind you of that before you check out. You can book your
            taxi <Link href="#">here</Link>.
          </Typography>
          <Typography variant="h2">Room move</Typography>
          <Typography variant="body1">
            In case you are moving rooms during your stay, please note that we
            ask you to checkout of your previous room, we will have a place for
            your to store your belongings, and only when your next room is ready
            you can enter it. Housekeeping prioritizes the rooms for people who
            move between rooms, so usually you would not wait more than an hour
            without a room, but it might extend up at 15:00.
          </Typography>
        </section>
      </Article>
    </>
  )
}
