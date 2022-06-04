import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  About,
  Accessibility,
  AccountAddresses,
  Account,
  AccountAllergens,
  AccountCreditCards,
  AccountGiftCards,
  AccountSettings,
  Catering,
  CateringSite,
  Checkout,
  CheckoutGuest,
  CheckoutSignIn,
  CheckoutSignUp,
  CommsPrefs,
  Confirmation,
  Deals,
  Donations,
  Favorites,
  Fulfillment,
  GiftCards,
  GroupOrderGuest,
  GroupOrderReview,
  GroupOrders,
  Home,
  HouseAccounts,
  LevelUp,
  Locations,
  Loyalty,
  Menu,
  MenuItem,
  MenuSite,
  NotFound,
  Order,
  Orders,
  OrderType,
  Profile,
  QR,
  Rating,
  Refunds,
  ResetPassword,
  RevenueCenters,
  RevenueCenter,
  Rewards,
  SignUp,
  Thanx,
  VerifyAccount,
} from './pages'

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="levelup">
        <Route index element={<LevelUp />} />
        <Route path=":token" element={<LevelUp />} />
      </Route>
      <Route path="thanx/callback" element={<Thanx />} />
      <Route path="qr/:id" element={<QR />} />
      <Route path="order-type" element={<OrderType />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="verify" element={<VerifyAccount />} />
      <Route path="about" element={<About />} />
      <Route path="menu" element={<MenuSite />} />
      <Route path="restaurants" element={<Locations />} />
      <Route path="catering" element={<CateringSite />} />
      <Route path="catering-address" element={<Catering />} />
      <Route path="locations" element={<RevenueCenters />} />
      <Route path="locations/:slug" element={<RevenueCenter />} />
      <Route path="menu/:slug">
        <Route index element={<Menu />} />
        <Route path="item/:itemSlug" element={<MenuItem />} />
      </Route>
      <Route path="join/:token" element={<GroupOrderGuest />} />
      <Route path="review" element={<GroupOrderReview />} />
      <Route path="checkout">
        <Route index element={<Checkout />} />
        <Route path="guest" element={<CheckoutGuest />} />
        <Route path="signin" element={<CheckoutSignIn />} />
        <Route path="signup" element={<CheckoutSignUp />} />
      </Route>
      <Route path="confirmation" element={<Confirmation />} />
      <Route path="curbside/:id" element={<Fulfillment />} />
      <Route path="ratings/:id" element={<Rating />} />
      <Route path="loyalty" element={<Loyalty />} />
      <Route path="rewards" element={<Rewards />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/:id" element={<Order />} />
      <Route path="group-orders" element={<GroupOrders />} />
      <Route path="account">
        <Route index element={<Account />} />
        <Route path="settings" element={<AccountSettings />} />
        <Route path="gift-cards" element={<AccountGiftCards />} />
        <Route path="allergens" element={<AccountAllergens />} />
        <Route path="credit-cards" element={<AccountCreditCards />} />
        <Route path="addresses" element={<AccountAddresses />} />
        <Route path="house-accounts" element={<HouseAccounts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="communications" element={<CommsPrefs />} />
      </Route>
      <Route path="gift-cards" element={<GiftCards />} />
      <Route path="donations" element={<Donations />} />
      <Route path="deals" element={<Deals />} />
      <Route path="accessibility" element={<Accessibility />} />
      <Route path="refunds" element={<Refunds />} />
      <Route path="order" element={<Navigate to="/account" replace />} />
      <Route
        path="order/catering"
        element={<Navigate to="/account" replace />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
