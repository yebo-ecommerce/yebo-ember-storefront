import Ember from 'ember';

export default Ember.Helper.helper(function(params, hash) {
  const current = params[0]
  const selected = params[1]

  if(current === selected) {
    return 'active';
  }
});
