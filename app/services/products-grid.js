import Ember from 'ember';

export default Ember.Service.extend({
  // Init
  hasInit: false,

  // Params
  selected: {
    permalink: null,
    search: null,
    page: null,
    perPage: null,
    filters: null,
    taxon: null,
    priceRange: null,
    sort: null
  },

  // query
  query: {},

  aggsQuery: {},

  // Loadin property
  loading: false,

  // yebi
  yebo: {},

  // @param {String} permalink:
  //    Principal permalink, the products listed here will always belong to this taxon
  // @param {String} search:
  //    Filter the listed products by this search string
  // @param {Array} filters:
  //    Diferent from taxon, filters are a and
  // @param {Object} priceRange:
  // @param {Integer} page:
  // @param {String} sort:
  // @param {String} taxon:
  // @param {Object} yebo:
  initService({ permalink=null, search=null, filters=[], priceRange=null, page=1, perPage=15, sort='name-asc', taxon=null, yebo=null }){
    // TODO: Validate
    this.yebo = yebo
    //
    let searches = []
    if(search !== null) {
      searches = search.split(',')
      search = searches[0]
    }
    permalink = permalink === "" ? undefined : permalink

    this.loadProducts({ permalink: permalink, search: search, filters: filters, priceRange: priceRange, page: page, perPage: perPage, sort: sort, taxon: taxon })
    this.loadAggs({ permalink: permalink, filters: filters, search: search })

    // save
    this.set('selected.permalink', permalink)
    this.set('selected.search', search)
    this.set('selected.page', page)
    this.set('selected.per_page', perPage)
    this.set('selected.filters', filters)
    this.set('selected.priceRange', priceRange)
    this.set('selected.sort',  sort)

    // save aggs
    this.set('aggs.searches', searches)

    // set as inited
    this.set('hasInit', true)
  },

  loadProducts({ search=null, permalink=null, page=null, perPage=15, sort=null, filters=[], taxon=null, priceRange=null }){
    // Create a new query
    const query = new YeboSDK.Products();

    // Define the number of results per page
    query.perPage(perPage);

    // Set the search
    if( search !== undefined ) {
      query.search(search);
    }

    // Sort options
    const splitSort = sort.split('-');
    query.sortBy(splitSort[0], splitSort[1]);

    // Set the page
    query.page(page);

    // get filters
    const getFilters = (filters) => {
      // Order item by key
      filters = filters.reduce((self, item) => {
        let key = item.name
        self[key] = self[key] || []
        self[key].push(item.value)
        return self
      }, {})

      return Object.keys(filters).map(key => new YeboSDK.Products.Rules.filter(key, filters[key]))
    }

    const rules = [
      new YeboSDK.Products.Rules.taxonomy([ permalink ]),
      new YeboSDK.Products.Rules.taxonomy([ taxon ])
    ].concat(getFilters(filters))

    // Set the price filter
    if( priceRange !== null ) {
      // Set the from value
      const fromValue = priceRange.from === undefined ? 0 : priceRange.from;

      // Add the rule
      rules.push(new YeboSDK.Products.Rules.price(fromValue, priceRange.to));
    }

    // Set it into the query
    query.and(rules.filter(r => r.values[0] != null))

    this.set('loading', true)
    // Set promise
    this.get('yebo.products').search(query).then(res => {
      this.set('loading', false)
      this.set('list', res.products)
      this.set('meta', res.meta)
    })
    // Create a new query
    this.query = query
  },

  loadAggs({ permalink=null, search=null, filters=[], priceRange=null, reload=false }){
    // Setup aggs
    const aggsQuery = new YeboSDK.Products()

    if( search !== null ) {
      aggsQuery.search(search);
    }

    // QUERY: Should i filter by filter?
    const rules = [
      new YeboSDK.Products.Rules.taxonomy([ permalink ])
    ]

    // Set the price filter
    if( priceRange !== null ) {
      // Set the from value
      const fromValue = priceRange.from === undefined ? 0 : priceRange.from;

      // Add the rule
      rules.push(new YeboSDK.Products.Rules.price(fromValue, priceRange.to));
    }

    aggsQuery.and(rules.filter(r => r.values[0] != undefined))

    // Check if its necessary to get the aggregations
    const aggsPromise = aggsQuery.aggregations(undefined, [
      { to: 9.99 },
      { from: 10.00 , to: 19.9 },
      { from: 20.0 }
    ])

    // Set promise
    aggsPromise.then(res => {
      //TODO: Change this
      //maybe an attribute of fixed
      if ( Ember.isEmpty(this.get('aggs.prices')) || reload ){
        this.set('aggs.prices', res.prices)
      }
      this.set('aggs.filters', res.filters)
      this.set('aggs.taxons', res.taxons)
    })

    // Set Aggs
    this.aggsQuery = aggsQuery
  },

  // Data
  list: [],
  meta: [],

  aggs: {
    taxons: [],
    prices: [],
    filters: [],
    searches: []
  },

  sizes: Ember.computed('aggs.taxons', function() {
    return this.get('aggs').taxons.filter(t => t.permalink.indexOf("tamanhos") === 0 )
  }),

  brands: Ember.computed('aggs.taxons', function() {
    return this.get('aggs').taxons.filter(t => t.permalink.indexOf("marcas") === 0 )
  }),

  categories: Ember.computed('aggs.taxons', function() {
    return this.get('aggs').taxons.filter(t => t.permalink.indexOf("marcas") === -1 )
  }),

  prices: Ember.computed('aggs.prices', function() {
    return this.get('aggs').prices.filter(p => p.count > 0)
  }),

  // return filters values and associate filter name
  filters: Ember.computed('aggs.filters', function() {
    return this.get('aggs').filters.map(f => { f.values.map(v => { v.name = f.name; return v }); return f } )
  }),

  searches: Ember.computed('aggs.searches', function() {
    return this.get('aggs').searches
      .map(q => { return { value: q, selected: [q] } })
      .map(q => {
        this.get('aggs').searches.forEach(s => { if (s !== q.value) { q.selected.push(s) } })
        return q
      })
  }),

  // Watchers
  permalinkChanged: Ember.observer('selected.permalink', function() {
    //document.getElementById("input-search").value = "";
    const permalink = this.get('selected.permalink')
    if (permalink === null) {
      return
    }
    const filters = this.get('selected.filters')
    this.loadAggs({ permalink: permalink, filters: filters, reload: true })
    // this.updateAttrs()
    // Load taxons

    this.yebo.store.find('taxon', permalink).then(t => {
      this.set('taxon', t)
    })
  }),

  pageChanged: Ember.observer('selected.page', function() {
    const page = this.get('selected.page')
    this.updateAttrs( page )
  }),

  sortChanged: Ember.observer('selected.sort', function() {
    this.updateAttrs()
  }),

  setTaxon(taxon) {
    const currentTaxon = this.get('selected.taxon')
    this.set('selected.taxon', (currentTaxon === taxon ? null : taxon))
    this.updateAttrs()
  },

  filtersChanged(filters) {
    if(!this.get('hasInit')) { return }

    let currentFilters = this.selected.filters

    currentFilters.pushObject(filters)

    const isEqual = (obj1, obj2) => {
      return obj1.name === obj2.name && obj1.value === obj2.value
    }

    const repetedFilter = currentFilters.filter(f => isEqual(f, filters))

    currentFilters = currentFilters.filter(f => {
      if(repetedFilter.length === 1) { return true }
      // If there is repetition, remove it
      return !isEqual(repetedFilter[0], f)
    })

    this.set('selected.filters', currentFilters)

    const permalink = this.get('selected.permalink')
    const search = this.get('selected.search')
    const priceRange = this.get('selected.priceRange')
    const sort = this.get('selected.sort')
    const taxon = this.get('selected.taxon')

    this.loadProducts({ permalink: permalink, search: search, filters: currentFilters, priceRange: priceRange, page: 1, sort: sort, taxon: taxon })
  },

  searchChanged: Ember.observer('selected.search', function() {
    if(!this.get('hasInit')) { return }

    this.set('selected.taxon', null)
    this.set('selected.priceRange', null)

    const permalink = this.get('selected.permalink')
    const search = this.get('selected.search')
    const filters = this.get('selected.filters')
    const priceRange = this.get('selected.priceRange')
    const page = 1
    const sort = this.get('selected.sort')
    const taxon = this.get('selected.taxon')

    this.loadAggs({ permalink: permalink, filters:filters, search: search, priceRange: priceRange, reload: true })
    this.loadProducts({ permalink: permalink, search: search, filters: filters, priceRange: priceRange, page: page, sort: sort, taxon: taxon })
  }),

  priceRangeChanged: Ember.observer('selected.priceRange', function() {
    if(!this.get('hasInit')) { return }
    this.set('selected.taxon', null)

    const permalink = this.get('selected.permalink')
    const search = this.get('selected.search')
    const filters = this.get('selected.filters')
    const priceRange = this.get('selected.priceRange')
    const page = 1
    const sort = this.get('selected.sort')
    const taxon = this.get('selected.taxon')

    this.loadAggs({ permalink: permalink, filters: filters, search: search, priceRange: priceRange })
    this.loadProducts({ permalink: permalink, search: search, filters: filters, priceRange: priceRange, page: page, sort: sort, taxon: taxon })
  }),

  updateAttrs(page=1) {
    if(!this.get('hasInit')) { return }

    const permalink = this.get('selected.permalink')
    const search = this.get('selected.search')
    const filters = this.get('selected.filters')
    const priceRange = this.get('selected.priceRange')
    const sort = this.get('selected.sort')
    const taxon = this.get('selected.taxon')

    this.loadProducts({ permalink: permalink, search: search, filters: filters, priceRange: priceRange, page: page, sort: sort, taxon: taxon })
  }
});



