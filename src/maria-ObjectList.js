maria.ObjectList = function() {
    this._maria_ListModel_elements = [];
};

maria.ObjectList.superConstructor = Object;

maria.ObjectList.prototype.forEach = function(callbackfn /*, thisArg */) {
    var thisArg = arguments[1];
    var length = this._maria_ListModel_elements.length;
    for (var i = 0; i < length; i++) {
        if (Object.prototype.hasOwnProperty.call(this._maria_ListModel_elements, i)) {
            callbackfn.call(thisArg, this._maria_ListModel_elements[i]);
        }
    }
};

maria.ObjectList.prototype.toArray = function() {
    return this._maria_ListModel_elements;
};

maria.ObjectList.prototype.reduce = function(callbackfn /*, initialValue */) {
    var elements = this._maria_ListModel_elements;
    var i = 0;
    var ilen = elements.length;
    var accumulator;
    if (arguments.length > 1) {
        accumulator = arguments[1];
    }
    else if (ilen < 1) {
        throw new TypeError('reduce of empty list with no initial value');
    }
    else {
        i = 1;
        accumulator = elements[0];
    }
    while (i < ilen) {
        accumulator = callbackfn.call(undefined, accumulator, elements[i]);
        i++;
    }
    return accumulator;
};

maria.ObjectList.prototype.first = function(callbackfn) {
    var length = this._maria_ListModel_elements.length;

    if (callbackfn === undefined) {
        return length > 0 ? this._maria_ListModel_elements[0] : null;
    }

    for (var i = 0; i < length; i++) {
        if (Object.prototype.hasOwnProperty.call(this._maria_ListModel_elements, i)) {
            if(callbackfn.call(this._maria_ListModel_elements[i])) {
                return this._maria_ListModel_elements[i];
            }
        }
    }
    return null;
};

maria.ObjectList.prototype.add = function(element) {
    if (this.has(element)) {
        return false;
    }
    else {
        this._maria_ListModel_elements[this._maria_ListModel_elements.length] = element;
        return true;
    }
};

maria.ObjectList.prototype.indexOf = function(element) {
    return this._maria_ListModel_elements.indexOf(element);
};

maria.ObjectList.prototype.has = function(element) {
    return this.indexOf(element) != -1;
};

maria.ObjectList.prototype['delete'] = function(element) {
    var index = this.indexOf(element);
    if (index != -1) {
        this._maria_ListModel_elements.splice(index, 1);
    }
    return index != -1;
};

maria.ObjectList.prototype.clear = function() {
    if (this._maria_ListModel_elements.length > 0) {
        this._maria_ListModel_elements = [];
        return true;
    }
    return false;
};

maria.ObjectList.prototype.isEmpty = function() {
    return this._maria_ListModel_elements.length === 0;
};

maria.ObjectList.mixin = function(obj) {
    for (var p in maria.ObjectList.prototype) {
        if (Object.prototype.hasOwnProperty.call(maria.ObjectList.prototype, p) &&
            (typeof maria.ObjectList.prototype[p] === 'function')) {
            obj[p] = maria.ObjectList.prototype[p];
        }
    }
    maria.ObjectList.call(obj);
};