import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  productsGrid: service(),

  actions: {
    changeTaxon(taxon) {
      this.get('productsGrid').setTaxon(taxon)
      // this.sendAction('updateUrl', { taxon: taxon })
    },
    changeFilters(filter) {
      this.get('productsGrid').filtersChanged({ name: filter.name, value: filter.value })
      // this.sendAction('updateUrl', { taxon: taxon })
    },
    changePriceRange(priceRange) {
      this.get('productsGrid').set('selected.priceRange', priceRange)
      // this.sendAction('updateUrl', { priceRange: priceRange })
    },
    changeSort(sort) {
      // TODO: maybe validate here
      this.get('productsGrid').set('selected.sort', sort)
      this.sendAction('updateUrl', { sort: sort })
    },
    changeSearch(term) {
      this.get('productsGrid').set('selected.search', term)
      // this.sendAction('updateUrl', { priceRange: priceRange })
    },
  }
});

