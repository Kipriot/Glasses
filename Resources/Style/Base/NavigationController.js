/**
 * NavigationController - deal with a succession of view
 * so that they can be pushed or poped.
 *
 * Currently it is tied to MediaListView.
 *
 * @constructor
 */
var NavigationController = function()
{
    this.element = document.createElement("div");

    // Make sure this is focusable
    this.element.setAttribute('tabIndex', 1);

    /**
     * @type {Array.<MediaListView>}
     */
    this.items = new Array();
}

NavigationController.prototype = {

    /**
     * @param {Element} parentElement
     */        
    attach: function(parentElement)
    {
        this.element.addEventListener('mousedown', this.mouseDown.bind(this), false);
        this.element.addEventListener('keydown', this.keyDown.bind(this));
        parentElement.appendChild(this.element);
    },

    detach: function()
    {
        this.element.removeEventListener('keydown');
    },

    mouseDown: function(event)
    {
        // Block the event, so that's it's not interpreted as a drag event.
        event.stopPropagation();
    },
    
    keyDown: function(event)
    {
        this.currentView.keyDown(event);
    },

    /**
     * @type {MediaListView} currentView
     */        
    get currentView()
    {
        return last(this.items);
    },

    /**
     * @param {MediaListView} item
     */            
    push: function(item)
    {
        var current = item;
        var previous = window.last(this.items);

        this.items.push(item);
    
        item.navigationcontroller = this;

        
        // New container start at the right
        item.element.removeClassName("current");
        item.element.removeClassName("left");
        item.element.addClassName("right");

        // Attach the item to that container
        if (item.isAttached)
            item.cancelPendingDetach();
        else
            item.attach(this.element);            

        window.setTimeout(function(){
            // Move the new container to the center
            item.element.addClassName("current");
            item.element.removeClassName("right");
            item.element.removeClassName("left");

            // while previous container moves to the left
            if (previous) {
                previous.element.removeClassName("right");
                previous.element.removeClassName("current");
                previous.element.addClassName("left");
            }
        }, 0);        
    },
    hasElementToPop: function()
    {
        return this.items.length > 1;
    },
    pop: function()
    {
        console.assert(this.hasElementToPop());
        if (!this.hasElementToPop())
            return;
        
        var item = this.items.pop();
        var current = window.last(this.items);

        item.element.addClassName("right");
        item.element.removeClassName("current");
        item.element.removeClassName("left");

        current.element.addClassName("current");
        current.element.removeClassName("left");
        current.element.removeClassName("right");

        // Get rid of that item in the DOM after animation has occured
        item.detachAfterDelay(1000);
    }
}

