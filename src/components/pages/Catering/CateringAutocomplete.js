import { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector, useDispatch } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'

import { GoogleMap } from '@open-tender/components'

import { selectSettings } from '../../../slices'
import { MapsAutocomplete } from '../..'

const CateringMapView = styled('div')`
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
`

const CateringMap = ({ mapRef }) => (
  <CateringMapView>
    <div ref={mapRef} />
  </CateringMapView>
)

const CateringAutocompleteView = styled('div')`
  width: 100%;
`

const CateringAutocomplete = () => {
  const { googleMaps } = useSelector(selectSettings)
  const { apiKey, defaultCenter, zoom, styles } = googleMaps
  const [, setCenter] = useState(defaultCenter)
  // const serviceTypeDisabled = !address ? true : false

  return (
    <CateringAutocompleteView>
      <GoogleMap
        apiKey={apiKey}
        zoom={zoom}
        styles={styles}
        center={defaultCenter}
        loader={<ClipLoader size={30} loading={true} />}
        renderMap={(props) => <CateringMap {...props} />}
      >
        <MapsAutocomplete setCenter={setCenter} center={defaultCenter}/>
      </GoogleMap>
    </CateringAutocompleteView>
  )
}

CateringAutocomplete.displayName = 'CateringAutocomplete'
CateringAutocomplete.propTypes = {}

export default CateringAutocomplete
