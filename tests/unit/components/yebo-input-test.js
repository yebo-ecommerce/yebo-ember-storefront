import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('yebo-input', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject();
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it displays errors with punctuation and attribute name if possible', function(assert) {
  assert.expect(2);

  var component = this.subject();
  
  component.set('errors', [
    {
      attribute: "firstName",
      message: "can't be blank"
    },
    {
      attribute: "firstName",
      message: "can't be null"
    }
  ]);

  assert.equal(component.get('displayErrors'), "firstName can't be blank, firstName can't be null.");

  component.set('attributeName', 'First Name');
  assert.equal(component.get('displayErrors'), "First Name can't be blank, First Name can't be null.");
});
