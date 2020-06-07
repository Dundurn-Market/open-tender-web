export const displayPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

export const addCommas = (x, d) => {
  return x.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatQuantity = (n) => {
  return addCommas(parseFloat(n), 0)
}

export const formatDollars = (str, space = '') => {
  const floatPrice = parseFloat(str)
  return floatPrice < 0
    ? `($${addCommas(Math.abs(floatPrice), 2)})`
    : `$${addCommas(floatPrice, 2)}${space}`
}

const getItemOptions = (item) => {
  return item.groups
    .map((group) => group.options.filter((option) => option.quantity > 0))
    .flat()
}

export const makeModifierNames = (item) => {
  return getItemOptions(item)
    .map((option) => option.name)
    .join(', ')
}

export const convertStringToArray = (str) => {
  return str
    ? str
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length)
    : []
}

const makeOrderItemGroups = (optionGroups, isEdit) => {
  if (!optionGroups) return []
  const groups = optionGroups.map((g) => {
    const options = g.option_items.map((o) => {
      const quantity = o.opt_is_default && !isEdit ? o.min_quantity || 1 : 0
      const option = {
        id: o.id,
        name: o.name,
        description: o.description,
        imageUrl: o.small_image_url,
        allergens: convertStringToArray(o.allergens),
        tags: convertStringToArray(o.tags),
        nutritionalInfo: o.nutritional_info,
        cals: o.nutritional_info
          ? parseInt(o.nutritional_info.calories) || null
          : null,
        price: parseFloat(o.price),
        quantity: quantity,
        isDefault: o.opt_is_default,
        increment: o.increment,
        max: o.max_quantity,
        min: o.min_quantity,
      }
      return option
    })
    const group = {
      id: g.id,
      name: g.name,
      description: g.description,
      imageUrl: g.small_image_url,
      included: g.included_options,
      max: g.max_options,
      min: g.min_options,
      options: options,
    }
    return group
  })
  return groups
}

export const calcPrices = (item) => {
  const groups = item.groups.map((g) => {
    let groupQuantity = 0
    const options = g.options.map((o) => {
      const includedRemaining = Math.max(g.included - groupQuantity, 0)
      const priceQuantity = Math.max(o.quantity - includedRemaining, 0)
      const option = { ...o, totalPrice: priceQuantity * o.price }
      groupQuantity += o.quantity || 0
      return option
    })
    return { ...g, quantity: groupQuantity, options }
  })
  const optionsPrice = groups.reduce((t, g) => {
    return t + g.options.reduce((ot, o) => ot + o.totalPrice, 0.0)
  }, 0.0)
  const totalPrice = item.quantity * (item.price + optionsPrice)
  return { ...item, totalPrice: totalPrice, groups: groups }
}

export const makeOrderItem = (item, isEdit) => {
  const groups = makeOrderItemGroups(item.option_groups, isEdit)
  const orderItem = {
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.large_image_url,
    allergens: convertStringToArray(item.allergens),
    tags: convertStringToArray(item.tags),
    nutritionalInfo: item.nutritional_info,
    cals: item.nutritional_info
      ? parseInt(item.nutritional_info.calories) || null
      : null,
    groups: groups,
    quantity: item.min_quantity || 1 * item.increment,
    price: parseFloat(item.price),
    increment: item.increment,
    max: item.max_quantity,
    min: item.min_quantity,
  }
  const pricedItem = calcPrices(orderItem)
  return pricedItem
}

export const makeItemImageUrl = (images) => {
  const imageMap = images
    .filter((i) => i.url)
    .reduce((obj, i) => ({ ...obj, [i.type]: i.url }), {})
  return (
    imageMap.SMALL_IMAGE || imageMap.LARGE_IMAGE || imageMap.APP_IMAGE || null
  )
}

export const makeItemSignature = (item) => {
  const optionIds = item.groups
    .reduce((arr, group) => {
      const ids = group.options.map((o) => o.id)
      return [...arr, ...ids]
    }, [])
    .sort((a, b) => a - b)
  return [item.id, ...optionIds].join('.')
}

export const makeDisplayItemGroups = (optionGroups) => {
  if (!optionGroups || !optionGroups.length) return []
  return optionGroups.map((g) => {
    const options = g.options.map((o) => makeDisplayItem(o))
    return { ...g, options }
  })
}

export const makeDisplayItem = (item, isOption = false) => {
  let displayItem = {
    id: item.id,
    name: item.name,
    shortDescription: item.short_description,
    description: item.description,
    imageUrl: makeItemImageUrl(item.images),
    allergens: item.allergens || [],
    tags: item.tags || [],
    nutritionalInfo: item.nutritional_info || null,
    cals: item.nutritional_info
      ? parseInt(item.nutritional_info.calories) || null
      : null,
    groups: makeDisplayItemGroups(item.groups),
    quantity: item.quantity || 1,
    price: item.price ? parseFloat(item.price) : null,
    totalPrice: item.price_total ? parseFloat(item.price_total) : null,
  }
  // if (item.price) {
  //   displayItem.price = parseFloat(item.price)
  // }
  // if (item.price_total) {
  //   displayItem.totalPrice = parseFloat(item.price_total)
  // }
  if (!isOption) {
    const itemDetails = {
      madeFor: item.made_for,
      notes: item.notes,
      favoriteId: item.favorite_id,
      signature: makeItemSignature(item),
    }
    displayItem = { ...displayItem, ...itemDetails }
  }
  return displayItem
}

