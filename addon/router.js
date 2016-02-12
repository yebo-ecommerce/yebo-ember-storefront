export default function(router, ENV) {

  var mountPath      = ENV["yebo"]["mount"];
  var cartPath       = ENV["yebo"]["cartPath"];
  var checkoutPath   = ENV["yebo"]["checkoutPath"];
  var thanksPath     = ENV["yebo"]["thanksPath"];
  var productsPath   = ENV["yebo"]["productsPath"];
  var ordersPath     = ENV["yebo"]["ordersPath"];
  var taxonsPath     = ENV["yebo"]["taxonsPath"];

  router.route('yebo', { resetNamespace: true, path: mountPath }, function () {
    router.route('yebo.cart', { path: mountPath + '/' + cartPath });
    router.route('yebo.checkout', { path: mountPath + '/' + checkoutPath });
    router.route('yebo.thanks', { path: mountPath + '/' + thanksPath });

    router.route('yebo.products', { path: mountPath + '/' + productsPath },function() {
      this.route('index', { path: '/' });
      this.route('show', { path: '/:slug' });
    });

    router.route('yebo.taxons', { path: mountPath + '/' + taxonsPath },function() {
      // @todo Implement this route
      // this.route('index', { path: '/' });
      this.route('show', { path: '/*taxon' });
    });

    router.route('yebo.orders', { path: mountPath + '/' + ordersPath },function() {
      this.route('index', { path: '/' });
      this.route('show', { path: '/:id' });
    });
  });
}
