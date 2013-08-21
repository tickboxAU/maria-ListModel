maria-ListModel
===============

```maria.ObjectList```, ```maria.ListModel```, and ```maria.ListView``` added for order dependant views. 

Usage
-----

```maria.ListModel``` and ```maria.ListView``` are designed to be ordered replacements to maria's ```maria.SetModel``` and ```maria.SetView``` respectively.

An optimisation exists for displaying a new order of models, without tearing down and re-creating the models and views.
Raising a change event on a ```maria.ListModel``` with an array in the argument ```newTargets``` will avoid unnecessarily destroying and re-creating views for any targets that are still in the ```newTargets```.

E.g.
```
this.dispatchEvent({type: 'change', newTargets: newChildModels});
```

Status
------

Beta - Currently used within a [Maria MVC](https://github.com/petermichaux/maria) application.

License
-------

MIT License. See the included LICENSE file for details.