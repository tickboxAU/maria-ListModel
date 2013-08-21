maria.ListModel = function() {
    maria.ObjectList.apply(this, arguments);
    maria.Model.call(this);
};

/**

@property maria.ListModel.superConstructor

*/
maria.ListModel.superConstructor = maria.Model;

maria.ListModel.prototype = maria.create(maria.Model.prototype);
maria.ListModel.prototype.constructor = maria.ListModel;

maria.ObjectList.mixin(maria.ListModel.prototype);

maria.ListModel.subclass = function() {
    maria.Model.subclass.apply(this, arguments);
};

maria.ListModel.prototype.removeChildEventListener = function(element) {
    if (typeof element.removeEventListener === 'function') {
        element.removeEventListener('destroy', this);
    }
    if (typeof element.removeParentEventTarget === 'function') {
        element.removeParentEventTarget(this);
    }
};

maria.ListModel.prototype.addChildEventListener = function(element) {
    if ((typeof element.addEventListener === 'function') &&
        (typeof element.removeEventListener === 'function')) {
        element.addEventListener('destroy', this);
    }
    if ((typeof element.addParentEventTarget === 'function') &&
        // want to know can remove later
        (typeof element.removeParentEventTarget === 'function')) {
        element.addParentEventTarget(this);
    }
};

maria.ListModel.prototype.clear = function() {
    var deleted = this.toArray();
    var result = maria.ObjectList.prototype.clear.call(this);
    if (result) {
        for (var i = 0, ilen = deleted.length; i < ilen; i++) {
            var element = deleted[i];
            if (typeof element.removeEventListener === 'function') {
                element.removeEventListener('destroy', this);
            }
            if (typeof element.removeParentEventTarget === 'function') {
                element.removeParentEventTarget(this);
            }
        }
        this.dispatchEvent({type: 'change', newTargets: [], addedTargets: [], deletedTargets: deleted});
    }
    return result;
};

maria.ListModel.prototype.handleEvent = function(evt) {

    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this list.
    if ((evt.type === 'destroy') &&
        (evt.currentTarget === evt.target)) {
        this['delete'](evt.target);
    }
};

maria.ListModel.prototype.removeChild = function(child) {
    if (maria.ObjectList.prototype['delete'].call(this, child)) {
        if (typeof child.removeEventListener === 'function') {
            child.removeEventListener('destroy', this);
        }
        if (typeof child.removeParentEventTarget === 'function') {
            child.removeParentEventTarget(this);
        }
        return true;
    }
    return false;
};

maria.ListModel.prototype['delete'] = function() {
    var deleted = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (this.removeChild(argument)){
            deleted.push(argument);
        }
    }
    var modified = deleted.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'change', addedTargets: [], deletedTargets: deleted});
    }
    return modified;
};

maria.ListModel.prototype.addChild = function(child) {
    if (maria.ObjectList.prototype.add.call(this, child)) {
        if ((typeof child.addEventListener === 'function') &&
            (typeof child.removeEventListener === 'function')) {
            child.addEventListener('destroy', this);
        }
        if ((typeof child.addParentEventTarget === 'function') &&
            // want to know can remove later
            (typeof child.removeParentEventTarget === 'function')) {
            child.addParentEventTarget(this);
        }
        return true;
    }
    return false;
};

maria.ListModel.prototype.add = function() {
    var added = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (this.addChild(argument)){
            added.push(argument);
        }
    }
    var modified = added.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'change', addedTargets: added, deletedTargets: []});
    }
    return modified;
};

maria.ListModel.prototype.addChildren = function(children) {
    maria.ListModel.prototype.add.apply(this, children);
};
