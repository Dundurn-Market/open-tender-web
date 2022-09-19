import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Content,
  HeaderDefault, LinkSeparator,
  Loading,
  Main,
  PageContainer,
  PageContent,
  PageError,
  PageTitle,
  Row
} from '../../index'
import {
  fetchCustomerRecurrences, selectCustomer,
  selectCustomerRecurrences,
  selectCustomerRecurrencesLoadingStatus, selectMenuItems
} from '@open-tender/redux'
import { useDispatch, useSelector } from 'react-redux'
import { cardIconMap } from '../../../assets/cardIcons'
import { BgImage, ButtonLink, ButtonStyled, Checkmark, Preface } from '@open-tender/components'
import styled from '@emotion/styled'

const RecurringItemView = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 1.5rem 0;
  border-bottom-style: solid;
  border-bottom-width: ${(props) => props.theme.border.width};
  border-bottom-color: ${(props) => props.theme.border.color};

  &:last-of-type {
    border: 0;
  }
`

const RecurringItemImage = styled(BgImage)`
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  width: 7.5rem;
  height: 7.5rem;
  overflow: hidden;
  border-radius: ${(props) => props.theme.border.radiusSmall};
  background-color: ${(props) => props.theme.bgColors.tertiary};
  display: flex;
`

const Recurrences = () => {
  const dispatch = useDispatch()

  //dispatch(fetchCustomerRecurrences())
  const recurrences = useSelector(selectCustomerRecurrences)
  const loading = useSelector(selectCustomerRecurrencesLoadingStatus)
  const isLoading = loading === 'pending'
  const {entities: menuItems} = useSelector(selectMenuItems)
  const menuItemsMap = new Map(menuItems.map(item => [item.id, item]))

  let filteredRecurrences = []
  if (recurrences != null) {
    Object.entries(recurrences).forEach(([key, recurrence]) => {
      const item = menuItemsMap.get(recurrence.item_id)
      if (item) {
        filteredRecurrences.push({...recurrence, item})
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>
          Recurring Items
        </title>
      </Helmet>
      <Content>
        <HeaderDefault />
        <Main>
          <PageContainer style={{ maxWidth: '86.8rem' }}>
            <PageTitle title='Recurring Items' subtitle='yayaya' />
            {/*<PageError error={error} />*/}
            {recurrences != null ? (
              <div>
                {filteredRecurrences.map((recurrence) => (
                  <Row
                    key={recurrence.id}
                    icon={<RecurringItemImage as="span" style={{ backgroundImage: `url('${recurrence.item.small_image_url}')` }} />}
                    content={
                      <>
                        {/*{creditCard.is_default && (*/}
                        {/*  <Preface*/}
                        {/*    size="xSmall"*/}
                        {/*    style={{*/}
                        {/*      display: 'inline-block',*/}
                        {/*      margin: '0 1.0rem 0.3rem 0',*/}
                        {/*    }}*/}
                        {/*  >*/}
                        {/*    Primary*/}
                        {/*  </Preface>*/}
                        {/*)}*/}
                        <p className="title">{recurrence.item.name} - {recurrence.frequency}</p>
                        <p>Started at: {recurrence.requested_at.split("T")[0]}</p>
                        <p>Next order: {recurrence.requested_at.split("T")[0]}</p>
                        <p><ButtonLink disabled={isLoading}>edit</ButtonLink><LinkSeparator /><ButtonLink disabled={isLoading}>see next order</ButtonLink></p>
                        {/*<p>*/}
                        {/*  {showDefault && (*/}
                        {/*    <>*/}
                        {/*      <ButtonLink*/}
                        {/*        onClick={() => handleDefault(creditCard)}*/}
                        {/*        disabled={creditCard.is_default || isLoading}*/}
                        {/*      >*/}
                        {/*        make primary*/}
                        {/*      </ButtonLink>*/}
                        {/*      <LinkSeparator />*/}
                        {/*    </>*/}
                        {/*  )}*/}

                        {/*  <ButtonLink*/}
                        {/*    onClick={() => handleDelete(creditCard)}*/}
                        {/*    disabled={isLoading}*/}
                        {/*  >*/}
                        {/*    remove*/}
                        {/*  </ButtonLink>*/}
                        {/*</p>*/}
                      </>
                    }
                    actions={
                    <>
                      <ButtonStyled
                        onClick={() => {}}
                        size="small"
                        disabled={isLoading}
                        style={{marginRight:'1rem'}}
                      >
                        Go to next Order
                      </ButtonStyled>
                      <ButtonStyled
                        onClick={() => {}}
                        size="small"
                        disabled={isLoading}
                      >
                        Cancel Subscription
                      </ButtonStyled>
                    </>
                    }
                  />
                ))}
              </div>
            ) : (
              <PageContent>
                {isLoading ? (
                  <Loading text="Retrieving your recurring items..." />
                ) : (
                  <p>Looks like you haven't added any recurring items.</p>
                )}
              </PageContent>
            )}
          </PageContainer>
        </Main>
      </Content>
    </>
  )
}

export default Recurrences