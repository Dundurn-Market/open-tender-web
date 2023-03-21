import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import { IntercomProvider } from 'react-use-intercom';
import { isMobile } from "react-device-detect";
import { useTheme } from "@emotion/react";

import { selectSidebar } from '../slices'
import { selectNav } from '../slices'
import { remToPx } from "../utils";

const intercom_app_id = process.env.REACT_APP_INTERCOM_APP_ID;

const Intercom = ({ children }) => {
  const theme = useTheme()

  const { isOpen : isCartOpen } = useSelector(selectSidebar)
  const { isOpen : isNavOpen } = useSelector(selectNav)

  useEffect(() => {
    if (typeof window === 'undefined' || window.Intercom === undefined) return

    const isOpen = isCartOpen || isNavOpen
    if (isOpen) {
      window.Intercom('update', { 'hide_default_launcher' : true })
      window.Intercom('hide')
    }
    else window.Intercom('update', { 'hide_default_launcher' : false })
  }, [isCartOpen, isNavOpen])

  return (
    <IntercomProvider
      appId={intercom_app_id}
      autoBoot={true}
      autoBootProps={{
        verticalPadding : isMobile ? 20 : remToPx('5rem'),
        horizontalPadding : isMobile ? 20 : remToPx('2rem'),
        actionColor : theme.buttons.colors.cart.bgColor,
        backgroundColor : theme.bgColors.primary,
      }}
    >
      { children }
    </IntercomProvider>
  )
}

export default Intercom
