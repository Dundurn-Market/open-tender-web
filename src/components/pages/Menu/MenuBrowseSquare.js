import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { slugify, stripTags } from '@open-tender/js'
import {
  selectMenuSlug,
  setCurrentCategory,
  setCurrentVendor,
} from '@open-tender/redux'
import { CardMenuItem, BgImage, Body, Heading } from '@open-tender/components'

const MenuBrowseSquareView = styled(CardMenuItem)`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const MenuBrowseSquareButton = styled.button`
  flex-grow: 1;
  display: block;
  text-align: left;
  width: 100%;
`

const MenuBrowseSquareContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MenuBrowseSquareImage = styled(BgImage)`
  width: 100%;
  padding: 33.33333% 0;
  background-color: ${(props) => props.theme.bgColors.tertiary};
  border-radius: ${(props) => props.theme.cards.menuItem.borderRadius};
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
`

const MenuBrowseSquareContent = styled.div`
  padding: ${(props) =>
    props.theme.cards.default.bgColor === 'transparent'
      ? '1.1rem 0 0'
      : '1.3rem 1.3rem 1.2rem'};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: ${(props) =>
      props.theme.cards.default.bgColor === 'transparent'
        ? '0.8rem 0 0'
        : '1rem 1rem 0.8rem'};
  }
`

const MenuBrowseSquareTitle = styled(Heading)`
  font-size: ${(props) => props.theme.fonts.sizes.big};
  font-family: "Full Mrkt Font";
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.fonts.sizes.main};
  }
`

const MenuBrowseSquareDescription = styled(Body)`
  margin: 0.5rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
    margin: 0.5rem 0 0;
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const MenuBrowseSquare = ({ category, isLast = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const menuSlug = useSelector(selectMenuSlug)
  const {
    name,
    description,
    small_image_url,
    large_image_url,
    app_image_url,
    revenue_center_id,
  } = category
  const imageUrl = app_image_url || small_image_url || large_image_url
  const bgStyle = imageUrl ? { backgroundImage: `url(${imageUrl}` } : null
  const desc = description ? stripTags(description) : null

  const view = (evt) => {
    evt.preventDefault()
    if (revenue_center_id) {
      dispatch(setCurrentVendor(category))
      navigate(`${menuSlug}/vendor/${slugify(category.name)}`)
    } else {
      dispatch(setCurrentCategory(category))
      navigate(`${menuSlug}/category/${slugify(category.name)}`)
    }
  }

  return (
    <MenuBrowseSquareView>
      <MenuBrowseSquareButton onClick={view}>
        <MenuBrowseSquareContainer>
          <MenuBrowseSquareImage style={bgStyle} />
          <MenuBrowseSquareContent>
            <MenuBrowseSquareTitle as="p">{name}</MenuBrowseSquareTitle>
            {desc && (
              <MenuBrowseSquareDescription as="p">
                {desc}
              </MenuBrowseSquareDescription>
            )}
          </MenuBrowseSquareContent>
        </MenuBrowseSquareContainer>
      </MenuBrowseSquareButton>
    </MenuBrowseSquareView>
  )
}

MenuBrowseSquare.displayName = 'MenuBrowseSquare'
MenuBrowseSquare.propTypes = {
  category: propTypes.object,
}
export default MenuBrowseSquare
