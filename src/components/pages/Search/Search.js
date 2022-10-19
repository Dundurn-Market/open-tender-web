import { Helmet } from 'react-helmet'
import { Container, Content, Main, ScreenreaderTitle } from '../../index'
import MenuHeader from '../Menu/MenuHeader'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { MenuContext } from '../Menu/Menu'
import debounce from 'lodash/debounce'
import { MenuItem, MenuItems } from '../Menu'
import { XCircle } from '../../icons'

const SearchContainer = styled.div`
  margin: 5rem 30%;
  display: flex;
  justify-content: center;
  position: relative;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 5rem 15%;
  }
  
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 2rem 2rem;
  }
`

const SearchBar = styled.input`
  padding: 1.5rem;
  font-size: 20px;
  background-color:white;
  border-radius: 6px;
  border: .1rem  solid ${(props) => props.theme.border.color};
  border-bottom: .2rem solid ${(props) => props.theme.border.color};
  
  :focus {
    outline: none;
    background-color: white;
  }
`

const ClearSearchButton = styled.button`
  position: absolute;
  z-index: 8;
  right: 10px;
  top: 15px;
  height: 2.3rem;
  width: 2.3rem;
`

const Search = () => {
  const navigate = useNavigate()
  const searchBar = useRef(null)
  const {menuItems} = useContext(MenuContext)
  const [filteredItems, setFilteredItems] = useState([])
  const updateSearch = useRef(debounce((query) => {
    if (query.length === 0) {
      setFilteredItems([])
    } else {
      const items = menuItems.filter((item) => (
        item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
        item.category_name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
        item.tags.toLowerCase().indexOf(query.toLowerCase()) > -1
      ))
      setFilteredItems(items)
    }
  }, 250)).current

  const clearSearch = () => {
    searchBar.current.value = ''
    setFilteredItems([])
    searchBar.current.focus()
  }

  useEffect(() => {
    return () => {
      updateSearch.cancel()
    }
  }, [updateSearch])

  useEffect(() => {
    searchBar.current.focus()
  }, [navigate])

  return (
    <>
      <Helmet>
        <title>Search</title>
      </Helmet>
      <Content>
        <MenuHeader backClick={() => navigate(-1)} />
        <Main>
          <ScreenreaderTitle>Search</ScreenreaderTitle>
          <SearchContainer>
            <SearchBar onInput={(e) => updateSearch(e.target.value)} ref={searchBar} placeholder='Search For Products..' />
            <ClearSearchButton onClick={clearSearch}><XCircle/></ClearSearchButton>
          </SearchContainer>
          <Container style={{marginBottom: '2rem'}}>
            { filteredItems.length > 0 ? (
              <MenuItems>
                {filteredItems.map(item => (
                  <MenuItem item={item} />
                ))}
              </MenuItems>
            ): searchBar.current && searchBar.current.value.length !== 0 ? (
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <h4>No Products Found..</h4>
              </div>
            ): (
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <h4>Just start typing in the search bar to search!</h4>
              </div>
            )}

          </Container>
          {/*<MenuNewView>*/}
          {/*  <MenuAnnouncements ref={heroRef}>*/}
          {/*    <PageHero*/}
          {/*      announcements={announcements}*/}
          {/*      height={heroHeight}*/}
          {/*      imageUrl={imageUrl}*/}
          {/*    />*/}
          {/*  </MenuAnnouncements>*/}
          {/*  {isLoading ? (*/}
          {/*    <MenuLoading>*/}
          {/*      <Loading text={loadingMessage} />*/}
          {/*    </MenuLoading>*/}
          {/*  ) : (*/}
          {/*    <>*/}
          {/*      {!isScrollable && (*/}
          {/*        <MenuBrowse*/}
          {/*          isRcs={isRcs}*/}
          {/*          categories={revenueCenters || categories}*/}
          {/*        />*/}
          {/*      )}*/}
          {/*      <MenuTop />*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</MenuNewView>*/}
        </Main>
      </Content>
    </>
  )
}

Search.displayName = 'Search'

export default Search