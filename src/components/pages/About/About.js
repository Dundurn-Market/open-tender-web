import { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { scroller } from 'react-scroll'
import { Helmet } from 'react-helmet'
import { fetchLocations } from '@open-tender/redux'
import { selectBrand } from '../../../slices'
import { HeaderSite } from '../..'


const About = () => {
  const dispatch = useDispatch()
  const brand = useSelector(selectBrand)

  const scrollToMenu = () => {
    scroller.scrollTo('aboutCards', {
      duration: 500,
      smooth: true,
      offset: -120,
    })
  }

  useEffect(() => {
    dispatch(fetchLocations({type: 'OLO'}))
    const container = document.createElement('div');
    container.id = 'vev-container'

    const script = document.createElement('script');
    script.src = "https://embed.vev.page/v1/gqVii9xVtn/p-21isBUPPR?target=vev-container";
    script.async = true;

    document.body.appendChild(container)
    container.appendChild(script)

    const root = document.getElementById('root')
    root.style.height = '0px'

    return () => {
      document.body.removeChild(container)
      const scriptTags = document.body.getElementsByTagName('script')
      const len = scriptTags.length
      for(let i = len - 1;i >= 0; i--) {
        scriptTags[i].remove()
      }

      root.style.height = null
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>About | {brand.title}</title>
      </Helmet>
      <HeaderSite />

      {/*<Content>*/}
      {/*  /!*<Main style={{ paddingTop: '0' }}>*!/*/}
      {/*  /!*  <PageHero*!/*/}
      {/*  /!*    announcements={announcements}*!/*/}
      {/*  /!*    imageUrl={isBrowser ? background : mobile}*!/*/}
      {/*  /!*  >*!/*/}
      {/*  /!*    <BackgroundContent*!/*/}
      {/*  /!*      title={title}*!/*/}
      {/*  /!*      subtitle={subtitle}*!/*/}
      {/*  /!*      title_color={colors.light}*!/*/}
      {/*  /!*      subtitle_color={colors.light}*!/*/}
      {/*  /!*      vertical="BOTTOM"*!/*/}
      {/*  /!*      horizontal="LEFT"*!/*/}
      {/*  /!*    >*!/*/}
      {/*  /!*      <ButtonStyled onClick={scrollToMenu} size="big" color="light">*!/*/}
      {/*  /!*        Learn More*!/*/}
      {/*  /!*      </ButtonStyled>*!/*/}
      {/*  /!*    </BackgroundContent>*!/*/}
      {/*  /!*  </PageHero>*!/*/}
      {/*  /!*  <AboutView>*!/*/}
      {/*  /!*    <PageIntro content={translated} />*!/*/}
      {/*  /!*    <Element name="aboutCards"></Element>*!/*/}
      {/*  /!*  </AboutView>*!/*/}
      {/*  /!*</Main>*!/*/}
      {/*</Content>*/}
    </>
  )
}

export default About
