import { useContext, useState } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile, is } from 'react-device-detect'
import { selectGroupOrder, selectMenuSlug, selectOrder } from '@open-tender/redux'
import { serviceTypeNamesMap } from '@open-tender/js'
import { Preface, Heading } from '@open-tender/components'
import {
  Allergens,
  Back,
  Cart,
  GroupOrderIcon,
  LeaveGroupIcon,
  NavMenu,
} from '../../buttons'
import { ChevronDown, ChevronUp, Grid } from '../../icons'
import { Header } from '../..'
import MenuMobileMenu from './MenuMobileMenu'
import { openModal, selectDisplaySettings } from '../../../slices'
import { Search } from 'react-feather'
import { useLocation, useNavigate } from 'react-router-dom'
import MenuCategoriesDropdown from './MenuCategoriesDropdown'
import { MenuContext } from './Menu'

const MenuHeaderTitleServiceType = styled(Preface)`
  display: block;
  line-height: 1;
  margin: 0.5rem 0 0;
  color: ${(props) => props.theme.buttons.colors.header.color};
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.fonts.sizes.xxSmall};
    text-align: left;
  }
`

const MenuHeaderTitleRevenueCenter = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.4rem 0 0;
  color: ${(props) => props.theme.buttons.colors.header.color};

  > span {
    display: inline-block;
    color: ${(props) => props.theme.buttons.colors.header.color};
  }
`

const MenuHeaderName = styled.span`
  max-width: 24rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    color: ${(props) => props.theme.buttons.colors.header.color};
    font-size: ${(props) => props.theme.fonts.sizes.big};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.xSmall};
    }
  }
`

const MenuHeaderDropdown = styled.span`
  margin: 0.2rem 0 0 0.2rem;
  width: 1.6rem;
  height: 1.6rem;
`

const SearchButton = styled.button`
  border-radius: 2rem;
  border:2px solid black;  /* ${(props) => props.theme.border.color}; */
  padding: .5rem 2rem;
  
  background-color: ${(props) => props.isSearchPage? props.theme.bgColors.toast : 'transparent' };
  color: ${(props) => props.isSearchPage? 'white':'black' };
  display: flex;
  align-items: center;
  
  svg {
    vertical-align: bottom;
  }
  
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    background-color: transparent;
    color: black;
    border: none;
    padding: 0;
    margin-right: -.3rem;
    font-size: 0;
  }
`

const Categories = styled.button`
  display: flex;
  font-size:2rem;
  font-family: "Full Mrkt Font";

  //margin-left: 1rem;
  //padding: 0 1rem;
  height: inherit;
  align-items: center;
  

    transition: background-color, color .2s ease;
  background-color: ${(props) => props.showCategories ? props.theme.bgColors.primary : 'transparent'};
  padding-bottom: ${(props) => props.showCategories ? '1px': 'none'};
  margin-bottom: ${(props) => props.showCategories ? '-1px': 'none'};
  margin-left: 1.8rem;
  border-left: ${(props) => props.showCategories ? '1px solid '+props.theme.border.color: 'none'};
  border-right: ${(props) => props.showCategories ? '1px solid '+props.theme.border.color: 'none'};
  padding: ${(props) => props.showCategories ? '0 .9rem': '0 1rem'};
  
  :hover {
    background-color: ${(props) => props.theme.bgColors.toast};
    color: white;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    //margin: 0;
    font-size: 0;
    margin-left: 0;
  }
