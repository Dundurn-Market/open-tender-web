import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { Box } from '@open-tender/components'
import { useTheme } from '@emotion/react'

const RowView = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  margin: 0 0 ${(props) => props.theme.layout.paddingMobile};
  ${(props) =>
    !props.hasBox
      ? `border: ${props.theme.border.width} solid ${props.theme.border.color};`
      : ''};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const RowIcon = styled.div`
  height: 7.5rem;
  width: 7.5rem;
  flex: 0 1 auto;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 4rem;
    width: 4rem;
  }

  @media (max-width: 280px) {
    height: 7.5rem;
    width: 7.5rem;
  }
`

const RowContent = styled.div`
  padding: 0;
  flex: 1;
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 280px) {
    width: 100%;
    flex-direction: column;
  }
`

const RowText = styled.div`
  flex: 1;

  p {
    margin: 0.5rem 0 0;
    font-size: ${(props) => props.theme.fonts.sizes.small};
    line-height: ${(props) => props.theme.fonts.body.lineHeight};

    &:first-of-type {
      margin: 0rem 0 0;
      font-size: ${(props) => props.theme.fonts.sizes.main};
      color: ${(props) => props.theme.fonts.headings.color};
    }
  }
`

const RowActions = styled.div`
  flex-shrink: 0;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 1rem 0 0;
  }
`

const CompactRow = ({ icon, content, actions, style }) => {
  const theme = useTheme()
  const hasBox = theme.cards.default.bgColor !== 'transparent'
  return (
    <RowView hasBox={hasBox} style={style}>
      <RowContent>
        {icon && <RowIcon>{icon}</RowIcon>}
        <RowText>{content}</RowText>
      </RowContent>
      {actions && <RowActions>{actions}</RowActions>}
    </RowView>
  )
}

CompactRow.displayName = 'Row'
CompactRow.propTypes = {
  icon: propTypes.element,
  content: propTypes.element,
  actions: propTypes.element,
  style: propTypes.object,
}

export default CompactRow
