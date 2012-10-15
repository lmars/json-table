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
    App.resetView();
    DataCollection.reset();
    App.data_type = this.model;
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
    App.renderData();
  }
});

DataColumnView = Backbone.View.extend({
  tagName: 'th',
  initialize: function() {
    this.model.bind('change:visible', this.toggleVisible, this);
  },
  render: function() {
    this.$el.text(this.model.get('name'));
    return this;
  },
  events: {
    click: 'viewFilters'
  },
  toggleVisible: function() {
    if(this.model.get('visible'))
      $('table thead tr').append(this.render().el);
    else
      this.remove();
  },
  viewFilters: function() {
    (new DataFilterView({ model: this.model })).render();
  }
});

DataCollection = new (Backbone.Collection.extend({
  url: "/data"
}));

DataFilterView = Backbone.View.extend({
  template: function(attributes) {
    return _.template($('#data-filter-template').html(), attributes);
  },
  render: function() {
    $('body').append(this.$el.html(this.template(this.model.toJSON())));
    this.$el.modal();
    return this;
  },
  events: {
    'click .close': 'close',
    'click .apply': 'apply'
  },
  close: function() {
    this.$el.modal('hide');
    this.remove();
  },
  apply: function() {
    order_selection = this.$el.find('.btn.active');

    if(order_selection) {
      App.filters.order = this.model.get('attribute') + ',' + order_selection.text();
    }

    App.fetchData();

    this.close();
  }
});

App = new (Backbone.View.extend({
  initialize: function() {
    this.filters = {}
    DataTypeCollection.bind('reset', this.renderDataTypes, this);
    DataFieldCollection.bind('reset', this.renderDataFields, this);
    DataCollection.bind('reset', this.renderData, this);
    DataFieldCollection.bind('change:visible', this.toggleButton, this);
    DataTypeCollection.fetch();
  },
  resetView: function() {
    $('table thead tr').empty();
    $('table tbody').empty();
    Button.set('visible', false);
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
  },
  toggleButton: function() {
    Button.set('visible', DataFieldCollection.where({ visible: true }).length > 0);
  },
  fetchData: function() {
    DataCollection.fetch({
      data: {
        data_type: App.data_type.get('name'),
        filters:   App.filters
      }
    });
  },
  renderData: function() {
    tbody = $('table tbody');
    tbody.empty();

    DataCollection.each(function(row) {
      tr = $('<tr>');

      DataFieldCollection.each(function(data_field) {
        if(data_field.get('visible')) {
          attribute = data_field.get('attribute');
          tr.append($('<td>').text(row.get(attribute)));
        }
      });

      tbody.append(tr);
    });
  }
}));

Button = new Backbone.Model({ visible: false });

new (Backbone.View.extend({
  tagName: 'button',
  initialize: function() {
    Button.bind('change:visible', this.toggleVisible, this);
  },
  render: function() {
    this.$el.addClass('btn btn-primary').text('Show me some Data!');
    return this;
  },
  events: {
    click: App.fetchData
  },
  toggleVisible: function() {
    $('#data-fields').after(this.render().el);

    if(Button.get('visible'))
      this.$el.show();
    else
      this.$el.hide();
  }
}));
