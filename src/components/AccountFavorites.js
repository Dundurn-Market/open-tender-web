import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { slugify } from '../packages/utils/helpers'
import { makeDisplayItem } from '../packages/utils/cart'
import { selectAccountConfigSections } from '../slices/configSlice'
import {
  selectToken,
  selectCustomerFavorites,
  fetchCustomerFavorites,
} from '../slices/customerSlice'
import SectionHeader from './SectionHeader'
import SectionLoading from './SectionLoading'
import SectionError from './SectionError'
import SectionEmpty from './SectionEmpty'
import OrderItemCard from './OrderItemCard'
import { Button } from '../packages'
import SectionFooter from './SectionFooter'

const AccountFavorites = () => {
  const dispatch = useDispatch()
  const [favorites, setFavorites] = useState([])
  const [count, setCount] = useState(4)
  const limit = 12
  const {
    favorites: { title, subtitle, empty },
  } = useSelector(selectAccountConfigSections)
  const { entities, loading, error } = useSelector(selectCustomerFavorites)
  const isLoading = loading === 'pending'
  const token = useSelector(selectToken)

  useEffect(() => {
    dispatch(fetchCustomerFavorites({ token }))
  }, [dispatch, token])

  useEffect(() => {
    const items = entities
      .map((i) => ({ ...i, item: makeDisplayItem(i.item) }))
      .slice(0, count)
    setFavorites(items)
  }, [entities, count])

  return (
    <div id={slugify(title)} className="section container ot-section">
      <div className="section__container">
        <SectionHeader title={title} subtitle={subtitle} />
        <SectionLoading loading={isLoading} />
        <SectionError error={error} />
        <div className="section__content -wide">
          {favorites.length ? (
            <div className="section__items">
              {favorites.map((favorite) => {
                return (
                  <div key={favorite.favorite_id} className="section__item">
                    <OrderItemCard item={favorite.item} />
                  </div>
                )
              })}
            </div>
          ) : (
            <SectionEmpty message={empty} />
          )}
        </div>
        {entities.length > count ? (
          <SectionFooter>
            {count === limit ? (
              <Link to="/favorites">See all favorites</Link>
            ) : (
              <Button classes="btn-link" onClick={() => setCount(limit)}>
                Load more favorites
              </Button>
            )}
          </SectionFooter>
        ) : null}
      </div>
    </div>
  )
}

AccountFavorites.displayName = 'AccountFavorites'
export default AccountFavorites