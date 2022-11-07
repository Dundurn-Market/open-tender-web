import { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import {
  addItemToCart,
  selectMenu, selectMenuSlug,
  selectSelectedAllergenNames, setCurrentItem,
  showNotification
} from '@open-tender/redux'
import { useBuilder, useOrderItem } from '@open-tender/hooks'
import { ButtonStyled, CardMenuItem } from '@open-tender/components'
import { useDispatch, useSelector } from 'react-redux'
import { openModal, selectDisplaySettings, setMenuPath, toggleSidebar, toggleSidebarModal } from '../slices'
import { MenuItemButton, MenuItemOverlay, MenuItemTagAlert } from '.'
import { slugify } from '@open-tender/js'
import { useLocation, useNavigate } from 'react-router-dom'

const UpsellItemView = styled(CardMenuItem)`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const UpsellItemButtons = styled.div`
  flex-grow: 0;
  padding: ${(props) => (props.hasBox ? '0 1.1rem 1.1rem' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    display: block;
  }
`

const UpsellItemSizes = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: -0.25rem -0.5rem;

  button {
    margin: 0.25rem 0.5rem;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`

const UpsellItem = ({ orderItem, addCallback, showDesc = true }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const hasBox = theme.cards.menuItem.bgColor !== 'transparent'
  const [hasSize, setHasSize] = useState(false)
  const allergenAlerts = useSelector(selectSelectedAllergenNames)
  const { soldOut } = useSelector(selectMenu)
  const displaySettings = useSelector(selectDisplaySettings)

  const { pathname } = useLocation()
  const menuSlug = useSelector(selectMenuSlug)

  const { item: builtItem, toggleOption } = useBuilder(orderItem)
  const {
    name,
    showImage,
    imageUrl,
    displayDesc,
    displayTags,
    displayAllergens,
    displayPrice,
    displayCals,
    isSoldOut,
    allergenAlert,
  } = useOrderItem(orderItem, null, soldOut, allergenAlerts, displaySettings)
  const { quantity, groups, totalPrice } = builtItem
  const sizeGroup = groups.find((i) => i.isSize)
  const groupsBelowMin = groups.filter((g) => g.quantity < g.min).length > 0
  const isIncomplete = totalPrice === 0 || quantity === '' || groupsBelowMin
  const imageOverlay = showImage ? (
    <MenuItemOverlay isSoldOut={isSoldOut} allergenAlert={allergenAlert} />
  ) : null

  const add = () => {
    if (!isIncomplete) {
      if (builtItem.category === "Greeting Cards") { // A hack for giftcards to go directly to "Add a note"
        dispatch(setMenuPath(pathname || menuSlug))
        dispatch(setCurrentItem(builtItem))
        navigate(`${menuSlug}/item/${slugify(name)}?freq=SINGLE`)
        dispatch(toggleSidebar())
      } else {
        dispatch(addItemToCart(builtItem))
        dispatch(showNotification(`${builtItem.name} added to cart!`))
        if (addCallback) addCallback()
      }
    }
  }

  const view = () => {


      // } else if (builderType === 'SIDEBAR') {
 //       dispatch(toggleSidebarModal())
      // } else {
 //        dispatch(openModal({ type: 'item', args: { focusFirst: true } }))
      // }
  }

  const addSize = (optionId) => {
    toggleOption(sizeGroup.id, optionId)
    setHasSize(true)
  }

  useEffect(() => {
    if (hasSize && !isIncomplete) {
      dispatch(addItemToCart(builtItem))
      dispatch(showNotification(`${builtItem.name} added to cart!`))
      if (addCallback) addCallback()
    }
  }, [hasSize, isIncomplete, builtItem, addCallback, dispatch])

  if (isIncomplete && !sizeGroup) return null

  return (
    <UpsellItemView>
      <MenuItemButton
        onClick={null}
        disabled={true}
        showImage={showImage}
        imageUrl={imageUrl}
        imageOverlay={imageOverlay}
        name={name}
        desc={showDesc ? displayDesc : null}
        price={displayPrice}
        cals={displayCals}
        tags={displayTags}
        allergens={displayAllergens}
      />
      {!showImage ? (
        <MenuItemTagAlert isSoldOut={isSoldOut} allergenAlert={allergenAlert} />
      ) : null}
      <UpsellItemButtons hasBox={hasBox}>
        {!isIncomplete ? (
          <ButtonStyled onClick={add} size="small">
            Add To Order
          </ButtonStyled>
        ) : (
          <UpsellItemSizes>
            {sizeGroup.options.map((option) => (
              <ButtonStyled
                key={option.id}
                onClick={() => addSize(option.id)}
                size="small"
              >
                {option.name}
              </ButtonStyled>
            ))}
          </UpsellItemSizes>
        )}
      </UpsellItemButtons>
    </UpsellItemView>
  )
}

UpsellItem.displayName = 'UpsellItem'
UpsellItem.propTypes = {
  menuItem: propTypes.object,
  addCallback: propTypes.func,
}

export default UpsellItem
