import { useContext, useEffect } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { selectCurrentCategory, selectMenuSlug } from '@open-tender/redux'
import { slugify } from '@open-tender/js'
import { Content, Main, ScreenreaderTitle } from '../..'
import { MenuHeader, MenuCategory } from '../Menu'
// import CategoryNav from './CategoryNav'
import { MenuContext } from '../Menu/Menu'
import CategoryBrowse from './CategoryBrowse'

const MenuCategoryView = styled.div`
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    // margin-top: ${(props) => props.theme.layout.navHeightMobile};
    margin-top: 0;
  }
`

const Category = () => {
  const navigate = useNavigate()
  const { siteTitle } = useContext(MenuContext)
  const category = useSelector(selectCurrentCategory)
  const menuSlug = useSelector(selectMenuSlug)
  // const navItems = category.children.map(({ name }) => name)

  useEffect(() => {
    if (!category) navigate(menuSlug)
  }, [category, navigate, menuSlug])

  if (!category) return null

  return (
    <>
      <Helmet>
        <title>
          Menu - {category.name} | {siteTitle}
        </title>
      </Helmet>
      <Content>
        <MenuHeader backPath={menuSlug} />
        <Main>
          <ScreenreaderTitle>{category.name}</ScreenreaderTitle>
          {/*<CategoryBrowse />*/}
          {/* {navItems.length > 0 && <CategoryNav items={navItems} />} */}
          <MenuCategoryView>
            <MenuCategory category={category} />
            {category.children.map((child) => (
              <div key={child.id} id={slugify(child.name)} name="section">
                <MenuCategory category={child} isChild={true} />
              </div>
            ))}
          </MenuCategoryView>
        </Main>
      </Content>
    </>
  )
}

export default Category
