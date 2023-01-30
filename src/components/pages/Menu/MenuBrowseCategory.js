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
  width: 25% ;
  padding: 0 2rem 2rem 0;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    width: 50%;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    padding: 0 1rem 1rem 0;
  }
`

const MenuBrowseCategoryButton = styled.button`
  width: 100%;
  display: flex;
  gap: 2rem;
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) => props.theme.bgColors.tertiary};
  border-radius: 6px;
  border: .1rem solid ${(props) => props.theme.border.color};

  :hover {
    transform: scale(1.05);
  }
`

const MenuBrowseCategoryImage = styled(BgImage)`
  flex-shrink: 0;
  width: 7rem;
  height: 7rem;
  background-size: cover;
  transition: ${(props) => props.theme.links.transition};
  background-color: ${(props) => props.theme.bgColors.tertiary};
  border-radius: ${(props) => props.theme.border.radiusSmall};

  // button:hover & {
  //   transform: scale(1.05);
  //
  //   @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
  //     transform: scale(1);
  //   }
  // }
`

const MenuBrowseCategoryText = styled.span`
  flex-grow: 1;
  line-height: ${(props) => props.theme.fonts.body.lineHeight};
  text-align: left;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0 2rem;
  }
`

const MenuBrowseCategory = ({
  category,
  name,
  image,
  isLast = false,
  buttonRef,
  onClickCallback,
  preventDefault = false,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const menuSlug = useSelector(selectMenuSlug)
  const {
    name : categoryName,
    small_image_url,
    large_image_url,
    app_image_url,
    revenue_center_id,
  } = category
  const imageUrl = app_image_url || small_image_url || large_image_url
  const bgStyle = imageUrl ? { backgroundImage: `url(${imageUrl}` } : null

  const view = (evt) => {
    evt.preventDefault()

    if (!preventDefault) {
      if (revenue_center_id) {
        dispatch(setCurrentVendor(category))
        navigate(`${menuSlug}/vendor/${slugify(category.name)}`)
      } else {
        dispatch(setCurrentCategory(category))
        navigate(`${menuSlug}/category/${slugify(category.name)}`)
      }
    }

    if (onClickCallback)
      onClickCallback()
  }

  const displayName = name ? name : categoryName

  return (
    <MenuBrowseCategoryView>
      <MenuBrowseCategoryButton key={name} ref={buttonRef} onClick={view} isLast={isLast}>
        {!!image ? image : <MenuBrowseCategoryImage style={bgStyle}/>}
        <MenuBrowseCategoryText>
          {displayName}
        </MenuBrowseCategoryText>
      </MenuBrowseCategoryButton>
    </MenuBrowseCategoryView>
  )
}

MenuBrowseCategory.displayName = 'MenuBrowseCategory'
MenuBrowseCategory.propTypes = {
  category: propTypes.object,
}
export default MenuBrowseCategory
