maria.SetView.subclass(maria, 'ListView');

/**

The handler for `change` events on this view's set model object.

@param {Object} event The event object.

@override

*/
maria.ListView.prototype.update = function(evt) {
    // Don't update for bubbling events.
    if (evt.target === this.getModel() &&
        (evt.addedTargets !== undefined || evt.deletedTargets !== undefined || evt.newChildrenList !== undefined)) {
        this.handleChanged();
    }
};

maria.ListView.prototype.setModel = function(newModel) {
    this.clearChildViews();
    maria.SetView.prototype.setModel.call(this, newModel);
    this.handleChanged();
};

maria.ListView.prototype.clearChildViews = function(childView) {
    // var oldViews = this.childNodes.slice(0);

    // // Place old views into a set
    // for (var i = 0, ilen = oldViews.length; i < ilen; i++) {
    //     var oldView = oldViews[i];

    //     // Remove the view from the DOM
    //     this.removeChild(oldView);
    //     oldView.destroy();
    // }
};

maria.ListView.prototype.findModelViewInViews = function(model, views) {
    for (var i = views.length - 1; i >= 0; i--) {
        var view = views[i];
        if (view.getModel() != null && view.getModel() == model) {
            return view;
        }
    }

    return null;
};

maria.ListView.prototype.handleChanged = function() {
    var modelList = this.getModel();
    var oldViews = this.childNodes.slice(0);
    var newModelMap = {};

    // Place old views into a set
    for (var i = 0, ilen = oldViews.length; i < ilen; i++) {
        try {
            // Remove the view from the DOM
            this.removeChild(oldViews[i]);
        } catch(err) {
            console.log('Unable to remove child view: ' + oldViews[i].build());
        }

    }

    var self = this;
    modelList.forEach(function(model) {
        var view = self.findModelViewInViews(model, oldViews);

        // If a version previously existed
        if (view) {
            wbw.removeFromArray(oldViews, view);
        } else {
            view = self.createChildView(model);
        }

        // Add the view to the dom 
        self.appendChild(view);
    });

    for (var i = oldViews.length - 1; i >= 0; i--) {
        oldViews[i].destroy();
    }
};
