import styled from '@emotion/styled'
import propTypes from 'prop-types'
import { Body, Heading } from '@open-tender/components'
import { slugify } from '@open-tender/js'

const MenuCategoryHeaderView = styled.div`
  margin: 0 0 3rem;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 0 0 ${(props) => props.theme.layout.marginMobile};
  }
`

const MenuCategoryHeaderTitle = styled(Heading)`
  margin: 0 0 0 -0.1rem;
  font-size: ${(props) =>
    props.theme.fonts.sizes[props.isChild ? 'xBig' : 'xxBig']};
  font-family: 'Full Mrkt Font';
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) =>
      props.theme.fonts.sizes[props.isChild ? 'big' : 'xBig']};
  }
`

const MenuCategoryHeaderSubtitle = styled(Body)`
  margin: 1rem 0 0;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 0.5rem 0 0;
    font-size: ${(props) => props.theme.fonts.sizes.small};
  }
`

const MenuCategoryHeader = ({ title, subtitle, isChild }) => {
  return (
    <MenuCategoryHeaderView>
      <MenuCategoryHeaderTitle id={slugify(title)} as="p" isChild={isChild}>
        {title}
      </MenuCategoryHeaderTitle>
      {subtitle && (
        <MenuCategoryHeaderSubtitle as="p">
          {subtitle}
        </MenuCategoryHeaderSubtitle>
      )}
    </MenuCategoryHeaderView>
  )
}

MenuCategoryHeader.displayName = 'MenuCategoryHeader'
MenuCategoryHeader.propTypes = {
  title: propTypes.string,
  subtitle: propTypes.string,
  isChild: propTypes.bool,
}

export default MenuCategoryHeader