export const makeDisplayItems = (orders) => {
  const items = orders.reduce((items, order) => [...items, ...order.items], [])
  return items.map((i) => makeDisplayItem(i))
}

export const makeUniqueDisplayItems = (orders) => {
  const items = makeDisplayItems(orders)
  let unique = [],
    signatures = []
  items.forEach((item) => {
    if (signatures.includes(item.signature)) return
    signatures.push(item.signature)
    unique.push(item)
  })
  return unique
}

export const makeFavoritesLookup = (favorites) => {
  if (!favorites) return {}
  return favorites.reduce(
    (obj, i) => ({ ...obj, [makeItemSignature(i.cart)]: i.favorite_id }),
    {}
  )
}

export const calcCartCounts = (cart) => {
  return cart.reduce((obj, item) => {
    const newCount = (obj[item.id] || 0) + item.quantity
    return { ...obj, [item.id]: newCount }
  }, {})
}

export const addItem = (cart, item) => {
  if (typeof item.index === 'undefined') {
    cart.push({ ...item, index: cart.length })
  } else {
    cart[item.index] = item
  }
  const cartCounts = calcCartCounts(cart)
  return { cart, cartCounts }
}

export const removeItem = (cart, index) => {
  cart.splice(index, 1)
  cart = cart.map((i, index) => ({ ...i, index: index }))
  const cartCounts = calcCartCounts(cart)
  return { cart, cartCounts }
}

export const incrementItem = (cart, index) => {
  const item = cart[index]
  if (item.max === 0 || item.quantity < item.max) {
    let newQuantity = item.quantity + item.increment
    newQuantity = item.max === 0 ? newQuantity : Math.min(item.max, newQuantity)
    const newItem = calcPrices({ ...item, quantity: newQuantity })
    cart[index] = newItem
  }
  const cartCounts = calcCartCounts(cart)
  return { cart, cartCounts }
}

export const decrementItem = (cart, index) => {
  const item = cart[index]
  const newQuantity = Math.max(item.quantity - item.increment, 0)
  if (newQuantity === 0) {
    cart.splice(index, 1)
    cart = cart.map((i, index) => ({ ...i, index: index }))
  } else {
    const newItem = calcPrices({ ...item, quantity: newQuantity })
    cart[index] = newItem
  }
  const cartCounts = calcCartCounts(cart)
  return { cart, cartCounts }
}

export const makeSimpleCart = (cart) => {
  const simpleCart = cart.map((i) => {
    const groups = i.groups.map((g) => {
      const options = g.options
        .filter((o) => o.quantity !== 0)
        .map((o) => ({ id: o.id, quantity: o.quantity }))
      return { id: g.id, options: options }
    })
    return {
      id: i.id,
      quantity: i.quantity,
      groups: groups,
      made_for: i.madeFor || '',
      notes: i.notes || '',
    }
  })
  return simpleCart
}

/* cart validation */

// convert menu items to order items for validation but only include
// items that are already in the cart to save wasted effort
const makeItemLookup = (categories, itemIds) => {
  let itemLookup = {}
  categories.forEach((category) => {
    category.items.forEach((item) => {
      if (itemIds.includes(item.id)) {
        itemLookup[item.id] = makeOrderItem(item, true)
      }
    })
    category.children.forEach((child) => {
      child.items.forEach((item) => {
        if (itemIds.includes(item.id)) {
          itemLookup[item.id] = makeOrderItem(item, true)
        }
      })
    })
  })
  return itemLookup
}

const makeGroupsLookup = (item) => {
  return item.groups.reduce((grpObj, i) => {
    const options = i.options.reduce((optObj, o) => {
      optObj[o.id] = o
      return optObj
    }, {})
    grpObj[i.id] = { ...i, options }
    return grpObj
  }, {})
}

export const printOptionCheck = (option) => {
  console.log(
    option.name,
    option.quantity,
    option.min,
    option.max,
    option.quantity > option.max,
    option.quantity < option.min
  )
}

