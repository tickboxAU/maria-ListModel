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

/**

A constructor function for creating `ObjectList`

*/
maria.ObjectList = function() {
    this._maria_ListModel_elements = [];
};

maria.ObjectList.superConstructor = Object;

/**

Call a function over every element in this list.

var alpha = {value: 0};
var beta = {value: 1};
var gamma = {value: 2};
var list = new maria.ObjectList(alpha, beta, gamma);
list.forEach(function(element) {
    console.log(element.value);
});

*/
maria.ObjectList.prototype.forEach = function(callbackfn /*, thisArg */) {
    var thisArg = arguments[1];
    var length = this._maria_ListModel_elements.length;
    for (var i = 0; i < length; i++) {
        if (Object.prototype.hasOwnProperty.call(this._maria_ListModel_elements, i)) {
            callbackfn.call(thisArg, this._maria_ListModel_elements[i]);
        }
    }
};

/**

Returns the object list as an array

*/
maria.ObjectList.prototype.toArray = function() {
    return this._maria_ListModel_elements;
};

/**

Calls `callbackfn` for each element of the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new maria.ObjectList(one, two, three);
    set.any(function(element) {
        return element.value < 2;
    }); // true

@param {function} callbackfn The function to call for each element in the set.

@param {Object} [thisArg] The object to use as the this object in calls to callbackfn.

@return {boolean} `true` if `callbackfn` returns a truthy value for at least one element in the set. Otherwise `false`.

*/

maria.ObjectList.prototype.any = function(callbackfn /*, thisArg */) {
    var thisArg = arguments[1];
    var length = this._maria_ListModel_elements.length;
    for (var i = 0; i < length; i++) {
        if (Object.prototype.hasOwnProperty.call(this._maria_ListModel_elements, i) && callbackfn.call(thisArg, this._maria_ListModel_elements[i])) {
            return true;
        }
    }
    return false;
};

/**

Calls `callbackfn` for each element of the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new maria.ObjectList(one, two, three);
    set.all(function(element) {
        return element.value < 2;
    }); // false

@param {function} callbackfn The function to call for each element in the set.

@param {Object} [thisArg] The object to use as the this object in calls to callbackfn.

@return {boolean} `true` if `callbackfn` returns a truthy value for all elements in the set. Otherwise `false`.

*/

maria.ObjectList.prototype.all = function(callbackfn /*, thisArg */) {
    var thisArg = arguments[1];
    var length = this._maria_ListModel_elements.length;
    for (var i = 0; i < length; i++) {
        if (Object.prototype.hasOwnProperty.call(this._maria_ListModel_elements, i) && !callbackfn.call(thisArg, this._maria_ListModel_elements[i])) {
            return false;
        }
    }
    return true;
};

/**

Calls an accumulating callback function over the object list.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var list = new maria.ObjectList(one, two, three);
    list.reduce(function(accumulator, element) {
        return {value: accumulator.value + element.value};
    }); // {value:6}
    list.reduce(function(accumulator, element) {
        return accumulator + element.value;
    }, 4); // 10

*/
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

/**

Calls a mapping function over the object list.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var list = new maria.ObjectList(one, two, three);
    list.map(function(element) {
        return {value: element.value * 2};
    }); // maria.ObjectList([{value:2}, {value:4}, {value:6}])
    list.map(function(element) {
        return element.value;
    }); // maria.ObjectList([1, 2, 3])

*/
maria.ObjectList.prototype.map = function(callbackfn) {
    return this.reduce(function(accumulator, element) {
        accumulator.add(callbackfn(element));
        return accumulator;
    }, new this.constructor());
};

/**

Calls a mapping function over the object list.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var list = new maria.ObjectList(one, two, three);
    list.select(function(element) {
        return element.value >= 2;
    }); // maria.ObjectList([{value:2}, {value:3}])

*/
maria.ObjectList.prototype.select = function(callbackfn) {
    return this.reduce(function(accumulator, element) {
        if (callbackfn(element)) {
            accumulator.add(element);
        }
        return accumulator;
    }, new this.constructor());
};

/**

Returns the first element in the object list. 
Optionally takes a function which returns a boolean to find the first element that satisfies its condition.


var alpha = {value: 0};
var beta = {value: 1};
var gamma = {value: 2};
var list = new maria.ObjectList(alpha, beta, gamma);
console.log(list.first().value); // Outputs '0'
console.log(list.first(function(element) {element.value > 0}).value); // Outputs '1'

*/
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

/**

Adds the element to the object list

*/
maria.ObjectList.prototype.add = function(element) {
    if (this.has(element)) {
        return false;
    }
    else {
        this._maria_ListModel_elements[this._maria_ListModel_elements.length] = element;
        return true;
    }
};

/**

Returns the index of an element in the list.
Will return -1 if the element doesn't exist

*/
maria.ObjectList.prototype.indexOf = function(element) {
    return this._maria_ListModel_elements.indexOf(element);
};

/**

@property maria.LeafModel.superConstructor

*/
maria.ObjectList.prototype.has = function(element) {
    return this.indexOf(element) != -1;
};

/**

Removes a specific element from the list

*/
maria.ObjectList.prototype['delete'] = function(element) {
    var index = this.indexOf(element);
    if (index != -1) {
        this._maria_ListModel_elements.splice(index, 1);
    }
    return index != -1;
};

/**

Clears the list

*/
maria.ObjectList.prototype.clear = function() {
    if (this._maria_ListModel_elements.length > 0) {
        this._maria_ListModel_elements = [];
        return true;
    }
    return false;
};

/**

Returns the number of elements in the object list

*/
maria.ObjectList.prototype.length = function() {
    return this._maria_ListModel_elements.length;
};

/**

Returns if the object list has no elements

*/
maria.ObjectList.prototype.isEmpty = function() {
    return this.length() === 0;
};

/**

Mixes in the `ObjectList` methods into any object.

*/
maria.ObjectList.mixin = function(obj) {
    for (var p in maria.ObjectList.prototype) {
        if (Object.prototype.hasOwnProperty.call(maria.ObjectList.prototype, p) &&
            (typeof maria.ObjectList.prototype[p] === 'function')) {
            obj[p] = maria.ObjectList.prototype[p];
        }
    }
    maria.ObjectList.call(obj);
};