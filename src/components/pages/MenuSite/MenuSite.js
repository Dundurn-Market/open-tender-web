import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser, isMobile } from 'react-device-detect'
import { scroller, Element } from 'react-scroll'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'
import { dateToIso, slugify, weekdayAndTimeToDate } from '@open-tender/js'
import {
  fetchAllergens,
  fetchAnnouncementPage, fetchLocations,
  fetchMenu,
  selectAnnouncementsPage,
  selectMenu,
  selectOrder,
  selectRevenueCenters,
  selectTimezone,
} from '@open-tender/redux'
import { ButtonLink, ButtonStyled } from '@open-tender/components'
import { selectBrand, selectContentSection } from '../../../slices'
import {
  BackgroundContent,
  Content,
  Main,
  HeaderSite,
  PageHero,
  PageIntro,
} from '../..'
import MenuSiteCategory, { MenuSiteCategoryHeader } from './MenuSiteCategory'
import { useTheme } from '@emotion/react'
import MenuBrowseCategory from '../Menu/MenuBrowseCategory'
import { MenuBrowseCategories } from '../Menu/MenuBrowse'
import MenuDropdownCategory from '../Menu/MenuDropdownCategory'
import { MenuCategory } from '../Menu'

const MenuSiteView = styled.div`
margin-top: 2rem;
`

export const MenuSiteCategories = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 2rem 2rem 0;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-height: 60rem;
    overflow: scroll;
  }
`

const BrowseCategoryFootnote = styled.div`
  margin: 2rem 0 0;
  font-size: 1.5rem;
  color: white;
`

const MenuSite = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { colors } = useTheme()
  const { olo_id, title: siteTitle } = useSelector(selectBrand)
  const { revenueCenters } = useSelector(selectRevenueCenters)
  const tz = useSelector(selectTimezone)
  const [revenueCenterId] = useState(olo_id)
  const {
    revenueCenter: orderRevenueCenter,
    serviceType: orderServiceType,
    cart: orderCart,
  } = useSelector(selectOrder)
  const { background, mobile, title, subtitle, content } = useSelector(
    selectContentSection('menuSite')
  )
  let revenueCenter = null
  if (revenueCenterId !== 0) {
    revenueCenter = revenueCenters.find(r => r.revenue_center_id === revenueCenterId)
  }
  const serviceType = 'PICKUP'
  let requestedAt;
  if (revenueCenter && revenueCenter.order_times.PICKUP && revenueCenter.order_times.PICKUP.length) {
    const weekday = revenueCenter.order_times.PICKUP[0].weekday
    const time = revenueCenter.order_times.PICKUP[0].start_time
    requestedAt = dateToIso(weekdayAndTimeToDate(weekday, time), tz)
  } else {
    requestedAt = 'asap'
  }

  // const geoLatLng = useSelector(selectGeoLatLng)
  const { categories } = useSelector(selectMenu)
  const announcements = useSelector(selectAnnouncementsPage('MENU'))

  const [category, setCategory] = useState(null)

  const isCurrentOrder = orderRevenueCenter &&
    orderServiceType &&
    orderCart.length > 0

  const scrollToMenu = () => {
    scroller.scrollTo('menuSite', {
      duration: 500,
      smooth: true,
      offset: -120,
    })
  }

  useLayoutEffect(() => {
    if (revenueCenterId) {
      dispatch(fetchAllergens())
      dispatch(fetchMenu({ revenueCenterId, serviceType, requestedAt, skipCartValidate: true }))
    }
  }, [revenueCenterId, serviceType, requestedAt, dispatch])

  useEffect(() => {
    dispatch(fetchAnnouncementPage('MENU'))
  }, [dispatch])

  const categoryOnClick = (category) => () => {
    setCategory(category)
    if (isMobile) {
      scroller.scrollTo('category', {
        duration: 500,
        smooth: true,
        offset: -100,
      })
    }
  }
  return (
    <>
      <Helmet>
        <title>Menu | {siteTitle}</title>
      </Helmet>
      <Content>
        <HeaderSite />
        <Main style={{ paddingTop: '0' }}>
          <PageHero
            announcements={announcements}
            imageUrl={isBrowser ? background : mobile}
          >
            <BackgroundContent
              title={title}
              subtitle={subtitle}
              title_color={colors.light}
              subtitle_color={colors.light}
              vertical="BOTTOM"
              horizontal="LEFT"
            >
              <div>
                <ButtonStyled onClick={scrollToMenu} size="big" color="light">
                  Browse Products
                </ButtonStyled>
              </div>
              <BrowseCategoryFootnote>
                <p>
                  <span>
                    { isCurrentOrder
                      ? 'Want to add to your cart? '
                      : 'Ready to add to your cart? '
                    }
                  </span>
                  <ButtonLink
                    onClick={() => navigate('/order-type')}
                    color='light'
                  >
                    { isCurrentOrder ? 'Continue ordering.' : 'Order now!' }
                  </ButtonLink>
                </p>
              </BrowseCategoryFootnote>
            </BackgroundContent>
          </PageHero>
          <MenuSiteView>
            <Element name="menuSite">
              <MenuSiteCategoryHeader>
                <h2>Browse Products By Category</h2>
              </MenuSiteCategoryHeader>
              <MenuSiteCategories>
                {categories.map((category, index) => (
                  <MenuDropdownCategory
                    key={category.name}
                    category={category}
                    onClickOverride={categoryOnClick(category)}
                  />
                ))}
              </MenuSiteCategories>
              {category && (
                <Element name="category">
                  <MenuSiteCategory category={category} />
                  {category && (category.children.map((category) => (
                    <MenuSiteCategory
                      key={category.id}
                      category={category}
                      isChild={true}
                    />
                  )))}
                </Element>
              )}
            </Element>
          </MenuSiteView>
        </Main>
      </Content>
    </>
  )
}

export default MenuSite
