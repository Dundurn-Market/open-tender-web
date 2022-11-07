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
  margin: ${(props) => props.theme.layout.margin} 0;
  ${(props) => props.hasTop ? '' : `margin-top: ${props.theme.layout.padding}`};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: ${(props) => props.theme.layout.marginMobile} 0;
    ${(props) =>
      props.hasTop ? '' : `margin-top: ${props.theme.layout.paddingMobile};`}
  }
`

const MenuBrowseHeader = styled.div`
  padding: 0 0 1rem;
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
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-height: 60rem;
    overflow: scroll;
  }
`

const MenuBrowseVertical = styled.div`
  display: grid;
  justify-content: center;
  padding: 0;
  margin: 2rem 0 0;
  gap: ${(props) => props.theme.layout.padding};
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1350px) {
    grid-template-columns: repeat(3, 1fr);
  }
  // @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
  //   grid-template-columns: repeat(2, 1fr);
  // }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${(props) => props.theme.layout.paddingMobile};
  }
  @media (max-width: 650px) {
    margin: 1rem 0 0;
    column-gap: 1.5rem;
    row-gap: ${(props) => props.theme.layout.paddingMobile};
    grid-template-columns: repeat(2, 1fr);
  }
`

const MenuBrowse = ({ categories, isRcs }) => {
  const { hasTop, displaySettings } = useContext(MenuContext)
  const { categoryType, categoryTypeMobile } = displaySettings
  const displayType = isMobile ? categoryTypeMobile : categoryType

  if (!categories || !categories.length) return null

  return (
    <Container>
      <MenuBrowseView id="full-menu" hasTop={hasTop}>
        {hasTop && (
          <MenuBrowseHeader>
            <MenuBrowseTitle>
              Categories
            </MenuBrowseTitle>
          </MenuBrowseHeader>
        )}
        {displayType === 'VERTICAL' ? (
          <MenuBrowseVertical>
            {categories.map((category, index) => (
              <MenuBrowseSquare
                key={category.name}
                category={category}
                isLast={categories.length - 1 === index}
              />
            ))}
          </MenuBrowseVertical>
        ) : (
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
