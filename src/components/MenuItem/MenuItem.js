import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import {
  addItemToCart,
  selectCartIds,
  selectCurrentItem,
  selectCustomerPointsProgram,
  selectGroupOrder,
  selectOrder,
  selectSelectedAllergenNames,
  selectSoldOut,
  selectMenuSlug,
  showNotification,
  selectOrderFrequency
} from '@open-tender/redux'
import { useBuilder } from '@open-tender/hooks'
import { selectContentSection, selectDisplaySettings, selectMenuPath } from '../../slices'
import { Star } from '../icons'
import { Back, NavMenu } from '../buttons'
import MenuItemAccordion from './MenuItemAccordion'
import MenuItemClose from './MenuItemClose'
import MenuItemFooter from './MenuItemFooter'
import MenuItemGroups from './MenuItemGroups'
import MenuItemHeader from './MenuItemHeader'
import MenuItemImage from './MenuItemImage'
import MenuItemTagImages from '../MenuItemTagImages'
import MenuItemUpsell from './MenuItemUpsell'
import { imageTagnames } from '../MenuItemTagImages'

const MenuItemView = styled.div`
  label: MenuItemView;
  position: relative;
  // z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  overflow: hidden;
`

const MenuItemContent = styled.div`
  label: MenuItemContent;
  flex: 1 1 auto;
  background-color: lightblue;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.bgColors.primary};

  &::-webkit-scrollbar {
    display: none;
  }
`

const MenuItemBack = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.item.desktop.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 0 ${(props) => props.theme.item.mobile.padding};
  }
`

const TagImageContainer = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 4rem;
  right: 5rem;
`

const MenuItem = ({
  cancel,
  showBack = false,
  showClose = true,
  showImage = true,
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [scrollContainer, setScrollContainer] = useState(null)
  const [topOffset, setTopOffset] = useState(null)
  const [showUpsell, setShowUpsell] = useState(false)
  const [isCustomize, setIsCustomize] = useState(false)
  const soldOut = useSelector(selectSoldOut)
  const allergenAlerts = useSelector(selectSelectedAllergenNames)
  const displaySettings = useSelector(selectDisplaySettings)
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
  const { builderImages, hasCustomize } = displaySettings
  const displayImage = showImage && !isCustomize && builderImages ? true : false
  const hasGroups = builtItem.groups.filter((g) => !g.isSize).length > 0
  const showGroups = hasGroups && (!hasCustomize || isCustomize)

  const imageTags = builtItem.tags.filter(t => imageTagnames.includes(t))

  const [searchParams] = useSearchParams()
  const orderFrequencyFromUrl = searchParams.get("freq")

  const orderFrequency = useSelector(selectOrderFrequency)

  const [orderFreq, setOrderFreq] = useState(orderFrequencyFromUrl? orderFrequencyFromUrl : orderFrequency)

  const setOrderFrequency = (event) => {
    setOrderFreq(event.target.value)
  }

  const addItem = () => {
    const cartItem = { ...builtItem, frequency: orderFreq }
    if (cartItem.index === -1) delete cartItem.index
    dispatch(addItemToCart(cartItem))
    dispatch(showNotification(`${cartItem.name} added to cart`))
    hasUpsell ? setShowUpsell(true) : cancel()
  }

  const onViewRef = useCallback((node) => {
    if (node !== null) {
      setTopOffset(node.getBoundingClientRect().top)
    }
  }, [])

  const onScrollRef = useCallback((node) => {
    if (node !== null) {
      setScrollContainer(node)
    }
  }, [])

  useEffect(() => {
    if (!item) navigate(menuPath || menuSlug)
  }, [item, navigate, menuSlug, menuPath])

  if (!item) return null

  return (
    <>
      <MenuItemView ref={onViewRef}>
        {showClose && <MenuItemClose onClick={cancel} />}
        <MenuItemContent id="menu-item-content" ref={onScrollRef}>
          {showBack && (
            <MenuItemBack>
              <Back onClick={cancel} />
              <NavMenu />
            </MenuItemBack>
          )}
          {displayImage && <>
            <MenuItemImage imageUrl={builtItem.imageUrl} hasBack={showBack}>
              { !!imageTags.length && <>
                <TagImageContainer>
                  <MenuItemTagImages tags={imageTags} imageSize={'7rem'}/>
                </TagImageContainer>
              </> }
            </MenuItemImage>
          </> }
          <MenuItemHeader
            cancel={cancel}
            builtItem={builtItem}
            decrementOption={decrementOption}
            displaySettings={displaySettings}
            pointsIcon={pointsIcon}
            hasCustomize={hasCustomize}
            isCustomize={isCustomize}
            setIsCustomize={setIsCustomize}
            topOffset={topOffset}
            scrollContainer={scrollContainer}
          />
          {!hasCustomize || !isCustomize ? (
            <MenuItemAccordion
              hasCustomize={hasCustomize}
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
          ) : null}
          {showGroups ? (
            <MenuItemGroups
              builtItem={builtItem}
              allergenAlerts={allergenAlerts}
              displaySettings={displaySettings}
              toggleOption={toggleOption}
              incrementOption={incrementOption}
              decrementOption={decrementOption}
              setOptionQuantity={setOptionQuantity}
              scrollContainer={scrollContainer}
              topOffset={topOffset}
              headerHeight={45}
            />
          ) : null}
        </MenuItemContent>
        <MenuItemFooter
          builtItem={builtItem}
          increment={increment}
          decrement={decrement}
          addItem={addItem}
          cancel={cancel}
          hasCustomize={hasCustomize}
          isCustomize={isCustomize}
          setIsCustomize={setIsCustomize}
        />
      </MenuItemView>
      {hasUpsell && (
        <MenuItemUpsell
          showUpsell={showUpsell}
          setShowUpsell={setShowUpsell}
          upsellItemIds={upsellItemIds}
          cancel={cancel}
        />
      )}
    </>
  )
}

MenuItem.displayName = 'MenuItem'

export default MenuItem
