import propTypes from 'prop-types'
import styled from '@emotion/styled'
import iconMap from '../iconMap'

const SliderArrowView = styled.button`
  display: block;
  width: ${(props) => props.size.toFixed(2)}rem;
  height: ${(props) => props.size.toFixed(2)}rem;
  border-radius: ${(props) => (props.size / 2).toFixed(2)}rem;
  padding: ${(props) => (props.size / 8).toFixed(2)}rem;
  display: flex;
  jstify-content: center;
  align-items: center;
  border-style: solid;
  border-width: ${(props) => props.theme.border.width};
  border-color: ${(props) => props.theme.buttons.colors.light.borderColor};
  background-color: ${(props) => props.theme.buttons.colors.light.bgColor};
  color: ${(props) => props.theme.buttons.colors.light.color};

  &:hover {
    border-color: ${(props) =>
      props.theme.buttons.colors.lightHover.borderColor};
    background-color: ${(props) =>
      props.theme.buttons.colors.lightHover.bgColor};
    color: ${(props) => props.theme.buttons.colors.lightHover.color};
  }

  & > span {
    display: block;
    width: 100%;
    height: 100%;

    svg {
      stroke-width: ${(props) => (props.strokeWidth / 10).toFixed(2)}rem;
    }
  }

  button + & {
    margin-left: ${(props) => (props.size / 4).toFixed(2)}rem;
  }
`

const SliderArrow = ({
  direction,
  size,
  disabled,
  onClick,
  strokeWidth = 2,
}) => {
  return (
    <SliderArrowView
      direction={direction}
      size={size}
      disabled={disabled}
      onClick={onClick}
      strokeWidth={strokeWidth}
    >
      <span>
        {direction === 'LEFT' ? iconMap.ArrowLeft : iconMap.ArrowRight}
      </span>
    </SliderArrowView>
  )
}

SliderArrow.displayName = 'SliderArrow'
SliderArrow.propTypes = {
  direction: propTypes.string,
  size: propTypes.string,
  disabled: propTypes.bool,
  onClick: propTypes.func,
}

export default SliderArrow