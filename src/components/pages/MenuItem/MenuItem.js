import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { isMobile } from 'react-device-detect'
import styled from '@emotion/styled'
import {
  addItemToCart,
  selectCartIds,
  selectCurrentItem,
  selectCustomerPointsProgram,
  selectGroupOrder,
  selectOrder,
  setCurrentItem,
  selectMenuSlug,
  showNotification, selectOrderFrequency
} from '@open-tender/redux'
import { useBuilder } from '@open-tender/hooks'
import { selectContentSection, selectMenuPath } from '../../../slices'
import { Back, NavMenu } from '../../buttons'
import { Star } from '../../icons'
import {
  BackgroundImage,
  Content,
  Header,
  Main,
  ScreenreaderTitle,
} from '../..'
import { MenuHeader } from '../Menu'
import { MenuContext } from '../Menu/Menu'
import MenuItemHeader from './MenuItemHeader'
import MenuItemAccordion from './MenuItemAccordion'
import MenuItemFooter from './MenuItemFooter'
import MenuItemGroups from './MenuItemGroups'
import MenuItemUpsell from './MenuItemUpsell'
import { imageTagnames } from '../Menu/MenuItem'
import MenuItemTagImages from '../../MenuItemImageTags'

const MenuItemView = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
`

const MenuItemImage = styled.div`
  position: fixed;
  display: flex;
  z-index: 1;
  top: ${(props) => props.theme.layout.navHeight};
  bottom: 0;
  left: 0;
  right: 64rem;
  background-color: ${(props) => props.theme.bgColors.tertiary};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none;
  }
`

const MenuItemContent = styled.div`
  // display: flex;
  // flex-direction: column;
  // justify-content: flex-start;
  // align-items: flex-stretch;
  width: 64rem;
  margin-bottom: ${(props) => props.footerHeight || '10rem'};
  background-color: ${(props) => props.theme.bgColors.primary};
  // background-color: yellow;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    margin-bottom: ${(props) => props.footerHeight || '10rem'};
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
`

const TagImageContainer = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 4rem;
  right: 5rem;
`

