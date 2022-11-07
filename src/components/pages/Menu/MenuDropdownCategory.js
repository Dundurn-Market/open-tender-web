import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { slugify } from '@open-tender/js'
import {
  selectMenuSlug,
  setCurrentCategory,
  setCurrentVendor,
} from '@open-tender/redux'
import { BgImage, Heading } from '@open-tender/components'

const MenuBrowseCategoryView = styled.div`
  width: 12.5%;
  padding: 0 2rem 2rem 0;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    width: 33.3%;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: 0;
  }
`

const MenuBrowseCategoryButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) => props.theme.bgColors.tertiary};
  border-radius: 6px;
  border: .1rem solid ${(props) => props.theme.border.color};
  // border-style: solid;
  // border-color: ${(props) => props.theme.border.color};
  // border-bottom-width: ${(props) => props.theme.border.width};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    border-radius: 0;
    border: none;
    border-bottom: .1rem solid ${(props) => props.theme.border.color};
    background-color: transparent;
  }
  
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    //padding: 1rem 0;
  }
  
  :hover {
    transform: scale(1.10);
  }
`

const MenuBrowseCategoryImage = styled(BgImage)`
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  background-size: cover;
  transition: ${(props) => props.theme.links.transition};
  background-color: ${(props) => props.theme.bgColors.tertiary};
  border-radius: ${(props) => props.theme.border.radiusSmall};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 4rem;
    height: 4rem;
  }
`

const MenuBrowseCategoryText = styled.span`
  flex-grow: 1;
  line-height: ${(props) => props.theme.fonts.body.lineHeight};
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1.5rem;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0 2rem;
  }
`

const MenuBrowseCategoryTitle = styled(Heading)`
  display: block;
  margin: 0 0 0 -0.1rem;
  transition: ${(props) => props.theme.links.transition};
  font-size: ${(props) => props.theme.fonts.sizes.small};
  font-family: 'Full Mrkt Font';
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    
  }
`

const MenuDropdownCategory = ({ category, onClickOverride = null, onClickCallback }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const menuSlug = useSelector(selectMenuSlug)
  const {
    name,
    small_image_url,
    large_image_url,
    app_image_url,
    revenue_center_id,
  } = category
  const imageUrl = app_image_url || small_image_url || large_image_url
  const bgStyle = imageUrl ? { backgroundImage: `url(${imageUrl}` } : null

  const view = onClickOverride || ((evt) => {
    evt.preventDefault()
    if (revenue_center_id) {
      dispatch(setCurrentVendor(category))
      navigate(`${menuSlug}/vendor/${slugify(category.name)}`)
    } else {
      dispatch(setCurrentCategory(category))
      navigate(`${menuSlug}/category/${slugify(category.name)}`)
    }
    if (onClickCallback) onClickCallback()
  })

  return (
    <MenuBrowseCategoryView>
      <MenuBrowseCategoryButton onClick={view}>
        <MenuBrowseCategoryImage style={bgStyle}/>
        <MenuBrowseCategoryText>
          <MenuBrowseCategoryTitle>{name}</MenuBrowseCategoryTitle>
        </MenuBrowseCategoryText>
      </MenuBrowseCategoryButton>
    </MenuBrowseCategoryView>
  )
}

MenuDropdownCategory.displayName = 'MenuDropdownCategory'
MenuDropdownCategory.propTypes = {
  category: propTypes.object,
}
export default MenuDropdownCategory
