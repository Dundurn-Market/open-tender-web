import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'

import { fetchLocations } from '@open-tender/redux'

import { selectBrand } from '../../../slices'
import { HeaderSite } from '../..'

const VevScreen = styled.div`
  position: fixed;
  z-index: 1;
  height: 100vh;
  width: 100vw;

  opacity: ${(props) => props.show ? 0 : 1};
  background-color: white;

  transition-property: opacity;
  transition-duration: 1s;
  transition-delay: 600ms;
`

const VevContainer = styled.div`
  position: absolute;
  height: 100hw;
  width: 100vw;
`

const About = () => {
  const dispatch = useDispatch()
  const brand = useSelector(selectBrand)

  const [vevLoaded, setVevLoaded] = useState(false)
  const container = useRef(null)
  const vevScript = useRef(null)
  const vevDelay = useRef(null)

  useEffect(() => {
    dispatch(fetchLocations({type: 'OLO'}))

    if (!vevScript.current) {
      const script = document.createElement('script');
      script.src = "https://embed.vev.page/v1/gqVii9xVtn/p-21isBUPPR?target=vev-container";
      script.onload = () => { setVevLoaded(true) }
      vevScript.current = script
      container.current.appendChild(script)
    }

    return () => {
      vevScript.current.remove()
      if (vevDelay.current !== null) clearTimeout(vevDelay.current)
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>About | {brand.title}</title>
      </Helmet>
      <HeaderSite />
      <VevScreen show={vevLoaded} />
      <VevContainer id='vev-container' ref={container} />
    </>
  )
}

export default About
