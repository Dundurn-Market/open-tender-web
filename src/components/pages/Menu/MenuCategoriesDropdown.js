import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'

import { slugify }from '@open-tender/js'
import { remToPx, scrollToId } from '../../../utils'
import { Container } from '../..'
import { ChevronLeftCircle } from '../../icons'
import MenuBrowseCategory from './MenuBrowseCategory'

const MenuCategoriesDropdownView = styled.div`
  position: fixed;
  z-index: 12;
  top: ${(props) => props.theme.layout.navHeight};
  left: 0;
  right: 0;
  padding: 2rem 0 0 0;
  transition: all 0.125s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  transform: translateY(${(props) => (props.show ? '0' : '-100%')});
  background-color: ${(props) => props.theme.bgColors.primary};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    top: ${(props) => props.theme.layout.navHeightMobile};
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

const CategoryBrowseView = styled.div`
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: ${(props) => props.theme.layout.marginMobile} 0;
  }
`

const CategoryBrowseGrid = styled.div`
  display: flex;
  overflow: auto;
  max-height: calc(100vh - ${(props) => props.theme.layout.navHeight});
  padding: 1rem 2rem 2rem;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0;
`

const BackImage = styled.div`
  flex-shrink: 0;
  height: 7rem;
  padding: 2rem;
  line-height: 0;
  background-size: cover;
  transition: ${(props) => props.theme.links.transition};
  background-color: ${(props) => props.theme.bgColors.tertiary};
  border-radius: ${(props) => props.theme.border.radiusSmall};
