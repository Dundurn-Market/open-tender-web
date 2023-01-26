import { useContext } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { isMobile } from 'react-device-detect'
import { Heading } from '@open-tender/components'
import { Container } from '../..'
import { MenuContext } from './Menu'
import MenuBrowseCategory from './MenuBrowseCategory'
import MenuBrowseSquare from './MenuBrowseSquare'

const MenuBrowseView = styled.div`
  ${(props) => props.hasTop ? '' : `margin-top: ${props.theme.layout.padding}`};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: ${(props) => props.theme.layout.marginMobile} 0;
    ${(props) =>
      props.hasTop ? '' : `margin-top: ${props.theme.layout.paddingMobile};`}
  }
`

const MenuBrowseHeader = styled.div`
  padding: 0 0 1rem;
  margin: 0 0 2rem 0;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    // border: 0;
    // border-style: solid;
    // border-color: ${(props) => props.theme.buttons.colors.large.borderColor};
    // border-bottom-width: ${(props) =>
      props.theme.buttons.sizes.large.borderWidth};
  }
`

const MenuBrowseTitle = styled(Heading)`
  line-height: 1;
  margin-bottom: 2rem;
  font-size: ${(props) => props.theme.fonts.sizes.xBig};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.fonts.sizes.big};
  }
`

export const MenuBrowseCategories = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0;
`

export const MenuBrowseCategoriesCollapsed = styled.div`
  display: flex;
  overflow: scroll;
  max-height: calc(100vh - ${(props) => props.theme.layout.navHeight});
  padding: 1rem 2rem 8rem;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0;
`

const MenuBrowse = ({ categories, isRcs, collapsed = false }) => {
  const { hasTop, displaySettings } = useContext(MenuContext)
  const { categoryType, categoryTypeMobile } = displaySettings
  const displayType = isMobile ? categoryTypeMobile : categoryType

  if (!categories || !categories.length) return null

  return (
    <Container>
      <MenuBrowseView id="full-menu" hasTop={hasTop}>
        {hasTop && !collapsed && (
          <MenuBrowseHeader>
            <MenuBrowseTitle>
              Categories
            </MenuBrowseTitle>
          </MenuBrowseHeader>
        )}
        {collapsed ? (
          <MenuBrowseCategoriesCollapsed>
            {categories.map((category, index) => (
              <MenuBrowseCategory
                key={category.name}
                category={category}
                isLast={categories.length - 1 === index}
              />
            ))}
          </MenuBrowseCategoriesCollapsed>) : (
          <MenuBrowseCategories>
            {categories.map((category, index) => (
              <MenuBrowseCategory
                key={category.name}
                category={category}
                isLast={categories.length - 1 === index}
              />
            ))}
          </MenuBrowseCategories>
        )}
      </MenuBrowseView>
    </Container>
  )
}

MenuBrowse.displayName = 'MenuBrowse'
MenuBrowse.propTypes = {
  categories: propTypes.array,
  isRcs: propTypes.bool,
}

export default MenuBrowse
