/**

The MIT License (MIT)

Copyright (c) 2013 Tickbox

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

maria.SetView.subclass(maria, 'ListView');

/**

The handler for `change` events on this view's list model object.

@param {Object} event The event object.

@override

*/
maria.ListView.prototype.update = function(evt) {
    // Don't update for bubbling events.
    if (evt.target === this.getModel() &&
        (evt.addedTargets !== undefined || evt.deletedTargets !== undefined || evt.newTargets !== undefined)) {
        this.handleChanged();
    }
};

maria.ListView.prototype.setModel = function(newModel) {
    maria.SetView.prototype.setModel.call(this, newModel);
    this.handleChanged();
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
            oldViews.remove(oldViews.indexOf(view));
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
