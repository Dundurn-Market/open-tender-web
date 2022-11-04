import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser, isMobile } from 'react-device-detect'
import { scroller, Element } from 'react-scroll'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'
import { dateToIso, slugify, weekdayAndTimeToDate } from '@open-tender/js'
import {
  fetchAllergens,
  fetchAnnouncementPage,
  fetchMenu,
  selectAnnouncementsPage,
  selectMenu, selectRevenueCenters, selectTimezone
} from '@open-tender/redux'
import { ButtonStyled } from '@open-tender/components'
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
  padding: 2rem 0 0 2rem;
  background-color: ${props => props.theme.bgColors.dark};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-height: 60rem;
    overflow: scroll;
  }
`

const MenuSite = () => {
  const dispatch = useDispatch()
  const { colors } = useTheme()
  const { olo_id, title: siteTitle } = useSelector(selectBrand)
  const { revenueCenters } = useSelector(selectRevenueCenters)
  const tz = useSelector(selectTimezone)
  const [revenueCenterId] = useState(olo_id)
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

  const [category, setCategory] = useState(categories[0])

  const scrollToMenu = () => {
    scroller.scrollTo('menuSite', {
      duration: 500,
      smooth: true,
      offset: -120,
    })
  }

  useEffect(() => {
    if (revenueCenterId) {
      dispatch(fetchAllergens())
      dispatch(fetchMenu({ revenueCenterId, serviceType, requestedAt }))
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
              <ButtonStyled onClick={scrollToMenu} size="big" color="light">
                Browse The Menu
              </ButtonStyled>
            </BackgroundContent>
          </PageHero>
          <MenuSiteView>
            <Element name="menuSite">
              <MenuSiteCategoryHeader>
                <h2>Browse Menu By Category</h2>
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
              <Element name="category">
                <MenuSiteCategory category={category} />
                {category.children.map((category) => (
                  <MenuSiteCategory
                    key={category.id}
                    category={category}
                    isChild={true}
                  />
                ))}
              </Element>
            </Element>
          </MenuSiteView>
        </Main>
      </Content>
    </>
  )
}

export default MenuSite
