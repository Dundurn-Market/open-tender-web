import { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import {
  addItemToCart,
  selectCartCounts,
  selectMenu,
  selectMenuSlug, selectOrderFrequency, selectOrderType,
  selectPointsProgram, selectRevenueCenter,
  selectSelectedAllergenNames, selectToken,
  setCurrentItem,
  showNotification
} from '@open-tender/redux'
import { makeOrderItem, rehydrateOrderItem, slugify } from '@open-tender/js'
import { useOrderItem } from '@open-tender/hooks'
import { Body, ButtonStyled, CardMenuItem, SelectOnly } from '@open-tender/components'
import {
  selectDisplaySettings,
  openModal,
  toggleSidebarModal,
  setMenuPath,
} from '../../../slices'
import { MenuItemButton, MenuItemOverlay, MenuItemTagAlert } from '../..'
import MenuItemCount from './MenuItemCount'
import { subscriptionFreqOptions } from '../../../utils/recurringFrequencyUtils'
const MenuItemView = styled(CardMenuItem)`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: .5px solid ${(props) => props.theme.colors.success};
`

const MenuItemButtons = styled.div`
  flex-grow: 0;
  padding: ${(props) => (props.hasBox ? '0 1.3rem 1.5rem' : '0')};

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      display: none;
    }
  }
`

const MenuItemButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MenuItemSubscriptionDropdown = styled.div`
  width: 8.2rem;
  select {
    padding-left: 5px;
    padding-right: 0;
  }
  select:focus {
    outline: none;
  }
`

const MenuItemButtonsWarning = styled(Body)`
  display: block;
  width: 100%;
  margin: 0 0 1rem;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  color: ${(props) => props.theme.colors.error};
`

//TODO this is deprecated .. may be able to remove all styling
const MenuItemButtonsAdd = styled.div`
  ${(props) =>
    props.disabled
      ?
            `
  button, button:active, button:hover, button:disabled {
    border: 0;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent;
    color: black;
  }`
      : ''}
`

const MenuItemButtonsCustomize = styled.div`
  button,
  button:active,
  button:hover,
  button:disabled {
    border: 0;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent;
    color: ${(props) =>
      props.theme.cards.menuItem.overrideFontColors
        ? props.theme.cards.menuItem.titleColor
        : props.theme.fonts.headings.color};
  }

  button:hover {
    color: ${(props) => props.theme.links.primary.color};
  }
`

export const imageTagnames = [
  'Gluten-free',
  'Organic',
  'Plant Based',
  'Local'
]

const MenuItem = ({
  item,
  isSimple = false,
  isCentered = false,
  displayOnly = false,
  addCallback,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [clicked, setClicked] = useState(false)
  const theme = useTheme()
  const { pathname } = useLocation()
  const hasBox = theme.cards.menuItem.bgColor !== 'transparent'
  const menuSlug = useSelector(selectMenuSlug)
  const cartCounts = useSelector(selectCartCounts)
  const allergenAlerts = useSelector(selectSelectedAllergenNames)
  const { soldOut } = useSelector(selectMenu)
  const displaySettings = useSelector(selectDisplaySettings)
  const pointsProgram = useSelector(selectPointsProgram)
  const authToken = useSelector(selectToken)
  const revenueCenter = useSelector(selectRevenueCenter)
  const orderType = useSelector(selectOrderType)

  const orderFrequency = useSelector(selectOrderFrequency)
  const [orderFreq, setOrderFreq] = useState(orderFrequency)
  useEffect(() => {
    setOrderFreq(orderFrequency)
  }, [orderFrequency])

  const [isRecurringAllowed, setRecurringAllowed] = useState(!!(revenueCenter && revenueCenter.isScheduledGroceryCenter && authToken && orderType === 'OLO'))
  useEffect(() => {
    setRecurringAllowed(revenueCenter && revenueCenter.isScheduledGroceryCenter && authToken && orderType === 'OLO')
  }, [revenueCenter, authToken, orderType])

  const hasPoints = !!pointsProgram
  const orderItem = item.favorite
    ? { ...rehydrateOrderItem(item, item.favorite.item), index: -1 }
    : makeOrderItem(item, null, soldOut, null, hasPoints)
  const {
    name,
    showImage,
    imageUrl,
    displayDesc,
    displayTags,
    displayAllergens,
    displayPrice,
    displayCals,
    isIncomplete,
    isSoldOut,
    allergenAlert,
    showQuickAdd,
    sizeOnly,
    cartCount,
  } = useOrderItem(
    orderItem,
    item.favorite,
    soldOut,
    allergenAlerts,
    displaySettings,
    cartCounts,
    isMobile
  )
  // const builderType = 'PAGE'
  const { builderType } = displaySettings
  const isBig = !isSimple && !isCentered ? true : false
  const showButtons = !displayOnly && isBig && showQuickAdd ? true : false
  const addDisabled = isIncomplete || isSoldOut
  const customizeIsPrimary = addDisabled && !isSoldOut

  let textTags = []
  let imageTags = []
  for (let tag of displayTags) {
    if (imageTagnames.includes(tag)) {
      imageTags.push(tag) // push the image url
    } else {
      textTags.push(tag)
    }
  }
  imageTags = imageTags.sort()

  const view = () => {
    if (!isSoldOut) {
      dispatch(setMenuPath(pathname || menuSlug))
      dispatch(setCurrentItem(isRecurringAllowed? { ...orderItem, frequency: orderFreq } : orderItem))
      if (builderType === 'PAGE') {
        navigate(`${menuSlug}/item/${slugify(name)}`)
      } else if (builderType === 'SIDEBAR') {
        dispatch(toggleSidebarModal())
      } else {
        dispatch(openModal({ type: 'item', args: { focusFirst: true } }))
      }
    }
  }

  const add = () => {
    if (!isSoldOut && !isIncomplete) {
      const cartItem = isRecurringAllowed? { ...orderItem, frequency: orderFreq } : { ...orderItem}
      if (cartItem.index === -1) delete cartItem.index
      if (item.category_id === 4074) { // A hack for giftcards to go directly to "Add a note"
        view()
      } else {
        dispatch(addItemToCart(cartItem))
        dispatch(showNotification(`${name} added to cart!`))
        if (addCallback) addCallback()
      }
    }
  }

  const setSubscription = (event) => {
    setOrderFreq(event.target.value)
  }

  const imageOverlay = showImage ? (
    <MenuItemOverlay isSoldOut={isSoldOut} allergenAlert={allergenAlert} />
  ) : null

  return (
    <MenuItemView className={isSimple ? 'compact' : ''}>
      {cartCount > 0 && (
        <MenuItemCount>
          <span>{cartCount}</span>
        </MenuItemCount>
      )}
      <MenuItemButton
        onClick={view}
        disabled={isSoldOut || displayOnly}
        showImage={showImage}
        imageUrl={imageUrl}
        imageOverlay={imageOverlay}
        name={item.name}
        desc={displayDesc}
        price={displayPrice}
        cals={displayCals}
        tags={textTags}
        imageTags={imageTags}
        allergens={displayAllergens}
      />
      {!showImage ? (
        <MenuItemTagAlert isSoldOut={isSoldOut} allergenAlert={allergenAlert} />
      ) : null}
      {showButtons && (
        <MenuItemButtons hasBox={hasBox}>
          {clicked && (
            <MenuItemButtonsWarning>
              Item requires customization. Tap "Customize".
            </MenuItemButtonsWarning>
          )}
          <MenuItemButtonsContainer>
            <MenuItemButtonsAdd disabled={addDisabled}>
              <ButtonStyled
                onClick={isIncomplete ? () => setClicked(true) : add}
                size="small"
                disabled={isSoldOut || isIncomplete}
              >
                Add To Order
              </ButtonStyled>
            </MenuItemButtonsAdd>
            {isRecurringAllowed && (
              <MenuItemSubscriptionDropdown>
                <SelectOnly
                  label='Subscribe'
                  name='subscription-freq'
                  value={orderFreq}
                  onChange={setSubscription}
                  options={subscriptionFreqOptions}
                />
              </MenuItemSubscriptionDropdown>
            )}
            <MenuItemButtonsCustomize customizeIsPrimary={customizeIsPrimary}>
              <ButtonStyled
                onClick={view}
                disabled={isSoldOut}
                size="small"
                color="secondary"
                // color={customizeIsPrimary ? 'primary' : 'secondary'}
              >
                {sizeOnly ? 'Choose Size' : 'Customize'}
              </ButtonStyled>
            </MenuItemButtonsCustomize>
          </MenuItemButtonsContainer>
        </MenuItemButtons>
      )}
    </MenuItemView>
  )
}

MenuItem.displayName = 'MenuItem'
MenuItem.propTypes = {
  item: propTypes.object,
  isSimple: propTypes.bool,
  isCentered: propTypes.bool,
  displayOnly: propTypes.bool,
  addCallback: propTypes.func,
}

export default MenuItem
