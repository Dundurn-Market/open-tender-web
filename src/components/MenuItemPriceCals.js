import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { Body, Heading } from '@open-tender/components'

const MenuItemPriceCalsView = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const MenuItemPrice = styled(Heading)`
  // line-height: 1;
  font-size: ${(props) => props.theme.fonts.sizes[props.size]};
`

const MenuItemCals = styled(Body)`
  // line-height: 1;
  font-size: ${(props) => props.theme.fonts.sizes[props.size]};

  span {
    padding: 0 0.4rem;
  }
`

const MenuItemPriceCals = ({
  price,
  cals,
  size = 'small',
  children,
  style,
}) => {
  return (
    <MenuItemPriceCalsView style={style}>
      {price ? <MenuItemPrice size={size}>{price}</MenuItemPrice> : null}
      {cals ? (
        <MenuItemCals size={size}>
          {price ? <span>&mdash;</span> : null}
          {cals} Cal
        </MenuItemCals>
      ) : null}
      {children}
    </MenuItemPriceCalsView>
  )
}

MenuItemPriceCals.displayName = 'MenuItemPriceCals'
MenuItemPriceCals.propTypes = {
  price: propTypes.string,
  cals: propTypes.oneOfType([propTypes.string, propTypes.number]),
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]),
  style: propTypes.object,
}

export default MenuItemPriceCals
