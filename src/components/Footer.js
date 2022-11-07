import styled from '@emotion/styled'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '.'
import logo from '../assets/logo_footer.png'
import bcorpLogo from '../assets/bcorp.png'
import packageJson from '../../package.json'
import { selectBrand, selectSettings } from '../slices'
import { useSelector } from 'react-redux'

const FooterView = styled('footer')`
  position: relative;
  z-index: 1;
  width: 100%;
  color: ${(props) => props.theme.colors.light};
  background-color: ${(props) => props.theme.bgColors.dark};
`

const FooterContainer = styled.div`
  height: 20rem;
  padding: ${(props) => props.theme.layout.margin} 0
    ${(props) => props.theme.layout.padding};
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    // padding: ${(props) => props.theme.layout.padding} 0;
    // align-items: flex-start;
  }
`

const FooterContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    // justify-content: flex-start;
  }
`

const FooterNav = styled.div``

const FooterLogo = styled.a`
  display: inline-block;
  height: 3.2rem;
  margin: 0 2rem 1rem 0;
  font-family: "Full Mrkt Font";
  color: white;
  font-size: 40px;
  text-decoration: none;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 2.2rem;
  }

  img {
    display: inline-block;
    width: auto;
    height: 100%;
    pointer-events: none;
  }
`

const FooterLinks = styled.ul`
  margin: 2rem 0 0;
  display: flex;
  font-size: ${(props) => props.theme.fonts.sizes.small};

  li {
    display: block;
    margin: 0 3rem 0 0;
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      margin: 0 2rem 0 0;
    }

    &:last-of-type {
      margin-right: 0;
    }

    a {
      text-decoration: none;
      color: ${(props) => props.theme.links.light.color};
    }

    a:hover,
    a:active,
    a:focus {
      color: ${(props) => props.theme.links.light.hover};
    }
  }
`

const FooterTerms = styled.nav`
  margin: 1rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 1rem 0 2rem;
  }

  ul li {
    float: left;
    margin: 1.5rem 2rem 0 0;
    &:last-child {
      margin-right: 0;
    }

    a {
      text-decoration: none;
      color: ${(props) => props.theme.links.light.color};
    }

    a:hover,
    a:active,
    a:focus {
      color: ${(props) => props.theme.links.light.hover};
    }
  }
`

const FooterOTLogo = styled.div`
  max-width: 14rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    text-align: left;
  }

  span {
    opacity: 0.3;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: 0;
    }
    a, a:visited, a:hover, a:active, a:focus {
      @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        font-size: ${(props) => props.theme.fonts.sizes.xSmall};
      }
      color: inherit;
      text-decoration: none;
    }
  }
  
  img {
    height: 9rem;
    margin-bottom: 1rem;
  }

  // > div > img {
  //  display: block;
  //  margin: 0.5rem -0.2rem 0 0;
  //  pointer-events: none;
  //}
`

const Footer = ({ hasRouter = true }) => {
  const { logoLight, url, has_gift_cards, has_donations } =
    useSelector(selectBrand)
  const { orderTypes = [] } = useSelector(selectSettings)
  const hasGiftCards = has_gift_cards && orderTypes.includes('GIFT_CARDS')
  const hasDonations = has_donations && orderTypes.includes('DONATIONS')

  return (
    <FooterView role="contentinfo">
      <Container>
        <FooterContainer>
          <FooterContent>
            <FooterNav>
              {logoLight && (
                <>
                  <FooterLogo href={'/'} rel="noopener noreferrer">
                    MRKTBOX
                    {/*<img src={logoLight} alt="logo" />*/}
                  </FooterLogo>
                  {/*<img src={bcorpLogo} alt={'Bcorp Logo'}/>*/}
                </>
              )}
              {hasRouter && (
                <FooterLinks>
                  {url && (
                    <>
                      <li>
                        <Link to={'/about'}>About Us</Link>
                      </li>
                      <li>
                        <Link to={'/about'}>Our Team</Link>
                      </li>
                      <li>
                        <Link to={'/about'}>Blog</Link>
                      </li>
                    </>
                  )}
                  {hasGiftCards && (
                    <li>
                      <Link to="/gift-cards">Gift Cards</Link>
                    </li>
                  )}
                  {hasDonations && (
                    <li>
                      <Link to="/donations">Donations</Link>
                    </li>
                  )}
                </FooterLinks>
              )}
            </FooterNav>
            <FooterTerms aria-label="Legal Policies Navigation">
              <ul>
                <li>
                  <a
                    href="https://www.opentender.io/terms"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.opentender.io/privacy"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Privacy
                  </a>
                </li>
                {hasRouter && (
                  <>
                    <li>
                      <Link to="/accessibility">Accessibility</Link>
                    </li>
                    <li>
                      <Link to="/refunds">Refunds</Link>
                    </li>
                  </>
                )}
              </ul>
            </FooterTerms>
          </FooterContent>
          <FooterOTLogo>
            <a href='https://www.bcorporation.net/' target='_blank'><img src={bcorpLogo} alt={'Bcorp Logo'}/></a>
            <div>
              <span>powered by <a href='https://opentender.io' target='_blank'>OpenTender</a></span>
            </div>
          </FooterOTLogo>
        </FooterContainer>
      </Container>
    </FooterView>
  )
}

Footer.displayName = 'Footer'

export default Footer
