const { getValueAtSelector } = require(`../../utils`)

const sort = ({ fields = [`id`], order } = {}) => {
  const reverse = order !== `ASC` ? -1 : 1
  const compareValues = (a, b) => {
    switch (typeof a) {
      case `string`:
        return b.localeCompare(a)
      case `number`:
        return b - a
      case `object`:
        if (Array.isArray(a) && Array.isArray(b)) {
          const length = Math.min(a.length, b.length)
          let i = -1
          while (++i < length) {
            const result = compareValues(a[i], b[i])
            if (result) return result
          }
        }
        return 0
      default:
        return a < b ? -1 : 1
    }
  }
  const compare = (a, b, sortFields = fields) => {
    const sortField = sortFields[0]
    if (sortField === undefined) return 0
    const firstValue = getValueAtSelector(a, sortField)
    const secondValue = getValueAtSelector(b, sortField)
    if (firstValue === secondValue) {
      return compare(a, b, sortFields.slice(1))
    }
    return compareValues(firstValue, secondValue) * reverse
  }
  return compare
}

module.exports = sort

// TODO:
// const compare = (a, b) => {
//   let result
//   let i = -1
//   let length = fields.length
//   while (++i < length) {
//     const sortField = fields[i]
//     const firstValue = getValueAtSelector(a, sortField)
//     const secondValue = getValueAtSelector(b, sortField)
//     result = compareValues(firstValue, secondValue)
//     if (result) break
//   }
//   return result * reverse
// }
// return compare

// const compare = (a, b) => {
//   let result = 0
//   fields.some(
//     field =>
//       (result = compareValues(
//         getValueAtSelector(a, field),
//         getValueAtSelector(b, field)
//       ))
//   )
//   return result * reverse
// }
// return compare