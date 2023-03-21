import React from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import { selectBrand, selectConfig } from '../../../slices'
import {
  Content,
  Main,
  PageTitle,
  PageContent,
  HeaderDefault,
  PageContainer,
} from '../..'

const Pricing = () => {
  const { accessibility: config } = useSelector(selectConfig)
  const { title: siteTitle } = useSelector(selectBrand)

  return (
    <>
      <Helmet>
        <title>
          {config.title} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '76.8rem' }}>
            <PageTitle title='Price Policy'/>
            <PageContent style={{ textAlign: 'left', marginTop: '3rem' }}>
              <p>
                We pay local farmers and other suppliers fair prices. We pay our
                staff the living wage. We use 100% renewable electricity. We
                deliver on foot, by bicycle or electric powered car. We stock
                our shelves with beautiful things made by people who are your
                neighbours and ours. They don’t have large farms or factories.
                Their products don't arrive on 18 wheel trucks. The item you buy
                from us is their passion.
              </p>
              <p>
                We bake and prepare real food for you here, every day, using
                ingredients we are happy to tell you all about. That is our
                passion.
              </p>
              <p>
                Some of our prices may be a little bit higher than theirs. We
                believe that the lower prices that they offer have come at a big
                cost to society. Low employee wages, pressure on farmers to cut
                corners, money taken out of our local economy and a general
                indifference to the community. Even price fixing.
              </p>
              <p>
                An unacceptably large cost in our view.
              </p>
              <p>
                That said, we aim to offer as competitive a price as possible at
                all times. Sometimes our prices will even be better than theirs.
              </p>
              <p>
                Please know that when you buy from us, all of the money stays
                within the community and helps to build a robust local economy.
                We promise never to price fix, mislead, or otherwise treat you
                as simply a consumer. To us, you are a valuable member of our
                community.
              </p>
              <p>
                Thanks for shopping!
              </p>
            </PageContent>
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

Pricing.displayName = 'Pricing'
export default Pricing