`

const CategoryBrowse = ({ children }) => {
  if (!children || !children.length) return null

  return (
    <Container>
      <CategoryBrowseView>
        <CategoryBrowseGrid>
          { children }
        </CategoryBrowseGrid>
      </CategoryBrowseView>
    </Container>
  )
}

const resolveCurrentCategory = (categories, location) => {
  const splitPath = location.pathname.split('/')
  const slug = splitPath[splitPath.length - 1]

  const category = categories.find((c) => slugify(c.name) === slug)
  return category === undefined ? null : category
}

const MenuCategoriesDropdown = ({
  categories,
  showCategories,
  setShowCategories
}) => {
  const location = useLocation()
  const theme = useTheme()

  const [elements, setElements] = useState([])
  const active = useRef(null)
  const categoryDropdown = useRef(null)
  const subCategoryDropdown = useRef(null)
  const firstCategory = useRef(null)
  const lastCategory = useRef(null)
  const firstSubCategory = useRef(null)
  const lastSubCategory = useRef(null)

  const [parentCategory, setParentCategory] = useState(
    resolveCurrentCategory(categories, location)
  )
  const [showSubCategories, setShowSubCategories] = useState(!!parentCategory)
  const [subCategories, setSubCategories] = useState([])

  const handleKeys = useCallback(
    (evt) => {
      if (typeof document === 'undefined') return
      if (evt.keyCode === 9) {
        const ae = document.activeElement
        if (!elements.some(e => e === ae) && firstCategory.current) {
          firstCategory.current.focus()
        }

        if (!evt.shiftKey) {
          if (lastCategory.current && ae === lastCategory.current) {
            if (firstCategory.current) firstCategory.current.focus()
            evt.preventDefault()
          }
          if (lastSubCategory.current && ae === lastSubCategory.current) {
            if (firstSubCategory.current) firstSubCategory.current.focus()
            evt.preventDefault()
          }
        }

        if (evt.shiftKey) {
          if (firstCategory.current && ae === firstCategory.current) {
            if (lastCategory.current) lastCategory.current.focus()
            evt.preventDefault()
          }
          if (firstSubCategory.current && ae === firstSubCategory.current) {
            if (lastSubCategory.current) lastSubCategory.current.focus()
            evt.preventDefault()
          }
        }
      } else if (evt.keyCode === 27) {
        setShowCategories(false)
      }
    },
    [elements, firstCategory, lastCategory, firstSubCategory, lastSubCategory]
  )

  useEffect(() => {
    if (showCategories === false) {
      setShowSubCategories(!!parentCategory)
      return
    }
    if (showSubCategories === false && firstCategory.current) {
      firstCategory.current.focus()
    }

    const allElements = [
      ...categoryDropdown.current.querySelectorAll('button'),
      ...subCategoryDropdown.current.querySelectorAll('button'),
    ]
    setElements(allElements)
  }, [showCategories, showSubCategories])

  useEffect(() => {
    if (parentCategory === null) return
    if (parentCategory.children === undefined) return
    setSubCategories(parentCategory.children)
  }, [parentCategory])

  useEffect(() => {
    document.addEventListener('keydown', handleKeys, false)
    return () => document.removeEventListener('keydown', handleKeys, false)
  }, [handleKeys])

  const handleFocus = () => {
    active.current = document.activeElement
    if (firstCategory.current) firstCategory.current.focus()
    if (showSubCategories && firstSubCategory.current) {
      firstSubCategory.current.focus()
    }
  }

  const handleExit = () => {
    if (active.current) active.current.focus()
  }

  const closeDropdown = () => setShowCategories(false)

  const handleBackCategoryClick = () => {
    setShowSubCategories(false)
    if (firstCategory.current) firstCategory.current.focus()
  }

  const handleCategoryClick = (category) => () => {
    if (!category.children || !category.children.length) {
      setShowCategories(false)
    } else setShowSubCategories(true)
    setParentCategory(category)
  }

  const handleSubCategoryClick = (subCategory) => () => {
    setShowCategories(false)

    const yOffset = remToPx(theme.layout.navHeight) * 1.2
    scrollToId(slugify(subCategory.name), yOffset)
  }

  const openSubcategories = (
    showCategories &&
    showSubCategories &&
    parentCategory &&
    subCategories &&
    subCategories.length
  )
  const openCategories = showCategories && !openSubcategories

  return (
    <>
      <MenuCategoriesDropdownView ref={categoryDropdown} show={openCategories}>
        <CategoryBrowse>
          {categories.map((category, index) => (
            <MenuBrowseCategory
              key={category.name}
              category={category}
              isLast={categories.length - 1 === index}
              buttonRef={
                index === 0 ? firstCategory : (
                  index === categories.length - 1 ? lastCategory : undefined
                )
              }
              onClickCallback={handleCategoryClick(category)}
            />
          ))}
        </CategoryBrowse>
      </MenuCategoriesDropdownView>
      <MenuCategoriesDropdownView
        ref={subCategoryDropdown}
        show={openSubcategories}
      >
        <CategoryBrowse>
          {!!parentCategory &&
            <MenuBrowseCategory
              category={parentCategory}
              name={'All categories'}
              image={
                <BackImage>
                  <ChevronLeftCircle size={remToPx('3rem')}/>
                </BackImage>
              }
              isLast={false}
              buttonRef={firstSubCategory}
              onClickCallback={handleBackCategoryClick}
              preventDefault={true}
            />
          }
          {!!parentCategory && !!parentCategory.items.length &&
            <MenuBrowseCategory
              category={parentCategory}
              isLast={false}
              onClickCallback={handleSubCategoryClick(parentCategory)}
              preventDefault={true}
            />
          }
          {!!subCategories && subCategories.map((subCategory, index) => (
            <MenuBrowseCategory
              key={subCategory.name}
              category={subCategory}
              isLast={subCategories.length - 1 === index}
              buttonRef={
                index === subCategories.length - 1 ? lastSubCategory : undefined
              }
              onClickCallback={handleSubCategoryClick(subCategory)}
              preventDefault={true}
            />
          ))}
        </CategoryBrowse>
      </MenuCategoriesDropdownView>
      <TransitionGroup component={null}>
        {showCategories ? (
          <CSSTransition
            key="mobile-menu-overlay"
            classNames="overlay"
            timeout={250}
            onEntered={handleFocus}
            onExit={handleExit}
          >
            <MenuCategoriesDropdownOverlay
              onClick={closeDropdown}
            />
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </>
  )
}

export default MenuCategoriesDropdown