const MenuItem = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showUpsell, setShowUpsell] = useState(false)
  const [isCustomize, setIsCustomize] = useState(false)
  const [footerHeight, setFooterHeight] = useState(null)
  const footerHeightRem = footerHeight
    ? `${(footerHeight / 10).toFixed(1)}rem`
    : null
  const { soldOut, siteTitle, displaySettings, allergenAlerts } =
    useContext(MenuContext)
  const menuPath = useSelector(selectMenuPath)
  const menuSlug = useSelector(selectMenuSlug)
  const item = useSelector(selectCurrentItem)
  const upsells = useSelector(selectContentSection('upsells')) || {}
  const cartIds = useSelector(selectCartIds)
  const upsellItems = item ? item.upsell_items || item.upsellItems : null
  const upsellItemIds =
    upsellItems && upsells?.item?.show
      ? upsellItems.filter(
          (id) => !cartIds.includes(id) && !soldOut.includes(id)
        )
      : []
  const hasUpsell = upsellItemIds.length > 0
  const { cartId } = useSelector(selectGroupOrder)
  const { orderType } = useSelector(selectOrder)
  const pointsProgram = useSelector(selectCustomerPointsProgram(orderType))
  const hasPoints = !!pointsProgram
  const pointsIcon = hasPoints ? <Star /> : null
  const {
    item: builtItem,
    increment,
    decrement,
    setQuantity,
    setMadeFor,
    setNotes,
    toggleOption,
    incrementOption,
    decrementOption,
    setOptionQuantity,
  } = useBuilder(item || {})


  let textTags = []
  let imageTags = []
  for (let tag of builtItem.tags) {
    if (imageTagnames.includes(tag)) {
      imageTags.push(tag) // push the image url
    } else {
      textTags.push(tag)
    }
  }
  imageTags = imageTags.sort()
  const builtItemNoImageTags = {...builtItem, tags: textTags}

  const [searchParams] = useSearchParams()
  const orderFrequencyFromUrl = searchParams.get("freq")

  const orderFrequency = useSelector(selectOrderFrequency)

  const [orderFreq, setOrderFreq] = useState(orderFrequencyFromUrl? orderFrequencyFromUrl : orderFrequency)
  // useEffect(() => {
  //   setOrderFreq(orderFrequency)
  // }, [orderFrequency])

  const setOrderFrequency = (event) => {
    setOrderFreq(event.target.value)
  }

  const cancel = () => {
    dispatch(setCurrentItem(null))
  }

  const addItem = () => {
    const cartItem = { ...builtItem, frequency: orderFreq }
    if (cartItem.index === -1) delete cartItem.index
    dispatch(addItemToCart(cartItem))
    dispatch(showNotification(`${cartItem.name} added to cart`))
    if (hasUpsell) {
      setShowUpsell(true)
    } else {
      dispatch(setCurrentItem(null))
    }
  }

  const backClick = isCustomize ? () => setIsCustomize(false) : cancel

  useEffect(() => {
    if (!item) navigate(menuPath || menuSlug)
  }, [item, navigate, menuSlug, menuPath])

  if (!item) return null

  return (
    <>
      <Helmet>
        <title>
          Menu - {item.name} | {siteTitle}
        </title>
      </Helmet>
      <Content hasFooter={false}>
        {isMobile ? (
          <Header
            style={{ boxShadow: 'none' }}
            left={<Back onClick={backClick} />}
            right={<NavMenu />}
          />
        ) : (
          <MenuHeader backClick={backClick} />
        )}
        {hasUpsell && (
          <MenuItemUpsell
            showUpsell={showUpsell}
            setShowUpsell={setShowUpsell}
            upsellItemIds={upsellItemIds}
          />
        )}
        <Main>
          <ScreenreaderTitle>{item.name}</ScreenreaderTitle>
          <MenuItemView>
            <MenuItemImage>
              <BackgroundImage imageUrl={builtItem.imageUrl}
              children={imageTags.length !== 0 ? (
                <TagImageContainer>
                  <MenuItemTagImages tags={imageTags} imageSize={'7rem'}/>
                </TagImageContainer>
              ): null}
              />
            </MenuItemImage>
            <MenuItemContent footerHeight={footerHeightRem}>
              <MenuItemHeader
                builtItem={builtItemNoImageTags}
                decrementOption={decrementOption}
                displaySettings={displaySettings}
                pointsIcon={pointsIcon}
                isCustomize={isCustomize}
                setIsCustomize={setIsCustomize}
              />
              {isCustomize ? (
                <MenuItemGroups
                  builtItem={builtItem}
                  allergenAlerts={allergenAlerts}
                  displaySettings={displaySettings}
                  toggleOption={toggleOption}
                  incrementOption={incrementOption}
                  decrementOption={decrementOption}
                  setOptionQuantity={setOptionQuantity}
                />
              ) : (
                <MenuItemAccordion
                  builtItem={builtItem}
                  setQuantity={setQuantity}
                  increment={increment}
                  decrement={decrement}
                  toggleOption={toggleOption}
                  setMadeFor={setMadeFor}
                  setNotes={setNotes}
                  setOrderFrequency={setOrderFrequency}
                  orderFreq={orderFreq}
                  displaySettings={displaySettings}
                  cartId={cartId}
                />
              )}
              <MenuItemFooter
                builtItem={builtItem}
                addItem={addItem}
                cancel={cancel}
                isCustomize={isCustomize}
                setIsCustomize={setIsCustomize}
                setFooterHeight={setFooterHeight}
              />
            </MenuItemContent>
          </MenuItemView>
        </Main>
      </Content>
    </>
  )
}

MenuItem.displayName = 'MenuItem'
export default MenuItem
