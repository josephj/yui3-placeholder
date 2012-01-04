/*global YUI, window, document */
/**
 * An Y.Node plugin providing backward compatibility for HTML5 placeholder.
 *
 * @module   placeholder
 * @requires "node-base", "event-base", "event-focus"
 * @author   Caesar Chi
 * @created  2011/08/10
 * @modifier Joseph Chiang
 * @modified 2012/01/04
 */
YUI.add("placeholder", function (Y) {

    /**
     * An Y.Node plugin providing backward compatibility for HTML5 placeholder.
     *
     * @class PlaceholderPlugin
     */
    var MODULE_ID = "PlaceholderPlugin";

    function PlaceholderPlugin (config) {

        // The node placeholder attribute must be defined.
        var placeholder  = config.host.get("placeholder");

        this.node        = config.host;
        this.placeholder = placeholder;

        // Stop if it has native support.
        if ("placeholder" in document.createElement("input")) {
            Y.log("Browser has native support for PlaceHolder.", "info", MODULE_ID);

            // Provide empty functions for browser which supports natively.
            this.clear   = function () {};
            this.destroy = function () {};
            return;
        }

        if (
            placeholder === "" ||
            typeof placeholder === "undefined"
        ) {
            Y.log("You must define placeholder attribute.", "error", MODULE_ID);
            return;
        }

        // Sync UI and bind events.
        this._init();
    }

    // When plugged into a node instance, the plugin will be
    // available on the "anchors" property.
    PlaceholderPlugin.NS = "placeholder";
    PlaceholderPlugin.prototype = {
        /**
         * Handles when user blurs the form element.
         *
         * @method _blurHandler
         * @private
         */
        _blurHandler: function () {
            Y.log("_blurHandler(e) is executed.", "info", MODULE_ID);
            Y.later(150, this, function () {
                var node = this.node;
                if (node.get("value") === "") {
                    node.set("value", this.placeholder);
                    node.addClass("placeholder");
                }
            });
        },
        /**
         * Handles when user focus the form element.
         *
         * @method _focusHandler
         * @private
         */
        _focusHandler: function (e) {
            Y.log("_focusHandler(e) is executed.", "info", MODULE_ID);
            var node = this.node;
            if (node.get("value") === this.placeholder) {
                node.set("value", "");
                node.removeClass("placeholder");
            }
        },
        /**
         * Render UI and bind events for placeholder.
         *
         * @method _init
         * @private
         */
        _init: function () {
            Y.log("_init() is executed.", "info", MODULE_ID);
            var node        = this.node,
                placeholder = this.placeholder;

            // Do nothing if user has already focused the node.
            // It helps to solve the bug in miiiCasa before login page.
            if (!node.test(":focus")) {
                if (node.get("value") === "") {
                    node.set("value", placeholder);
                }
                if (node.get("value") === placeholder) {
                    node.addClass("placeholder");
                }
            }

            node.on("focus", this._focusHandler, this);
            node.on("blur",  this._blurHandler, this);
            // Note : The form submit event which was here has been removed.
            //        Because you can't make sure it's before other form submit handler.
            //        You should always use 'unplug' or 'clear' instead of this.
        },
        /**
         * Remove placeholder text and style.
         * It's useful when you don't want to unplug the placeholder.
         *
         * Usage:
         *     inputNode.placeholder.clear();
         *
         * @method clear
         * @public
         */
        clear: function () {
            Y.log("clear() is executed.", "info", MODULE_ID);
            var node = this.node;
            if (node.hasClass("placeholder")) {
                node.set("value", "");
                node.removeClass("placeholder");
            }
        },
        /**
         * Destroy the plugin instance.
         * It's automatically being called when node unplug method is executed.
         * The placeholder text and style will be removed.
         *
         * Usage:
         *     inputNode.unplug(Y.PlaceholderPlugin);
         *
         * @method destroy
         * @public
         */
        destroy: function () {
            Y.log("destory() is executed.", "info", MODULE_ID);
            var node = this.node;
            if (node.get("value") === this.placeholder) {
                node.set("value", "");
            }
            node.removeClass("placeholder");
        }
    };
    Y.PlaceholderPlugin = PlaceholderPlugin;

}, "0.0.2", {"requires" : ["node-pluginhost"]});
