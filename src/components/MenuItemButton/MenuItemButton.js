import propTypes from 'prop-types'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Body, Heading, Preface } from '@open-tender/components'
import MenuItemImage from './MenuItemImage'
import { MenuItemTagImages } from '..'

const MenuItemButtonView = styled.button`
  position: relative;
  flex-grow: 1;
  display: block;
  text-align: left;
  width: 100%;
  margin: 0 0 1.3rem;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      margin: 0;
    }
  }

  &:disabled {
    opacity: 1;
  }
`

const MenuItemContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MenuItemContent = styled.div`
  padding: ${(props) => (props.hasBox ? '1.5rem 1.3rem 0' : '1.1rem 0 0')};

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      padding: ${(props) => (props.hasBox ? '0.9rem 0.9rem' : '0.7rem 0 0')};
    }
  }
`

const MenuItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }

  .centered & {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
  }
`

const MenuItemName = styled(Heading)`
  display: block;
  flex: 1 1 auto;
  padding: 0 0.5rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.big};

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.small};
    }
  }

  .centered & {
    width: 100%;
    text-align: center;
    font-size: ${(props) => props.theme.fonts.sizes.main};
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.small};
    }
  }
`

const MenuItemPriceCals = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  text-align: right;

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      margin: 0.1rem 0 0;
      text-align: left;
    }
  }

  .centered & {
    width: 100%;
    margin: 0.4rem 0 0;
    text-align: center;
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      margin: 0.1rem 0 0;
    }
  }
`

const MenuItemPrice = styled(Heading)`
  font-size: ${(props) => props.theme.fonts.sizes.small};

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.xSmall};
    }
  }

  .centered & {
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.xSmall};
    }
  }
`

const MenuItemCals = styled(Body)`
  font-size: ${(props) => props.theme.fonts.sizes.small};

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.xSmall};
    }
  }

  .centered & {
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.xSmall};
    }
  }
`

const MenuItemTagsAllergens = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 0.9rem 0 0;

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      display: none;
    }
  }

  .centered & {
    justify-content: center;
  }

  span {
    display: block;
  }

  span + span {
    margin-left: 2rem;
  }
`

const MenuItemTag = styled(Preface)`
  font-family: "Full Mrkt Font";
  font-size: ${(props) => props.theme.fonts.sizes.xSmall};
`

const MenuItemAllergen = styled(Preface)`
  font-size: ${(props) => props.theme.fonts.sizes.xxSmall};
  color: ${(props) => props.theme.colors.allergens};
`

const MenuItemDescription = styled(Body)`
  display: block;
  margin: 0.8rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.small};

  .compact & {
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      display: none;
    }
  }

  .centered & {
    display: none;
  }
`

const TagImageContainer = styled.div`
  position: absolute;
  z-index: 3;
  top: -2rem;
  left: 1rem;
`

const MenuItemButton = ({
  onClick,
  disabled,
  showImage,
  imageUrl,
  imageOverlay,
  name,
  desc,
  price,
  cals,
  tags,
  imageTags,
  allergens,
}) => {
  const theme = useTheme()
  const hasBox = theme.cards.menuItem.bgColor !== 'transparent'
  const hasTagsAllergens = tags.length || allergens.length ? true : false
  return (
    <MenuItemButtonView onClick={onClick} disabled={disabled}>
      <MenuItemContainer>
        {showImage && (
          <MenuItemImage imageUrl={imageUrl}>{imageOverlay}</MenuItemImage>
        )}
        <MenuItemContent hasBox={hasBox}>
          <MenuItemInfo>
            <MenuItemName className="title">{name}</MenuItemName>
            {price && price !== '$0.00' ? (
              <MenuItemPriceCals>
                {price ? <MenuItemPrice>{price}</MenuItemPrice> : null}
                {cals ? <MenuItemCals> &mdash; {cals} Cal</MenuItemCals> : null}
              </MenuItemPriceCals>
            ) : null}
          </MenuItemInfo>
          {hasTagsAllergens && (
            <MenuItemTagsAllergens>
              {tags.map((tag) => (
                <MenuItemTag key={tag}>{tag}</MenuItemTag>
              ))}
              {allergens.map((allergen) => (
                <MenuItemAllergen key={allergen}>{allergen}</MenuItemAllergen>
              ))}
            </MenuItemTagsAllergens>
          )}
          {desc && <MenuItemDescription>{desc}</MenuItemDescription>}
        </MenuItemContent>
      </MenuItemContainer>
      {imageTags && imageTags.length !== 0 && (
        <TagImageContainer>
          <MenuItemTagImages tags={imageTags} />
        </TagImageContainer>
      )}
    </MenuItemButtonView>
  )
}

MenuItemButton.displayName = 'MenuItemButton'
MenuItemButton.propTypes = {
  onClick: propTypes.func,
  disabled: propTypes.bool,
  showImage: propTypes.bool,
  imageUrl: propTypes.string,
  imageOverlay: propTypes.element,
  name: propTypes.string,
  desc: propTypes.string,
  price: propTypes.string,
  cals: propTypes.string,
  tags: propTypes.array,
  allergens: propTypes.array,
}

export default MenuItemButton
