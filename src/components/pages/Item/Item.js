import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { isMobile } from 'react-device-detect'
import styled from '@emotion/styled'
import {
  selectCurrentItem,
  setCurrentItem,
  selectMenuSlug,
} from '@open-tender/redux'
import { selectMenuPath } from '../../../slices'
import {
  BackgroundImage,
  Content,
  Main,
  MenuItem,
  MenuItemTagImages,
  ScreenreaderTitle,
} from '../..'
import { MenuHeader } from '../Menu'
import { MenuContext } from '../Menu/Menu'
import { imageTagnames } from '../../MenuItemTagImages'

const ItemPageView = styled.div`
  label: ItemPageView;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`

const ItemPageImage = styled.div`
  flex: 1 1 auto;
  height: 100%;
  display: flex;
  background-color: ${(props) => props.theme.bgColors.tertiary};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none;
  }
`

const ItemPageContent = styled.div`
  flex: 0 0 ${(props) => props.theme.item.desktop.maxWidth};
  width: ${(props) => props.theme.item.desktop.maxWidth};
  height: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.bgColors.primary};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    flex: 1 1 auto;
  }
`

const TagImageContainer = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 4rem;
  right: 5rem;
`

const Item = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { siteTitle } = useContext(MenuContext)
  const menuPath = useSelector(selectMenuPath)
  const menuSlug = useSelector(selectMenuSlug)
  const item = useSelector(selectCurrentItem)
  const style = isMobile
    ? { height: '100%', paddingTop: 0 }
    : { height: '100%' }

  const cancel = () => {
    dispatch(setCurrentItem(null))
  }

  useEffect(() => {
    if (!item) navigate(menuPath || menuSlug)
  }, [item, navigate, menuSlug, menuPath])

  if (!item) return null

  const imageTags = item.tags.filter(t => imageTagnames.includes(t))

  return (
    <>
      <Helmet>
        <title>
          Menu - {item.name} | {siteTitle}
        </title>
      </Helmet>
      <Content hasFooter={false}>
        {!isMobile && <MenuHeader backClick={cancel} />}
        <Main style={style}>
          <ScreenreaderTitle>{item.name}</ScreenreaderTitle>
          <ItemPageView>
            <ItemPageImage>
              <BackgroundImage imageUrl={item.imageUrl}>
                { !!imageTags.length && <>
                  <TagImageContainer>
                    <MenuItemTagImages tags={imageTags} imageSize={'7rem'}/>
                  </TagImageContainer>
                </> }
              </BackgroundImage>
            </ItemPageImage>
            <ItemPageContent>
              <MenuItem
                cancel={cancel}
                showBack={isMobile}
                showClose={false}
                showImage={isMobile}
              />
            </ItemPageContent>
          </ItemPageView>
        </Main>
      </Content>
    </>
  )
}

Item.displayName = 'Item'

export default Item
