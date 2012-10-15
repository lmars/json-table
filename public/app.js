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
    $('table thead tr').empty();
    DataFieldCollection.fetch({ data: { data_type: this.model.get('name') } });
  }
});

DataFieldCollection = new (Backbone.Collection.extend({
  url: "/data-fields"
}));

DataFieldView = Backbone.View.extend({
  tagName: 'label',
  template: function(attributes) {
    return _.template($('#data-field-template').html(), attributes);
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  events: {
    "click input": "chooseField"
  },
  chooseField: function() {
    this.model.set('visible', this.$el.find('input').is(':checked'));
  }
});

DataColumnView = Backbone.View.extend({
  tagName: 'th',
  initialize: function() {
    this.model.bind('change:visible', this.toggleVisible, this);
  },
  render: function() {
    this.$el.html($('<th>').text(this.model.get('name')));
    return this;
  },
  toggleVisible: function() {
    if(this.model.get('visible'))
      $('table thead tr').append(this.render().el);
    else
      this.remove();
  }
});

App = new (Backbone.View.extend({
  initialize: function() {
    DataTypeCollection.bind('reset', this.renderDataTypes, this);
    DataFieldCollection.bind('reset', this.renderDataFields, this);
    DataTypeCollection.fetch();
  },
  renderDataTypes: function(data_types) {
    data_types.each(function(data_type) {
      var view = new DataTypeView({ model: data_type });
      $('#data-types').append(view.render().el);
    });
  },
  renderDataFields: function(data_fields) {
    $('#data-fields').empty();

    data_fields.each(function(data_field) {
      var field_view = new DataFieldView({ model: data_field });
      $('#data-fields').append(field_view.render().el);

      var column_view = new DataColumnView({ model: data_field });
    });
  }
}));
