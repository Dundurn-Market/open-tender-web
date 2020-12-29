import React, { useState, useRef, useEffect, useContext } from 'react'
import propTypes from 'prop-types'
import { isMobile } from 'react-device-detect'
import styled from '@emotion/styled'
import { ButtonStyled } from '@open-tender/components'

import { AppContext } from '../App'
import iconMap from './iconMap'
import { NavScroll } from '.'

const NavStickyView = styled('div')`
  width: 100%;
  height: ${(props) => props.theme.layout.navHeight};
`

const NavStickyInner = styled('div')`
  width: 100%;
  background-color: ${(props) => props.theme.bgColors.dark};
  ${(props) =>
    props.stuck &&
    `position: fixed;
      z-index: 10;
      top: ${props.theme.layout.navHeight};
      left: 0;
      right: 0;`}
`

const NavStickyContainer = styled('div')`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const NavStickyFilter = styled('div')`
  height: 100%;
  flex: 0 0;
  padding: 0 0 0 ${(props) => props.theme.layout.padding};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 100%;
    min-height: ${(props) => props.theme.layout.navHeight};
    padding: 0;
    justify-content: center;
  }
`

const NavStickyLogo = styled('div')`
  min-width: 4rem;
  padding: 0;
  margin: 0 2rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};

  img {
    width: auto;
    max-width: none;
    height: ${(props) => props.theme.layout.navHeight} - 2rem;
  }
`

const NavSticky = ({ items, offset = 0, revenueCenter, change }) => {
  const [stuck, setStuck] = useState(false)
  const stickyRef = useRef(null)
  const { windowRef } = useContext(AppContext)
  const topOffset = isMobile ? 60 : 60
  const showNav = !(isMobile && revenueCenter)

  useEffect(() => {
    const winRef = windowRef.current
    const handleScroll = () => {
      if (stickyRef.current) {
        setStuck(stickyRef.current.getBoundingClientRect().top <= topOffset)
      }
    }
    winRef.addEventListener('scroll', handleScroll)
    return () => {
      winRef.removeEventListener('scroll', () => handleScroll)
    }
  }, [windowRef, topOffset])

  const handleChange = (evt) => {
    evt.preventDefault()
    change(null)
    evt.target.blur()
  }

  return (
    <NavStickyView ref={stickyRef}>
      <NavStickyInner stuck={stuck}>
        <NavStickyContainer>
          {revenueCenter && (
            <NavStickyFilter>
              <NavStickyLogo>
                <img
                  src={revenueCenter.app_image_url}
                  alt={revenueCenter.name}
                />
              </NavStickyLogo>
              <div>
                <ButtonStyled
                  icon={iconMap.RefreshCw}
                  onClick={handleChange}
                  size="small"
                  color="secondary"
                >
                  Switch
                </ButtonStyled>
              </div>
            </NavStickyFilter>
          )}
          {showNav && <NavScroll items={items} offset={offset} />}
        </NavStickyContainer>
      </NavStickyInner>
    </NavStickyView>
  )
}

NavSticky.displayName = 'NavSticky'
NavSticky.propTypes = {
  items: propTypes.array,
  offset: propTypes.number,
  revenueCenter: propTypes.object,
  change: propTypes.func,
}

export default NavSticky
