import styled from '@emotion/styled'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { MenuBrowseCategories } from './MenuBrowse'
import MenuDropdownCategory from './MenuDropdownCategory'

const MenuCategoriesDropdownView = styled.div`
  position: fixed;
  z-index: 12;
  top: ${(props) => props.theme.layout.navHeight};
  left: 0;
  right: 0;
  padding: 2rem 2rem 0 2rem;
  transition: all 0.125s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  transform: translateY(${(props) => (props.show ? '0' : '-100%')});
  background-color: ${(props) => props.theme.bgColors.primary};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    top: ${(props) => props.theme.layout.navHeightMobile};
    left: 5.75rem;
    width: 20rem;
    padding: 0;
  }
`

const MenuCategoriesDropdownOverlay = styled.div`
  position: fixed;
  z-index: 11;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.overlay.dark};
`

const MenuCategoriesDropdown = ({ categories, showCategories, setShowCategories }) => {

  return (
    <>
      <MenuCategoriesDropdownView show={showCategories}>
        <MenuBrowseCategories>
          {categories.map((category, index) => (
            <MenuDropdownCategory
              key={category.name}
              category={category}
              onClickCallback={() => setShowCategories(false)}
            />
          ))}
        </MenuBrowseCategories>
      </MenuCategoriesDropdownView>
      <TransitionGroup component={null}>
        {showCategories ? (
          <CSSTransition
            key="mobile-menu-overlay"
            classNames="overlay"
            timeout={250}
          >
            <MenuCategoriesDropdownOverlay onClick={() => setShowCategories(false)} />
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </>
  )
}

export default MenuCategoriesDropdown