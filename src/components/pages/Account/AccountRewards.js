import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { isMobile } from 'react-device-detect'
import {
  fetchCustomerRewards,
  selectCustomer,
  selectCustomerRewards,
} from '@open-tender/redux'

import { selectConfig } from '../../../slices'
import { Rewards, Loading } from '../..'
import AccountSectionHeader from './AccountSectionHeader'

const AccountRewardsView = styled.div`
  width: 100%;
  margin: 0 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 0 0 ${(props) => props.theme.layout.paddingMobile};
  }
`

const AccountRewards = () => {
  const dispatch = useDispatch()
  const { auth } = useSelector(selectCustomer)
  const hasCustomer = auth ? true : false
  const rewards = useSelector(selectCustomerRewards)
  const { account: config } = useSelector(selectConfig)
  const { title } = config.rewards
  const { entities, loading, error } = rewards
  const hasRewards = entities.length > 0 && !error
  const displayed = !isMobile ? entities.slice(0, 2) : entities
  const isMore = entities.length > displayed.length

  useEffect(() => {
    if (hasCustomer) {
      dispatch(fetchCustomerRewards())
    }
  }, [dispatch, hasCustomer])

  if (!hasRewards) return null

  return (
    <AccountRewardsView>
      {loading === 'pending' && !hasRewards ? (
        <Loading text="Retrieving rewards..." />
      ) : (
        <>
          <AccountSectionHeader title={title} to={isMore ? '/rewards' : null} />
          <Rewards rewards={displayed} />
        </>
      )}
    </AccountRewardsView>
  )
}

AccountRewards.displayName = 'AccountRewards'
AccountRewards.propTypes = {}

export default AccountRewards