export const validateCart = (cart, categories, soldOut) => {
  const itemIds = cart.map((item) => item.id)
  const itemLookup = makeItemLookup(categories, itemIds)
  // console.log('itemLookup', itemLookup)
  let errors = null,
    missingItems = [],
    invalidItems = []
  let newCart = cart.map((oldItem) => {
    const newItem = itemLookup[oldItem.id]
    if (!newItem || soldOut.includes(oldItem.id)) {
      missingItems.push(oldItem)
      return null
    }
    let missingGroups = [],
      invalidGroups = [],
      missingOptions = [],
      invalidOptions = []
    const newGroups = makeGroupsLookup(newItem)
    // check if any required groups for the new item are missing from the old item
    const newRequiredGroups = Object.entries(newGroups).filter((i) => i.min > 0)
    const oldGroupIds = oldItem.groups.map((i) => i.id)
    missingGroups = newRequiredGroups.map((i) => !oldGroupIds.includes(i.id))
    const updatedGroups = oldItem.groups.map((group) => {
      const newGroup = newGroups[group.id]
      // check if option group is still part of the item
      if (!newGroup) {
        invalidGroups.push(group)
        return group
      } else {
        const updatedOptions = group.options.map((option) => {
          const newOption = newGroup.options[option.id]
          // check to see if any OLD options aren't avaiilable on the current menu
          // or if any of the options are currently sold out
          if (!newOption || soldOut.includes(option.id)) {
            missingOptions.push(option)
            return option
          } else {
            // check to see if option quantity is valid relative to option min & max
            // ignore the option increment setting for the time being
            if (
              (newOption.max && option.quantity > newOption.max) ||
              (newOption.min && option.quantity < newOption.min)
            ) {
              // printOptionCheck(option)
              invalidOptions.push(option)
              return option
            } else {
              // update the old option price to the new option price
              const updatedOption = { ...option, price: newOption.price }
              return updatedOption
            }
          }
        })
        const optionCount = group.options.reduce((t, i) => (t += i.quantity), 0)
        // check to see if the option count is greater than the max (if one exists)
        // or less than the min (if one exists)
        if (
          (newGroup.max && optionCount > newGroup.max) ||
          (newGroup.min && optionCount < newGroup.min)
        ) {
          invalidGroups.push(group)
        }
        const updatedGroup = { ...group, options: updatedOptions }
        return updatedGroup
      }
    })
    if (
      missingGroups.length ||
      invalidGroups.length ||
      missingOptions.length ||
      invalidOptions.length
    ) {
      const invalidItem = {
        ...oldItem,
        missingGroups,
        invalidGroups,
        missingOptions,
        invalidOptions,
      }
      invalidItems.push(invalidItem)
      return null
    } else {
      // check to see if this item's quantity is below the min or
      // above the max from the current menu
      if (
        (newItem.max && oldItem.quantity > newItem.max) ||
        (newItem.min && oldItem.quantity < newItem.min)
      ) {
        invalidItems.append(oldItem)
        return null
      }
      const updatedItem = { ...oldItem, groups: updatedGroups }
      // update the old item price to the new item price
      updatedItem.price = newItem.price
      const pricedItem = calcPrices(updatedItem)
      return pricedItem
    }
  })
  newCart = newCart.filter((i) => i !== null)
  if (missingItems.length || invalidItems.length) {
    errors = { missingItems, invalidItems }
  }
  return { newCart, errors }
}

export const printCart = (cart) => {
  cart.forEach((item) => {
    console.log(item.name, item.price, item.quantity, item.totalPrice)
    item.groups.forEach((group) => {
      console.log('  ', group.name)
      group.options.forEach((option) => {
        if (option.quantity > 0) {
          console.log(
            '    ',
            option.name,
            option.price,
            option.quantity,
            option.totalPrice
          )
        }
      })
    })
  })
}

/* order submission */

export const prepareOrder = (data) => {
  data = data || {}
  const requestedIso =
    !data.requestedAt || data.requestedAt === 'asap'
      ? new Date().toISOString()
      : data.requestedAt
  const order = {
    location_id: data.locationId || null,
    service_type: data.serviceType || 'PICKUP',
    requested_at: requestedIso,
    cart: data.cart ? makeSimpleCart(data.cart) : [],
  }
  if (data.customer) order.customer = data.customer
  // if (data.details) order.details = data.details
  if (data.details) {
    const details = { ...data.details }
    // person_count must be submitted as integer
    if (details.person_count)
      details.person_count = parseInt(details.person_count)
    order.details = { ...details }
  }
  if (data.discounts) order.discounts = data.discounts
  if (data.promoCodes) order.promo_codes = data.promoCodes
  if (data.tip) order.tip = data.tip
  if (data.tenders) order.tenders = data.tenders
  if (data.address) order.address = data.address
  return order
}

export const handleOrderErrors = (errors, isValidate = true) => {
  return Object.entries(errors).reduce((obj, error) => {
    const [key, value] = error
    let [, entity, field] = key.split('.')
    field = field || entity
    const newErrors = obj[entity]
      ? { ...obj[entity], [field]: value.detail }
      : { [field]: value.detail }
    return { ...obj, [entity]: newErrors }
  }, {})
}

export const checkAmountRemaining = (total, tenders) => {
  const remaining =
    parseFloat(total) -
    tenders.reduce((t, i) => (t += parseFloat(i.amount)), 0.0)
  return remaining === -0.0 ? 0.0 : remaining
}
