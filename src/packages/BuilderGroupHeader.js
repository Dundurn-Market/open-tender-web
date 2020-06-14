import propTypes from 'prop-types'
import React from 'react'
import BuilderGroupWarning from './BuilderGroupWarning'

const BuilderGroupHeader = ({ group }) => {
  return (
    <div className="builder__group__header">
      <div className="builder__group__info">
        <h3 className="builder__group__name ot-font-size-h5">{group.name}</h3>
        <p className="builder__group__desc font-size-small secondary-color">
          {group.description}
        </p>
      </div>
      <BuilderGroupWarning {...group} />
    </div>
  )
}

BuilderGroupHeader.displayName = 'BuilderGroupHeader'
BuilderGroupWarning.propTypes = {
  group: propTypes.object,
}

export default BuilderGroupHeader
