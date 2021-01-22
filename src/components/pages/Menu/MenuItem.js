import React, { useContext } from 'react'
import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { setCurrentItem, selectCartCounts } from '@open-tender/redux'
import { convertStringToArray, makeDisplayPrice } from '@open-tender/js'
import { Box, Heading } from '@open-tender/components'

import { selectDisplaySettings, openModal } from '../../../slices'
import iconMap from '../../iconMap'
import { Tag } from '../..'
import { MenuContext } from './Menu'
import { MenuItemButton, MenuItemImage } from '.'

const MenuItemView = styled('div')`
  position: relative;
  width: 20%;
  padding: ${(props) => props.theme.layout.padding};
  padding-bottom: 0;
  padding-left: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
    width: 25%;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    width: 33.33333%;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 33.33333%;
    padding: ${(props) => props.theme.layout.paddingMobile};
    padding-bottom: 0;
    padding-left: 0;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 50%;
    padding: ${(props) => props.theme.layout.paddingMobile};
    padding-bottom: 0;
    padding-left: 0;
  }
`

export const MenuItemContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`

export const MenuItemOverlay = styled('div')`
  position: absolute;
  z-index: 3;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: ${(props) => props.theme.border.radius};
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background-color: ${(props) =>
    props.isSoldOut ? props.theme.overlay.dark : 'transparent'};
`

const MenuItemCount = styled('div')`
  position: absolute;
  z-index: 3;
  top: -1.3rem;
  right: -1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 2.2em;
  height: 2.2em;
  border-radius: 1.1em;
  padding-bottom: 0.1rem;
  border-width: 0.2rem;
  border-style: solid;
  color: ${(props) => props.theme.colors.light};
  background-color: ${(props) => props.theme.colors.error};
  border-color: ${(props) => props.theme.colors.light};
  font-weight: ${(props) => props.theme.boldWeight};
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    top: -1rem;
    right: -0.9rem;
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const MenuItemAlert = styled('div')`
  position: absolute;
  z-index: 2;
  bottom: -1.2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MenuItemContent = styled('div')`
  padding: 1.2rem 1.4rem 0.9rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 0.9rem 0.9rem 0.6rem;
  }
`

const MenuItemName = styled('p')`
  line-height: 1.2;
  font-size: ${(props) => props.theme.fonts.sizes.big};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.fonts.sizes.main};
  }
`

const MenuItemDescription = styled('p')`
  margin: 0.5rem 0 0;
  line-height: ${(props) => props.theme.lineHeight};
  color: ${(props) => props.theme.fonts.body.color};
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none;
  }
`

const MenuItemDetails = styled('p')`
  margin: 0.5rem 0 0;
  line-height: ${(props) => props.theme.lineHeight};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 0.3rem 0 0;
  }

  span {
    display: inline-block;
    margin: 0 1.5rem 0 0;
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      margin: 0 0.75rem 0 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
`

const MenuItemPrice = styled('span')`
  color: ${(props) => props.theme.fonts.headings.color};
  font-weight: ${(props) => props.theme.boldWeight};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.fonts.sizes.small};
    font-weight: ${(props) => props.theme.fonts.body.weight};
  }
`

const MenuItemCals = styled('span')`
  color: ${(props) => props.theme.fonts.body.color};
  font-weight: ${(props) => props.theme.boldWeight};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.fonts.sizes.small};
    font-weight: ${(props) => props.theme.fonts.body.weight};
  }
`

const MenuItemAllergens = styled('span')`
  color: ${(props) => props.theme.colors.alert};
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none !important;
  }
`

const MenuItemTags = styled('span')`
  color: ${(props) => props.theme.fonts.body.color};
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none !important;
  }
`

const MenuItem = ({ item }) => {
  const dispatch = useDispatch()
  const { soldOut, menuConfig, allergenAlerts } = useContext(MenuContext)
  const {
    menuImages: showImage,
    calories: showCals,
    tags: showTags,
    allergens: showAllergens,
  } = useSelector(selectDisplaySettings)
  const soldOutMsg = menuConfig.soldOutMessage || 'Sold out for day'
  const cartCounts = useSelector(selectCartCounts)
  const isSoldOut = soldOut.includes(item.id)
  const cartCount = cartCounts[item.id] || 0
  const smallImg =
    item.small_image_url || item.app_image_url || item.big_image_url
  const imageUrl = showImage ? smallImg : null
  const price = makeDisplayPrice(item)
  const cals =
    showCals && item.nutritional_info
      ? parseInt(item.nutritional_info.calories) || null
      : null
  const allergens = showAllergens ? convertStringToArray(item.allergens) : []
  const tags = showTags ? convertStringToArray(item.tags) : []
  const allergenAlert = allergens.length
    ? allergens.filter((allergen) => allergenAlerts.includes(allergen))
    : []
  const hasAllergens = allergenAlert.length > 0

  const handleClick = (evt) => {
    evt.preventDefault()
    if (!isSoldOut) {
      dispatch(setCurrentItem(item))
      dispatch(openModal({ type: 'item', args: { focusFirst: true } }))
    }
  }

  const itemTag = isSoldOut ? (
    <Tag icon={iconMap.Slash} text={soldOutMsg} bgColor="alert" />
  ) : hasAllergens ? (
    <Tag
      icon={iconMap.AlertCircle}
      text={`Contains ${allergenAlert.join(', ')}`}
      bgColor="error"
    />
  ) : null

  return (
    <MenuItemView>
      <MenuItemContainer>
        {cartCount > 0 && <MenuItemCount>{cartCount}</MenuItemCount>}
        {!showImage && itemTag ? (
          <MenuItemAlert>{itemTag}</MenuItemAlert>
        ) : null}
        <MenuItemButton onClick={handleClick} isSoldOut={isSoldOut}>
          {showImage && (
            <MenuItemImage imageUrl={imageUrl}>
              {itemTag && (
                <MenuItemOverlay isSoldOut={isSoldOut}>
                  <div>{itemTag}</div>
                </MenuItemOverlay>
              )}
            </MenuItemImage>
          )}
          <MenuItemContent>
            <MenuItemName>
              <Heading>{item.name}</Heading>
            </MenuItemName>
            {item.description && (
              <MenuItemDescription>{item.description}</MenuItemDescription>
            )}
            <MenuItemDetails>
              {price && <MenuItemPrice>{price}</MenuItemPrice>}
              {cals && <MenuItemCals>{cals} cals</MenuItemCals>}
              {allergens.length > 0 && (
                <MenuItemAllergens>{allergens.join(', ')}</MenuItemAllergens>
              )}
              {tags.length > 0 && (
                <MenuItemTags>{tags.join(', ')}</MenuItemTags>
              )}
            </MenuItemDetails>
          </MenuItemContent>
        </MenuItemButton>
      </MenuItemContainer>
    </MenuItemView>
  )
}

MenuItem.displayName = 'MenuItem'
MenuItem.propTypes = {
  item: propTypes.object,
}

export default MenuItem