`

const MenuHeaderTitle = ({
  order,
  isGroupOrder,
  cartGuest,
  showMenu,
  toggleShowMenu,
}) => {
  const { serviceType, revenueCenter, prepType } = order
  let serviceTypeName = serviceTypeNamesMap[serviceType]
  serviceTypeName = prepType === 'TAKE_OUT' ? 'Take Out' : serviceTypeName
  const orderTypeName =
    revenueCenter && revenueCenter.revenue_center_type === 'CATERING'
      ? ' Catering '
      : ''

  const toggle = (evt) => {
    evt.preventDefault()
    toggleShowMenu()
  }

  //revenueCenter.

  return revenueCenter ? (
    <>
      <MenuHeaderTitleServiceType>
        {isGroupOrder ? 'Group Order ' : 'Ordering '} {orderTypeName}
        {serviceTypeName}
      </MenuHeaderTitleServiceType>
      <MenuHeaderTitleRevenueCenter onClick={toggle}>
        <MenuHeaderName>
          <Heading>{revenueCenter.name}</Heading>
        </MenuHeaderName>
        {!cartGuest ? (
          <MenuHeaderDropdown>
            {showMenu ? <ChevronUp /> : <ChevronDown />}
          </MenuHeaderDropdown>
        ) : null}
      </MenuHeaderTitleRevenueCenter>
    </>
  ) : null
}

MenuHeaderTitle.displayName = 'MenuHeaderTitle'
MenuHeaderTitle.propTypes = {
  order: propTypes.object,
  isGroupOrder: propTypes.bool,
  showMenu: propTypes.bool,
  setShowMenu: propTypes.func,
}

const MenuHeader = ({ backPath = '/locations', backClick }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { colors, border } = useTheme()
  const [showMenu, setShowMenu] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const { allergens: displayAllergens } = useSelector(selectDisplaySettings)
  const order = useSelector(selectOrder)
  const { revenueCenter } = order
  const showGroupOrdering =
    !isMobile && revenueCenter ? !!revenueCenter.group_ordering : false
  const { isCartOwner, cartGuest, cartId } = useSelector(selectGroupOrder)
  const showAllergens = displayAllergens && !isMobile ? true : false
  const allowLeave = cartGuest && backPath === '/locations'
  const menuSlug = useSelector(selectMenuSlug)
  const path = useLocation().pathname
  const isSearchPage = path.endsWith('/search')
  const { categories } = useContext(MenuContext)

  const leave = () => {
    dispatch(openModal({ type: 'groupOrderLeave' }))
  }

  const search = () => {
    if (isSearchPage) {
      navigate(menuSlug)
    } else {
      navigate(menuSlug + '/search')
    }
  }

  const onClick = allowLeave ? leave : backClick

  const toggleShowCategories = (show) => () => {
    if (showMenu && show) // if we're about to show the categories dropdown and the menu dropdown is showing. close the menu
      setShowMenu(false)
    setShowCategories(show)
  }

  const toggleShowMenu = (show) => () => {
    if (showCategories && show) // if we're about to show the categories dropdown and the menu dropdown is showing. close the menu
      setShowCategories(false)
    setShowMenu(show)
  }

  return (
    <>
      <Header
        style={{ boxShadow: 'none' }}
        title={
          <MenuHeaderTitle
            order={order}
            cartGuest={cartGuest}
            isGroupOrder={!!cartId}
            showMenu={showMenu}
            toggleShowMenu={toggleShowMenu(!showMenu)}
          />
        }
        borderColor={border.color}
        left={
        <>
          { onClick ? <Back onClick={onClick} /> : <Back path={backPath} /> }
          <Categories onClick={toggleShowCategories(!showCategories)} showCategories={showCategories}>
            <Grid size={24} />&nbsp;SHOP
          </Categories>
        </>
        }
        right={
          <>
            <SearchButton onClick={search} isSearchPage={isSearchPage}>
              <Search size={isMobile? 20:16} strokeWidth={2}/>
              <span>&nbsp;Search</span>
            </SearchButton>
            {showAllergens && <Allergens />}
            {showGroupOrdering ? (
              cartGuest ? (
                <LeaveGroupIcon />
              ) : (
                <GroupOrderIcon fill={isCartOwner ? colors.alert : null} />
              )
            ) : null}
            <Cart />
            <NavMenu />
          </>
        }
      />
      <MenuMobileMenu
        order={order}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      <MenuCategoriesDropdown
        showCategories={showCategories}
        setShowCategories={setShowCategories}
        categories={categories}
      />
    </>
  )
}

MenuHeader.displayName = 'MenuHeader'
MenuHeader.propTypes = {
  backPath: propTypes.string,
}

export default MenuHeader
