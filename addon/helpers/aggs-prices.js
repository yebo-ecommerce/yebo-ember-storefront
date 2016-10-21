import Ember from 'ember';

// Create our number formatter.
const formatter = new Intl.NumberFormat('pt-br', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

export default Ember.Helper.helper(function(params, hash) {
  const price = params[0]
  const index = params[1]
  const length = params[2]

  const to = formatter.format(price.to)
  const from = formatter.format(price.from)

  if(to && from === "NaN") {
    return `Até ${to}`
  }

  if(from && to === "NaN") {
    return `A partir de ${from}`
  }

  return `${from} até ${to}`
});

