DataTypeCollection = new (Backbone.Collection.extend({
  url: "/data-types"
}));

DataTypeView = Backbone.View.extend({
  tagName: 'button',
  render: function() {
    this.$el.text(this.model.get('name'));
    this.$el.addClass('btn btn-primary');
    return this;
  },
  events: {
    "click": "chooseDataType"
  },
  chooseDataType: function() {
    console.log(this.model.get('name'));
  }
});

App = new (Backbone.View.extend({
  initialize: function() {
    DataTypeCollection.bind('reset', this.renderDataTypes, this);
    DataTypeCollection.fetch();
  },
  renderDataTypes: function(data_types) {
    data_types.each(function(data_type) {
      var view = new DataTypeView({ model: data_type });
      $('#data-types').append(view.render().el);
    });
  }
}));
